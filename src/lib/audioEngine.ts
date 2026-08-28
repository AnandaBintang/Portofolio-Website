// Web Audio Engine: Generative Ambient Sound Generator + Analyser Node
// Clean synthetic ambient soundscape (lo-fi tape / analog warm chord drone) without external MP3 assets

class AudioEngine {
  private ctx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private oscillators: OscillatorNode[] = [];
  private intervalId: number | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime); // gentle ambient volume

    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public togglePlay(onStateChange?: (playing: boolean) => void): boolean {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.startAmbient();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  private startAmbient() {
    if (!this.ctx || !this.gainNode) return;
    this.isPlaying = true;

    // Harmonic chord progression (F# Minor / A Major ambient drone: F#2, C#3, A3, E4)
    const chordFrequencies = [
      [92.5, 138.59, 220.0, 329.63], // F#m7
      [82.41, 123.47, 196.0, 293.66], // Em7
      [110.0, 164.81, 246.94, 392.0], // Am7
      [98.0, 146.83, 220.0, 329.63],  // Gmaj7
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;

      // Clean old oscillators
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.oscillators = [];

      const currentChord = chordFrequencies[chordIdx % chordFrequencies.length];
      chordIdx++;

      currentChord.forEach((freq, idx) => {
        if (!this.ctx || !this.gainNode) return;

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        // Warm sine + triangle blend
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Soft attack and decay envelope
        const now = this.ctx.currentTime;
        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + 1.8);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 5.8);

        osc.connect(oscGain);
        oscGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 6.0);
        this.oscillators.push(osc);
      });
    };

    playChord();
    this.intervalId = window.setInterval(playChord, 5500);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.oscillators = [];
  }

  public playClickSfx() {
    if (!this.ctx) {
      this.init();
    }
    if (!this.ctx || !this.gainNode) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(800, now);
      clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      clickGain.gain.setValueAtTime(0.05, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      clickOsc.connect(clickGain);
      clickGain.connect(this.gainNode);

      clickOsc.start(now);
      clickOsc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(32);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
