class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check local storage for mute preference
    const stored = localStorage.getItem('hangman_sound_muted');
    if (stored !== null) {
      this.isMuted = stored === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('hangman_sound_muted', String(this.isMuted));
    return this.isMuted;
  }

  public playKeyClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06); // A5
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  public playHitSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, t + 0.12); // G5
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(t + 0.22);
    } catch {}
  }

  public playMissSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.linearRampToValueAtTime(90, t + 0.18);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(t + 0.22);
    } catch {}
  }

  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880];
      const start = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start + idx * 0.1);
        gain.gain.setValueAtTime(0.15, start + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, start + idx * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start + idx * 0.1);
        osc.stop(start + idx * 0.1 + 0.25);
      });
    } catch {}
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [330, 293.66, 261.63, 220];
      const start = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start + idx * 0.14);
        gain.gain.setValueAtTime(0.12, start + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, start + idx * 0.14 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start + idx * 0.14);
        osc.stop(start + idx * 0.14 + 0.3);
      });
    } catch {}
  }

  // Pronounce word via SpeechSynthesis or fallback tone
  public speakPronunciation(word: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
        return;
      } catch {}
    }
    // Fallback synth chime
    this.playHitSound();
  }
}

export const sound = new SoundEngine();
