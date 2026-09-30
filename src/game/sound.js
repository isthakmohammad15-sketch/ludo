/**
 * Procedural Web Audio API sound synthesizer for Ludo Arena.
 * No external asset dependencies, zero network latency, instant playback.
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = false;
    this.musicInterval = null;
    this.volume = 0.3;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playClick() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playDiceRoll() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const clicks = 8;
    for (let i = 0; i < clicks; i++) {
      const time = now + i * 0.08 + (Math.random() * 0.02);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(180 + Math.random() * 240, time);

      gain.gain.setValueAtTime(this.volume * 0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.04);
    }
  }

  playTokenMove() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playSafeLanding() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(this.volume * 0.25, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.3);
    });
  }

  playCapture() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);

    // Whoosh noise
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    whiteNoise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    whiteNoise.start(now);
  }

  playHomeIn() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [440, 554.37, 659.25, 880]; // A major
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(this.volume * 0.3, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.5);
    });
  }

  playSixRoll() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(this.volume * 0.3, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  }

  playVictory() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 523.25, t: 0, d: 0.15 },
      { f: 523.25, t: 0.15, d: 0.15 },
      { f: 523.25, t: 0.30, d: 0.15 },
      { f: 659.25, t: 0.45, d: 0.35 },
      { f: 587.33, t: 0.85, d: 0.2 },
      { f: 783.99, t: 1.1, d: 0.6 },
    ];

    fanfare.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(this.volume * 0.4, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }

  startAmbientMusic() {
    if (this.musicInterval) clearInterval(this.musicInterval);
    const chords = [
      [220, 277.18, 329.63], // A maj
      [196, 246.94, 293.66], // G maj
      [164.81, 207.65, 246.94], // E min
      [174.61, 220, 261.63], // F maj
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.musicEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const current = chords[chordIdx % chords.length];
      chordIdx++;

      current.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4);
      });
    };

    playChord();
    this.musicInterval = setInterval(playChord, 3800);
  }

  stopAmbientMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundSystem();
