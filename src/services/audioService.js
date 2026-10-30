/**
 * Web Audio API Sound Synthesizer
 * Generates clean audio cues without external MP3 files:
 * - Countdown tick (short high pitch)
 * - Rest start chime
 * - Workout completed celebratory fanfare
 */

class AudioCueService {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, volume = 0.2) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 3-2-1 tick cue
  playCountdown() {
    this.playTone(880, 'sine', 0.12, 0.25);
  }

  // Go / Start cue
  playGo() {
    this.playTone(1760, 'triangle', 0.35, 0.3);
  }

  // Rest start cue (mellow chime)
  playRestChime() {
    this.playTone(523.25, 'sine', 0.2, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.3, 0.2), 120); // E5
  }

  // Complete workout victory chime
  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.25), idx * 140);
    });
  }
}

export const audioCueService = new AudioCueService();
