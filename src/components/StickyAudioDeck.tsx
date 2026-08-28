import { useEffect, useRef } from "react";
import type { Track } from "../data/tracks";
import { Waveform } from "./Waveform";

interface StickyAudioDeckProps {
  currentTrack: Track;
  isPlaying: boolean;
  activeSectionIdx: number;
}

export const StickyAudioDeck = ({ currentTrack, isPlaying, activeSectionIdx }: StickyAudioDeckProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background animated particle rings on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += isPlaying ? 0.02 : 0.005;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Draw pulsating frequency rings
      const ringCount = 6;
      for (let i = 1; i <= ringCount; i++) {
        ctx.beginPath();
        const r = (i * 26) + Math.sin(angle + i) * 6;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${currentTrack.artAccent}${Math.round((0.15 - i * 0.02) * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentTrack.artAccent, isPlaying]);

  return (
    <div className="sticky top-28 w-full max-w-[420px] mx-auto bg-[#141210]/90 backdrop-blur-xl border border-[#332d26] rounded-2xl p-6 shadow-2xl space-y-6 transition-all duration-700">
      
      {/* Top Deck Status Header */}
      <div className="flex items-center justify-between border-b border-[#332d26] pb-3 text-xs font-mono text-[#5c5248]">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full transition-all duration-500"
            style={{
              background: currentTrack.artAccent,
              boxShadow: `0 0 12px ${currentTrack.artAccent}`,
            }}
          />
          <span className="text-[#f0ebe3] font-bold tracking-wider">
            CHAPTER 0{activeSectionIdx + 1}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#1c1916] border border-[#332d26] text-[#a89880]">
          {currentTrack.bpm !== "—" ? `${currentTrack.bpm} BPM` : "MASTER TAPE"}
        </span>
      </div>

      {/* Main Visual: Vinyl Record / Cassette Stage */}
      <div className="relative aspect-square w-full rounded-xl bg-[#0f0d0b] border border-[#2a2520] flex items-center justify-center overflow-hidden p-4 group">
        
        {/* Background Canvas Rings */}
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        />

        {/* Vinyl Record Body */}
        <div
          className={`relative z-10 w-56 h-56 rounded-full border border-[#4a4035] bg-gradient-to-tr from-[#12100e] via-[#1c1916] to-[#0a0908] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center transition-transform duration-1000 ${
            isPlaying ? "animate-spin" : ""
          }`}
          style={{ animationDuration: "6s" }}
        >
          {/* Vinyl Grooves */}
          <div className="absolute inset-3 rounded-full border border-[#332d26]/40" />
          <div className="absolute inset-7 rounded-full border border-[#332d26]/30" />
          <div className="absolute inset-12 rounded-full border border-[#332d26]/20" />
          <div className="absolute inset-16 rounded-full border border-[#332d26]/20" />

          {/* Center Record Label */}
          <div
            className="w-22 h-22 rounded-full flex flex-col items-center justify-center p-2 text-center border transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${currentTrack.artAccent}25 0%, #1c1916 100%)`,
              borderColor: currentTrack.artAccent,
            }}
          >
            <span className="text-[10px] font-mono font-bold text-[#f0ebe3] uppercase leading-none">
              {currentTrack.trackNo}
            </span>
            <span
              className="text-[9px] font-mono truncate max-w-[70px] mt-1 font-semibold"
              style={{ color: currentTrack.artAccent }}
            >
              {currentTrack.genre.split(" ")[0]}
            </span>
            {/* Center Spindle Hole */}
            <div className="w-3 h-3 rounded-full bg-[#0a0908] border border-[#4a4035] mt-1" />
          </div>
        </div>

        {/* Needle / Tonearm Indicator */}
        <div
          className="absolute top-4 right-6 w-16 h-28 origin-top-right transition-transform duration-500 pointer-events-none"
          style={{
            transform: isPlaying ? "rotate(18deg)" : "rotate(-15deg)",
          }}
        >
          <div className="w-1 h-20 bg-gradient-to-b from-[#8a7b6a] to-[#4a4035] rounded-full mx-auto shadow-md" />
          <div className="w-3 h-5 bg-[#e8a045] rounded-sm -mt-1 mx-auto shadow-sm" />
        </div>

      </div>

      {/* Real-time Oscilloscope Waveform */}
      <div className="bg-[#0f0d0b] border border-[#2a2520] p-3 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#5c5248]">
          <span>FREQUENCY OSCILLATOR</span>
          <span style={{ color: currentTrack.artAccent }}>LIVE SPECTRUM</span>
        </div>
        <div className="h-9">
          <Waveform isPlaying={isPlaying} barCount={28} height={36} accent={currentTrack.artAccent} />
        </div>
      </div>

      {/* Meta Readout Tape */}
      <div className="bg-[#1c1916] border border-[#332d26] p-3.5 rounded-xl flex items-center justify-between text-xs font-mono">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] text-[#5c5248] uppercase block">NOW TUNED</span>
          <p className="text-[#f0ebe3] font-bold truncate">{currentTrack.title}</p>
          <p className="text-[11px] text-[#a89880] truncate">{currentTrack.artist}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-[#5c5248] uppercase block">TIMECODE</span>
          <span className="font-bold" style={{ color: currentTrack.artAccent }}>
            {currentTrack.duration}
          </span>
        </div>
      </div>

    </div>
  );
};
