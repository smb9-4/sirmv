/**
 * Audio Service for call ringing tones, ringback feedback, connected/ended chimes,
 * device vibration, and Web Audio API stream visualizer.
 * Built using pure Web Audio API without relying on external MP3 assets.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private ringbackInterval: any = null;
  private incomingRingInterval: any = null;
  private isRinging: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play Ringback tone (for Student when calling parent: 440Hz + 480Hz US standard cadence)
   */
  startRingbackTone() {
    this.stopAllTones();
    this.isRinging = true;

    const playPulse = () => {
      if (!this.isRinging) return;
      try {
        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, now);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
        gain.gain.setValueAtTime(0.08, now + 1.8);
        gain.gain.linearRampToValueAtTime(0.0001, now + 2.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.0);
        osc2.stop(now + 2.0);
      } catch (e) {
        console.warn('[Audio] Ringback tone error:', e);
      }
    };

    playPulse();
    this.ringbackInterval = setInterval(playPulse, 4000);
  }

  /**
   * Play Incoming Ringtone (for Parent smartphone when receiving call)
   */
  startIncomingRingtone() {
    this.stopAllTones();
    this.isRinging = true;

    // Trigger device vibration on mobile if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([500, 300, 500, 300, 800]);
      } catch (e) {}
    }

    const playMelody = () => {
      if (!this.isRinging) return;
      try {
        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        // Friendly 3-tone ring sequence: E5 (659Hz), G#5 (830Hz), B5 (987Hz)
        const notes = [659.25, 830.61, 987.77, 830.61];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + (idx * 0.22);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.18, start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.20);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + 0.22);
        });

        if ('vibrate' in navigator) {
          try {
            navigator.vibrate([300, 150, 300, 150]);
          } catch (e) {}
        }
      } catch (e) {
        console.warn('[Audio] Incoming ring error:', e);
      }
    };

    playMelody();
    this.incomingRingInterval = setInterval(playMelody, 2500);
  }

  /**
   * Play Connected Chime
   */
  playConnectedChime() {
    this.stopAllTones();
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (i * 0.12);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch (e) {}
  }

  /**
   * Play Ended/Disconnect Tone
   */
  playEndChime() {
    this.stopAllTones();
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      [440, 330].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (i * 0.15);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch (e) {}
  }

  /**
   * Stop all ringing/ringback sounds and vibration
   */
  stopAllTones() {
    this.isRinging = false;
    if (this.ringbackInterval) {
      clearInterval(this.ringbackInterval);
      this.ringbackInterval = null;
    }
    if (this.incomingRingInterval) {
      clearInterval(this.incomingRingInterval);
      this.incomingRingInterval = null;
    }
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(0);
      } catch (e) {}
    }
  }

  /**
   * Attach audio visualizer to a MediaStream (local microphone or remote audio)
   */
  createStreamAnalyser(stream: MediaStream): {
    analyser: AnalyserNode;
    getAudioLevel: () => number;
    disconnect: () => void;
  } {
    const ctx = this.getAudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.5;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const getAudioLevel = (): number => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      return Math.min(100, Math.round((avg / 255) * 100));
    };

    const disconnect = () => {
      try {
        source.disconnect();
      } catch (e) {}
    };

    return { analyser, getAudioLevel, disconnect };
  }
}

export const audioService = new AudioService();

