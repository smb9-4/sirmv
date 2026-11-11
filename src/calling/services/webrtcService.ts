/**
 * WebRTC Peer-to-Peer Voice Calling Service
 * Handles RTCPeerConnection, STUN/TURN ICE negotiation, microphone tracks,
 * remote audio output, mute controls, and connection lifecycle.
 */

export interface WebRTCOptions {
  iceServers: RTCIceServer[];
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onRemoteStream: (stream: MediaStream) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onError: (error: Error) => void;
}

export class WebRTCService {
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private options: WebRTCOptions;
  private isMuted: boolean = false;
  private pendingCandidates: RTCIceCandidateInit[] = [];

  constructor(options: WebRTCOptions) {
    this.options = options;
  }

  /**
   * Safe microphone acquisition with legacy and simple fallback.
   * Best called directly during a User Gesture (button click).
   */
  async acquireMicrophone(): Promise<MediaStream> {
    if (this.localStream && this.localStream.active && this.localStream.getAudioTracks().length > 0) {
      return this.localStream;
    }

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Legacy getUserMedia fallback check
      const n = navigator as any;
      const legacyGetUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;
      if (!legacyGetUserMedia) {
        throw new Error('Microphone access requires HTTPS or localhost. Please access via HTTPS.');
      }

      return new Promise((resolve, reject) => {
        legacyGetUserMedia.call(navigator, { audio: true }, (stream: MediaStream) => {
          this.localStream = stream;
          resolve(stream);
        }, (err: any) => {
          reject(new Error(`Microphone permission denied: ${err.name || err.message}`));
        });
      });
    }

