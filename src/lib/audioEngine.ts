// Lo-Fi Spotify Portfolio - Audio Engine with Real Lo-Fi Ambient Audio + Web Audio Analyser
// Plays rich ambient music track & routes through Web Audio Analyser for canvas visualizer

type StateCallback = (playing: boolean) => void;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  public audioElement: HTMLAudioElement | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;
  private freqArray: Uint8Array | null = null;
  private playing = false;
  private muted = false;
  private stateListeners: StateCallback[] = [];

  private init() {
    if (this.ctx) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.85;
    this.freqArray = new Uint8Array(this.analyser.frequencyBinCount);

    // Create real audio stream
    this.audioElement = new Audio("/audio/ambient.mp3");
    this.audioElement.loop = true;
    this.audioElement.crossOrigin = "anonymous";
    this.audioElement.preload = "auto";

    // Connect Audio Element -> Web Audio Analyser -> Master Gain -> Destination
    try {
      this.audioSource = this.ctx.createMediaElementSource(this.audioElement);
      this.audioSource.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Fallback
    }
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx?.state === "suspended") this.ctx.resume();

    if (this.playing) {
      this.playing = false;
      if (this.audioElement) {
        this.audioElement.pause();
      }
    } else {
      this.playing = true;
      if (this.audioElement) {
        this.audioElement.play().catch(() => {});
      }
    }

    this.stateListeners.forEach((fn) => fn(this.playing));
    return this.playing;
  }

  toggleMute(): boolean {
    if (!this.ctx) this.init();
    this.muted = !this.muted;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.7, this.ctx.currentTime, 0.1);
    }

    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  getFreqData(): Uint8Array | null {
    if (!this.analyser || !this.freqArray || !this.playing) return null;
    this.analyser.getByteFrequencyData(this.freqArray as any);
    return this.freqArray;
  }

  sfx(type: "click" | "prev" | "next" | "rewind") {
    try {
      if (!this.ctx) this.init();
      if (this.ctx?.state === "suspended") this.ctx.resume();
      if (!this.ctx || !this.masterGain || this.muted) return;

      const now = this.ctx.currentTime;

      if (type === "rewind") {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.65);

        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.04, now + 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === "click") {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        g.gain.setValueAtTime(0.03, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.05);
      } else {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(type === "next" ? 440 : 330, now);
        osc.frequency.exponentialRampToValueAtTime(type === "next" ? 660 : 220, now + 0.08);
        g.gain.setValueAtTime(0.025, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch {
      // Ignored
    }
  }

  onStateChange(cb: StateCallback): () => void {
    this.stateListeners.push(cb);
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== cb);
    };
  }

  isPlaying(): boolean {
    return this.playing;
  }
}

export const audio = new AudioEngine();
