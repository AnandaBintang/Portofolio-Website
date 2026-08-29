import { useRef } from "react";
import type { Track } from "../data/tracks";
import { Waveform } from "./Waveform";

interface StickyAudioDeckProps {
  currentTrack: Track;
  isPlaying: boolean;
  activeSectionIdx: number;
}

export const StickyAudioDeck: React.FC<StickyAudioDeckProps> = ({
  currentTrack,
  isPlaying,
}) => {
  const vinylRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full bg-[#141210] border border-[#332d26] rounded-3xl p-6 shadow-2xl space-y-6 select-none relative overflow-hidden group">
      
      {/* Subtle Ambient Radial Glow */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none opacity-20 blur-3xl transition-colors duration-700"
        style={{ background: currentTrack.artAccent }}
      />

      {/* Turntable Platter Deck & Vinyl */}
      <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-full border-4 border-[#24201a] bg-[#100e0c] p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
        
        {/* Strobe Ring */}
        <div className="absolute inset-2 rounded-full border border-dashed border-[#3a332a] animate-[spin_12s_linear_infinite]" />

        {/* Vinyl Record */}
        <div
          ref={vinylRef}
          className={`w-full h-full rounded-full border-2 border-[#332d26] bg-[radial-gradient(ellipse_at_center,#1c1916_0%,#0c0a08_40%,#181512_70%,#080706_100%)] flex items-center justify-center shadow-inner relative transition-transform ${
            isPlaying ? "animate-[spin_5s_linear_infinite]" : "group-hover:rotate-45 duration-700"
          }`}
        >
          {/* Center Label */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center p-1 text-center shadow-md transition-colors duration-500"
            style={{
              background: `radial-gradient(circle, ${currentTrack.artAccent} 0%, #1c1916 100%)`,
              borderColor: currentTrack.artAccent,
            }}
          >
            <span className="text-[7px] sm:text-[8px] font-mono font-bold text-black uppercase leading-tight">
              {currentTrack.trackNo}
            </span>
            <span className="text-[6px] sm:text-[7px] font-mono text-black/80 uppercase">
              PROJECT
            </span>
            <div className="w-2 h-2 rounded-full bg-[#080706] border border-[#332d26] mt-0.5" />
          </div>
        </div>

        {/* Tonearm */}
        <div className="absolute top-2 right-4 w-6 h-36 pointer-events-none transition-transform duration-700 group-hover:rotate-6" style={{ transformOrigin: "top right" }}>
          <div className="w-6 h-6 rounded-full bg-[#3a332a] border border-[#5c5248] shadow-lg ml-auto" />
          <div className="w-1 h-28 bg-gradient-to-b from-[#8a7e70] via-[#5c5248] to-[#332d26] rounded-full ml-auto mr-2.5 shadow-md" />
          <div
            className="w-3.5 h-5 rounded-sm shadow-md ml-auto mr-1 flex items-center justify-center transition-colors"
            style={{ background: currentTrack.artAccent }}
          >
            <div className="w-1 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Track Meta Card */}
      <div className="space-y-3 pt-1 border-t border-[#24201a]">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#a89880] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: currentTrack.artAccent }} />
            {currentTrack.storyChapter}
          </span>
          <span className="text-[#5c5248]">{currentTrack.period}</span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#f0ebe3] truncate">
            {currentTrack.title}
          </h3>
          <p className="text-xs text-[#a89880] font-mono truncate mt-0.5">
            {currentTrack.subtitle}
          </p>
        </div>

        {/* Realtime Waveform Canvas */}
        <div className="h-7 bg-[#0c0a08] rounded-xl border border-[#24201a] p-1 overflow-hidden">
          <Waveform isPlaying={isPlaying} barCount={26} height={20} accent={currentTrack.artAccent} />
        </div>
      </div>

    </div>
  );
};
