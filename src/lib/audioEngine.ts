// Lo-Fi Spotify Portfolio - Audio Engine
// Generative lo-fi ambient synthesizer (chords + soft noise + tape shutter SFX)
// Exposed as singleton: import { audio } from './audioEngine'

type StateCallback = (playing: boolean) => void;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private playing = false;
  private oscs: OscillatorNode[] = [];
  private tickId: ReturnType<typeof setInterval> | null = null;
  private stateListeners: StateCallback[] = [];

  // Lo-Fi chord progression: Fmaj7 - Dm7 - Bbmaj7 - C7
  private readonly CHORDS = [
    [87.31, 130.81, 174.61, 261.63, 349.23], // Fmaj7
    [73.42, 110.00, 146.83, 220.00, 293.66], // Dm7
    [58.27, 87.31, 110.00, 174.61, 261.63],  // Bbmaj7
    [65.41, 98.00, 130.81, 196.00, 261.63],  // C7
  ];
  private chordIdx = 0;

  private init() {
    if (this.ctx) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.85;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  private playChord() {
    if (!this.ctx || !this.masterGain || !this.playing) return;

    this.oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch { /**/ } });
    this.oscs = [];

    const freqs = this.CHORDS[this.chordIdx % this.CHORDS.length];
    this.chordIdx++;
    const now = this.ctx.currentTime;

    freqs.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const g   = this.ctx.createGain();
      const detuneAmt = (Math.random() - 0.5) * 6;

      osc.type = i < 2 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detuneAmt, now);

      const vol = 0.055 / (i + 1);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(vol, now + 2.5);
      g.gain.setValueAtTime(vol, now + 5.5);
      g.gain.exponentialRampToValueAtTime(0.001, now + 7.0);

      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 7.5);
      this.oscs.push(osc);
    });

    if (this.ctx) {
      const bufSize = this.ctx.sampleRate * 0.5;
      const buf  = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.006;
      const src  = this.ctx.createBufferSource();
      const hiss = this.ctx.createGain();
      src.buffer = buf;
      src.loop   = false;
      hiss.gain.setValueAtTime(0.3, now);
      src.connect(hiss);
      hiss.connect(this.masterGain);
      src.start(now);
    }
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx?.state === "suspended") this.ctx.resume();

    if (this.playing) {
      this.playing = false;
      this.masterGain?.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.5);
      if (this.tickId) { clearInterval(this.tickId); this.tickId = null; }
      this.oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch { /**/ } });
      this.oscs = [];
    } else {
      this.playing = true;
      this.masterGain?.gain.setTargetAtTime(1, this.ctx!.currentTime, 1.0);
      this.playChord();
      this.tickId = setInterval(() => this.playChord(), 6500);
    }

    this.stateListeners.forEach(fn => fn(this.playing));
    return this.playing;
  }

  sfx(type: "click" | "prev" | "next" | "rewind") {
    try {
      if (!this.ctx) this.init();
      if (this.ctx?.state === "suspended") this.ctx.resume();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;

      if (type === "rewind") {
        // Fast forward / tape rewind sweep effect
        const sweepOsc = this.ctx.createOscillator();
        const sweepGain = this.ctx.createGain();

        sweepOsc.type = "sawtooth";
        sweepOsc.frequency.setValueAtTime(150, now);
        sweepOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
        sweepOsc.frequency.exponentialRampToValueAtTime(300, now + 0.6);

        sweepGain.gain.setValueAtTime(0.001, now);
        sweepGain.gain.linearRampToValueAtTime(0.08, now + 0.2);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        sweepOsc.connect(sweepGain);
        sweepGain.connect(this.masterGain);
        sweepOsc.start(now);
        sweepOsc.stop(now + 0.65);
        return;
      }

      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      o.type = "sine";
      if (type === "click") {
        o.frequency.setValueAtTime(900, now);
        o.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        g.gain.setValueAtTime(0.06, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        o.connect(g);
        g.connect(this.masterGain);
        o.start(now);
        o.stop(now + 0.07);
      } else {
        const steps = type === "next" ? [440, 554, 659] : [659, 554, 440];
        steps.forEach((f, i) => {
          if (!this.ctx || !this.masterGain) return;
          const stepOsc = this.ctx.createOscillator();
          const stepGain = this.ctx.createGain();
          const t = now + i * 0.04;
          stepOsc.type = "sine";
          stepOsc.frequency.setValueAtTime(f, t);
          stepGain.gain.setValueAtTime(0.04, t);
          stepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
          stepOsc.connect(stepGain);
          stepGain.connect(this.masterGain);
          stepOsc.start(t);
          stepOsc.stop(t + 0.04);
        });
      }
    } catch {
      // Audio fallback
    }
  }

  getFreqData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(64);
    const d = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(d);
    return d;
  }

  isPlaying() { return this.playing; }

  onStateChange(fn: StateCallback) {
    this.stateListeners.push(fn);
    return () => { this.stateListeners = this.stateListeners.filter(f => f !== fn); };
  }
}

export const audio = new AudioEngine();