    try {
      // 1. Try with high-quality echo cancellation
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      this.localStream = stream;
      return stream;
    } catch (err: any) {
      console.warn('[WebRTC] Advanced audio constraints failed, trying basic audio...', err.message);
      try {
        // 2. Fallback to basic audio constraint
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        this.localStream = stream;
        return stream;
      } catch (err2: any) {
        console.error('[WebRTC] Microphone permission denied or device not found:', err2);
        throw new Error(`Microphone access error: ${err2.message || 'Permission denied'}`);
      }
    }
  }

  /**
   * Creates RTCPeerConnection with STUN/TURN configuration
   */
  createPeerConnection(): RTCPeerConnection {
    if (this.pc) return this.pc;

    const defaultIceServers: RTCIceServer[] = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
    ];

    const config: RTCConfiguration = {
      iceServers: this.options.iceServers && this.options.iceServers.length > 0
        ? [...this.options.iceServers, ...defaultIceServers]
        : defaultIceServers,
      iceCandidatePoolSize: 2,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
    };

    console.log('[WebRTC] Initializing RTCPeerConnection with servers:', config.iceServers);
    const pc = new RTCPeerConnection(config);
    this.pc = pc;

    // ICE Candidate event
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.options.onIceCandidate(event.candidate);
      }
    };

    // Connection state monitor
    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC] PeerConnection state changed: ${pc.connectionState}`);
      this.options.onConnectionStateChange(pc.connectionState);
    };

    // ICE connection state monitor (fallback)
    pc.oniceconnectionstatechange = () => {
      console.log(`[WebRTC] ICE connection state changed: ${pc.iceConnectionState}`);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        this.options.onConnectionStateChange('connected');
      } else if (pc.iceConnectionState === 'failed') {
        console.warn('[WebRTC] ICE failed, attempting restart...');
        try {
          pc.restartIce();
        } catch (e) {}
      }
    };

    // Remote audio track received
    pc.ontrack = (event) => {
      console.log('[WebRTC] Remote audio track received:', event.track);
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.attachRemoteAudio(this.remoteStream);
        this.options.onRemoteStream(this.remoteStream);
      } else {
        // Fallback for browsers that don't pass streams array
        const newStream = new MediaStream([event.track]);
        this.remoteStream = newStream;
        this.attachRemoteAudio(newStream);
        this.options.onRemoteStream(newStream);
      }
    };

    // Add local tracks if already acquired
    if (this.localStream) {
      this.attachLocalTracks();
    }

    return pc;
  }

  private attachLocalTracks() {
    if (!this.pc || !this.localStream) return;
    const senders = this.pc.getSenders();
    this.localStream.getAudioTracks().forEach((track) => {
      const alreadyAdded = senders.some(s => s.track?.id === track.id);
      if (!alreadyAdded) {
        console.log('[WebRTC] Adding local audio track to RTCPeerConnection:', track.label);
        this.pc!.addTrack(track, this.localStream!);
      }
    });
  }

  /**
   * Caller initiates WebRTC SDP Offer
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    await this.acquireMicrophone();
    const pc = this.createPeerConnection();
    this.attachLocalTracks();

    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    });

    await pc.setLocalDescription(offer);
    return offer;
  }

  /**
   * Callee handles SDP Offer and creates SDP Answer
   */
  async handleOfferAndCreateAnswer(offerSdp: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.acquireMicrophone();
    const pc = this.createPeerConnection();
    this.attachLocalTracks();

    await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));

    // Drain queued ICE candidates received before remote description was set
    await this.drainPendingCandidates();

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    return answer;
  }

  /**
   * Caller sets received SDP Answer
   */
  async handleAnswer(answerSdp: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) throw new Error('PeerConnection not initialized');

    if (this.pc.signalingState !== 'have-local-offer') {
      console.warn(`[WebRTC] Ignoring answer in unexpected state: ${this.pc.signalingState}`);
      return;
    }

    await this.pc.setRemoteDescription(new RTCSessionDescription(answerSdp));

    // Drain queued ICE candidates received before remote description was set
    await this.drainPendingCandidates();
  }

  /**
   * Adds received ICE candidate from signaling with queuing for race conditions
   */
  async addIceCandidate(candidateInit: RTCIceCandidateInit): Promise<void> {
    if (!candidateInit || !candidateInit.candidate) return;

    if (!this.pc || !this.pc.remoteDescription) {
      console.log('[WebRTC] RemoteDescription not set yet; queuing ICE candidate');
      this.pendingCandidates.push(candidateInit);
      return;
    }

    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidateInit));
    } catch (e: any) {
      console.warn('[WebRTC] Failed to add ICE candidate:', e.message);
    }
  }

  private async drainPendingCandidates() {
    if (!this.pc || !this.pc.remoteDescription) return;

    const queue = [...this.pendingCandidates];
    this.pendingCandidates = [];

    for (const candidate of queue) {
      try {
        await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e: any) {
        console.warn('[WebRTC] Error draining queued candidate:', e.message);
      }
    }
  }

  /**
   * Attach remote stream to HTMLAudioElement
   */
  private attachRemoteAudio(stream: MediaStream) {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.autoplay = true;
      (this.audioElement as any).playsInline = true;
      this.audioElement.volume = 1.0;
    }

    this.audioElement.srcObject = stream;
    this.audioElement.play().catch((e) => {
      console.warn('[WebRTC] Audio autoplay blocked, will resume on gesture:', e);
      const resumeAudio = () => {
        this.audioElement?.play();
        window.removeEventListener('click', resumeAudio);
        window.removeEventListener('touchstart', resumeAudio);
      };
      window.addEventListener('click', resumeAudio, { once: true });
      window.addEventListener('touchstart', resumeAudio, { once: true });
    });
  }

  /**
   * Toggle Mute Microphone
   */
  toggleMute(): boolean {
    if (!this.localStream) return false;
    this.isMuted = !this.isMuted;
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = !this.isMuted;
    });
    return this.isMuted;
  }

  /**
   * Set audio output device (speakerphone / headset) where supported
   */
  async setAudioOutputDevice(sinkId: string): Promise<boolean> {
    if (this.audioElement && typeof (this.audioElement as any).setSinkId === 'function') {
      try {
        await (this.audioElement as any).setSinkId(sinkId);
        return true;
      } catch (err) {
        console.warn('[WebRTC] setSinkId failed:', err);
        return false;
      }
    }
    return false;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Cleanly stop tracks and terminate connection
   */
  cleanup() {
    console.log('[WebRTC] Cleaning up tracks, audio element, and RTCPeerConnection...');

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      this.localStream = null;
    }

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }

    if (this.pc) {
      this.pc.onicecandidate = null;
      this.pc.ontrack = null;
      this.pc.onconnectionstatechange = null;
      this.pc.oniceconnectionstatechange = null;
      this.pc.close();
      this.pc = null;
    }

    this.remoteStream = null;
    this.pendingCandidates = [];
    this.isMuted = false;
  }
}
