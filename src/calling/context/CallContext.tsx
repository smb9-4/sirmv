import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io as SocketIOClient, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.js';
import type { ActiveCall } from '../types/index.js';
import { WebRTCService } from '../services/webrtcService.js';
import { audioService } from '../services/audioService.js';
import { apiRequest } from '../services/api.js';

interface CallContextType {
  activeCall: ActiveCall | null;
  isMuted: boolean;
  localAudioLevel: number;
  remoteAudioLevel: number;
  connectionState: RTCPeerConnectionState | 'disconnected';
  initiateCall: (parentUid: string, parentName: string, relationship?: string, parentAvatar?: string | null) => Promise<void>;
  acceptIncomingCall: () => Promise<void>;
  rejectIncomingCall: (reason?: string) => void;
  endActiveCall: (reason?: string) => void;
  toggleMute: () => void;
  changeAudioOutput: (deviceId: string) => Promise<boolean>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, updateContactPresence } = useAuth();
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [localAudioLevel, setLocalAudioLevel] = useState<number>(0);
  const [remoteAudioLevel, setRemoteAudioLevel] = useState<number>(0);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | 'disconnected'>('disconnected');

  const socketRef = useRef<Socket | null>(null);
  const webrtcRef = useRef<WebRTCService | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const visualizerIntervalRef = useRef<any>(null);
  const localAnalyserRef = useRef<any>(null);
  const remoteAnalyserRef = useRef<any>(null);
  const iceServersRef = useRef<RTCIceServer[]>([]);

  // Fetch STUN/TURN servers on mount
  useEffect(() => {
    async function fetchIceServers() {
      try {
        const { iceServers } = await apiRequest<{ iceServers: RTCIceServer[] }>('/calls/ice-servers');
        if (iceServers && iceServers.length > 0) {
          iceServersRef.current = iceServers;
        }
      } catch (e) {
        console.warn('Failed to fetch ICE servers, using default STUN', e);
      }
    }
    fetchIceServers();
  }, []);

  // Initialize Socket.IO connection when user logs in
  useEffect(() => {
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = SocketIOClient({
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected to signaling gateway:', socket.id);
    });

    socket.on('presence:update', (data: { uid: string; name: string; isOnline: boolean }) => {
      updateContactPresence(data.uid, data.isOnline);
    });

    // 1. Incoming Call Event (Calibrated for Parent smartphone interface)
    socket.on('call:incoming', (data: any) => {
      console.log('[Socket] Incoming call received:', data);

      if (data.iceServers) {
        iceServersRef.current = data.iceServers;
      }

      setActiveCall({
        callId: data.callId,
        peerUid: data.studentUid,
        peerName: data.studentName,
        peerRollNumber: data.studentRoll,
        peerAvatar: data.studentAvatar,
        isIncoming: true,
        status: 'ringing',
        durationSeconds: 0,
        statusMessage: 'Incoming call from your child...'
      });

      // Play ringing sound on device
      audioService.startIncomingRingtone();
    });

    // 2. Ringing confirmation for Caller (Student)
    socket.on('call:ringing', (data: any) => {
      console.log('[Socket] Call ringing on parent device:', data);
      setActiveCall(prev => {
        if (!prev) return null;
        return {
          ...prev,
          callId: data.callId,
          status: 'ringing',
          statusMessage: 'Ringing parent smartphone...'
        };
      });
    });

    // 3. Callee Accepted Call -> Caller prepares WebRTC Offer
    socket.on('call:accepted', async (data: any) => {
      console.log('[Socket] Parent accepted call. Initializing WebRTC Offer...');
      setActiveCall(prev => prev ? { ...prev, status: 'connecting', statusMessage: 'Connecting audio...' } : null);
      audioService.stopAllTones();

      try {
        const webrtc = getOrCreateWebRTC(data.callId);
        const offer = await webrtc.createOffer();
        console.log('[Socket] Sending WebRTC SDP offer');
        socket.emit('call:offer', { callId: data.callId, sdp: offer });
      } catch (err: any) {
        console.error('[WebRTC] Error initiating offer:', err);
        socket.emit('call:end', { callId: data.callId, reason: 'microphone_error: ' + err.message });
        handleCallTermination('Microphone or connection error: ' + err.message);
      }
    });

    // 4. Callee receives SDP Offer
    socket.on('call:offer', async (data: any) => {
      console.log('[Socket] Received WebRTC offer. Creating answer...');
      try {
        const webrtc = getOrCreateWebRTC(data.callId);
        const answer = await webrtc.handleOfferAndCreateAnswer(data.sdp);
        console.log('[Socket] Sending WebRTC SDP answer');
        socket.emit('call:answer', { callId: data.callId, sdp: answer });
      } catch (err: any) {
        console.error('[WebRTC] Error answering offer:', err);
        socket.emit('call:end', { callId: data.callId, reason: 'answer_failed: ' + err.message });
        handleCallTermination('Audio link error: ' + err.message);
      }
    });

    // 5. Caller receives SDP Answer
    socket.on('call:answer', async (data: any) => {
      console.log('[Socket] Received WebRTC answer.');
      try {
        if (webrtcRef.current) {
          await webrtcRef.current.handleAnswer(data.sdp);
        }
      } catch (err: any) {
        console.error('[WebRTC] Error handling answer:', err);
      }
    });

    // 6. ICE candidate trickle
    socket.on('call:ice-candidate', async (data: any) => {
      if (webrtcRef.current) {
        await webrtcRef.current.addIceCandidate(data.candidate);
      }
    });

    // 7. Call Connected
    socket.on('call:connected', () => {
      console.log('[Socket] Call successfully connected!');
      audioService.playConnectedChime();
      startDurationTimer();
      setActiveCall(prev => prev ? {
        ...prev,
        status: 'connected',
        startedAt: Date.now(),
        statusMessage: 'Connected'
      } : null);
      startAudioVisualizers();
    });

    // 8. Call Rejected
    socket.on('call:rejected', (data: any) => {
      console.log('[Socket] Call rejected:', data);
      audioService.playEndChime();
      setActiveCall(prev => prev ? {
        ...prev,
        status: 'rejected',
        statusMessage: data.reason || 'Call was declined by parent.'
      } : null);
      cleanupCallResources(3000);
    });

    // 9. Call Missed
    socket.on('call:missed', (data: any) => {
      console.log('[Socket] Call missed:', data);
      audioService.playEndChime();
      setActiveCall(prev => prev ? {
        ...prev,
        status: 'missed',
        statusMessage: data.reason || 'No answer. Call was missed.'
      } : null);
      cleanupCallResources(3000);
    });

    // 10. Call Ended
    socket.on('call:ended', (data: any) => {
      console.log('[Socket] Call ended:', data);
      audioService.playEndChime();
      setActiveCall(prev => prev ? {
        ...prev,
        status: 'ended',
        durationSeconds: data.durationSeconds || prev.durationSeconds,
        statusMessage: data.reason || 'Call ended.'
      } : null);
      cleanupCallResources(2500);
    });

    // 11. Errors
    socket.on('call:error', (data: any) => {
      console.error('[Socket] Call error:', data.message);
      audioService.playEndChime();
      setActiveCall(prev => prev ? {
        ...prev,
        status: 'failed',
        statusMessage: data.message
      } : null);
      cleanupCallResources(3500);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user]);

  /**
   * Helper to get or initialize WebRTC instance with listeners
   */
  const getOrCreateWebRTC = (callId: string): WebRTCService => {
    if (webrtcRef.current) {
      return webrtcRef.current;
    }

    const webrtc = new WebRTCService({
      iceServers: iceServersRef.current,
      onIceCandidate: (candidate) => {
        socketRef.current?.emit('call:ice-candidate', { callId, candidate });
      },
      onRemoteStream: (stream) => {
        console.log('[WebRTC] Remote stream attached to audio visualizer');
        try {
          if (remoteAnalyserRef.current) remoteAnalyserRef.current.disconnect();
          remoteAnalyserRef.current = audioService.createStreamAnalyser(stream);
        } catch (e) {}
      },
      onConnectionStateChange: (state) => {
        setConnectionState(state);
        if (state === 'connected') {
          console.log('[WebRTC] PeerConnection is CONNECTED');
          setActiveCall(prev => prev ? { ...prev, status: 'connected', statusMessage: 'Connected' } : null);
          startDurationTimer();
          startAudioVisualizers();
        } else if (state === 'failed') {
          console.warn('[WebRTC] PeerConnection failed');
          handleCallTermination('Peer connection failed. Check Wi-Fi or firewall.');
        }
      },
      onError: (err) => {
        console.error('[WebRTC] PeerConnection error:', err);
      }
    });

    webrtcRef.current = webrtc;
    return webrtc;
  };

  /**
   * Student initiates call
   */
  const initiateCall = async (
    parentUid: string,
    parentName: string,
    relationship?: string,
    parentAvatar?: string | null
  ) => {
    if (!socketRef.current) throw new Error('Not connected to signaling gateway');

    // Reset visualizer levels
    setLocalAudioLevel(0);
    setRemoteAudioLevel(0);
    setIsMuted(false);

    setActiveCall({
      callId: '',
      peerUid: parentUid,
      peerName: parentName,
      peerAvatar: parentAvatar,
      relationship,
      isIncoming: false,
      status: 'calling',
      durationSeconds: 0,
      statusMessage: 'Requesting microphone and connecting...'
    });

    // Start ringback tone for caller
    audioService.startRingbackTone();

    // Acquire microphone directly on user click gesture!
    try {
      const webrtc = getOrCreateWebRTC('');
      await webrtc.acquireMicrophone();
      console.log('[WebRTC] Caller microphone acquired successfully on click');
    } catch (err: any) {
      audioService.stopAllTones();
      setActiveCall(null);
      throw err;
    }

    // Emit initiate event to backend
    socketRef.current.emit('call:initiate', { parentUid });
  };

  /**
   * Parent accepts incoming call
   */
  const acceptIncomingCall = async () => {
    if (!activeCall || !socketRef.current) return;

    audioService.stopAllTones();
    setActiveCall(prev => prev ? { ...prev, status: 'connecting', statusMessage: 'Connecting audio...' } : null);

    // Acquire microphone directly on user click gesture before emitting accept!
    try {
      const webrtc = getOrCreateWebRTC(activeCall.callId);
      await webrtc.acquireMicrophone();
      console.log('[WebRTC] Callee microphone acquired successfully on click');
    } catch (err: any) {
      console.error('[WebRTC] Callee microphone error on click:', err);
      socketRef.current.emit('call:reject', { callId: activeCall.callId, reason: 'microphone_denied' });
      handleCallTermination('Microphone permission required: ' + err.message);
      return;
    }

    // Emit accept event
    socketRef.current.emit('call:accept', { callId: activeCall.callId });
  };

  /**
   * Parent rejects incoming call
   */
  const rejectIncomingCall = (reason: string = 'declined_by_parent') => {
    if (!activeCall || !socketRef.current) return;
    audioService.stopAllTones();
    socketRef.current.emit('call:reject', { callId: activeCall.callId, reason });
    setActiveCall(null);
  };

  /**
   * Either party ends active call
   */
  const endActiveCall = (reason: string = 'normal') => {
    if (!activeCall || !socketRef.current) return;
    socketRef.current.emit('call:end', { callId: activeCall.callId, reason });
    audioService.playEndChime();
    setActiveCall(prev => prev ? { ...prev, status: 'ended', statusMessage: 'Call ended' } : null);
    cleanupCallResources(2000);
  };

  /**
   * Toggle Mute Microphone
   */
  const toggleMute = () => {
    if (webrtcRef.current) {
      const muted = webrtcRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  /**
   * Audio device output switch
   */
  const changeAudioOutput = async (deviceId: string): Promise<boolean> => {
    if (webrtcRef.current) {
      return await webrtcRef.current.setAudioOutputDevice(deviceId);
    }
    return false;
  };

  /**
   * Duration timer synced every second
   */
  const startDurationTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setActiveCall(prev => {
        if (!prev || prev.status !== 'connected') return prev;
        return {
          ...prev,
          durationSeconds: prev.durationSeconds + 1
        };
      });
    }, 1000);
  };

  /**
   * Real-time audio waveform visualizer polling
   */
  const startAudioVisualizers = () => {
    if (webrtcRef.current) {
      const localStream = webrtcRef.current.getLocalStream();
      if (localStream && !localAnalyserRef.current) {
        try {
          localAnalyserRef.current = audioService.createStreamAnalyser(localStream);
        } catch (e) {}
      }
    }

    if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    visualizerIntervalRef.current = setInterval(() => {
      if (localAnalyserRef.current) {
        setLocalAudioLevel(localAnalyserRef.current.getAudioLevel());
      }
      if (remoteAnalyserRef.current) {
        setRemoteAudioLevel(remoteAnalyserRef.current.getAudioLevel());
      }
    }, 100);
  };

  const handleCallTermination = (errorMessage: string) => {
    audioService.playEndChime();
    setActiveCall(prev => prev ? {
      ...prev,
      status: 'failed',
      statusMessage: errorMessage
    } : null);
    cleanupCallResources(4000);
  };

  const cleanupCallResources = (delayMs: number = 0) => {
    audioService.stopAllTones();

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (visualizerIntervalRef.current) {
      clearInterval(visualizerIntervalRef.current);
      visualizerIntervalRef.current = null;
    }

    if (localAnalyserRef.current) {
      localAnalyserRef.current.disconnect();
      localAnalyserRef.current = null;
    }

    if (remoteAnalyserRef.current) {
      remoteAnalyserRef.current.disconnect();
      remoteAnalyserRef.current = null;
    }

    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
      webrtcRef.current = null;
    }

    setLocalAudioLevel(0);
    setRemoteAudioLevel(0);
    setIsMuted(false);
    setConnectionState('disconnected');

    if (delayMs > 0) {
      setTimeout(() => {
        setActiveCall(null);
      }, delayMs);
    } else {
      setActiveCall(null);
    }
  };

  return (
    <CallContext.Provider
      value={{
        activeCall,
        isMuted,
        localAudioLevel,
        remoteAudioLevel,
        connectionState,
        initiateCall,
        acceptIncomingCall,
        rejectIncomingCall,
        endActiveCall,
        toggleMute,
        changeAudioOutput
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
