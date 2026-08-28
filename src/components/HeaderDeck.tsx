import React from "react";
import { Play, Pause, SpeakerHigh, SpeakerSlash, Disc } from "@phosphor-icons/react";
import { audioEngine } from "../lib/audioEngine";

interface HeaderDeckProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const HeaderDeck: React.FC<HeaderDeckProps> = ({ isPlaying, onTogglePlay }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    audioEngine.playClickSfx();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0a0a0c]/85 border-b border-[#262630] transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity / Studio Callout */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#3a3a48] bg-[#121216] flex items-center justify-center text-white">
            <Disc size={18} className={`text-[#00f076] ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
          </div>
          <div>
            <a href="#hero" onClick={(e) => handleNavClick(e, "hero")} className="block font-bold tracking-tight text-sm text-[#f4f4f6] hover:text-[#00f076] transition-colors">
              ANANDA BINTANG
            </a>
            <span className="text-[11px] font-mono tracking-wider text-[#5c5c6e] block uppercase">
              STUDIO 01 / BACKEND ENG
            </span>
          </div>
        </div>

        {/* Center: Interactive Audio Master Deck */}
        <div className="flex items-center gap-3 bg-[#121216] border border-[#262630] rounded-full px-3 py-1.5 shadow-inner">
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause audio atmosphere" : "Play audio atmosphere"}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1a22] hover:bg-[#262630] active:scale-95 border border-[#3a3a48] text-xs font-mono tracking-wider text-white transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause size={14} weight="fill" className="text-[#00f076]" />
                <span className="text-[#00f076]">LIVE BGM</span>
              </>
            ) : (
              <>
                <Play size={14} weight="fill" className="text-[#9090a0]" />
                <span className="text-[#9090a0]">PLAY SOUND</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1 px-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? "bg-[#00f076] animate-pulse"
                    : "bg-[#3a3a48] h-2"
                }`}
                style={{
                  height: isPlaying ? `${Math.max(6, (i + 1) * 4)}px` : "6px",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          <button
            onClick={onTogglePlay}
            className="p-1 text-[#5c5c6e] hover:text-[#f4f4f6] transition-colors cursor-pointer"
            title={isPlaying ? "Mute audio" : "Activate audio"}
          >
            {isPlaying ? <SpeakerHigh size={16} /> : <SpeakerSlash size={16} />}
          </button>
        </div>

        {/* Right: Quick Channel Routing */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider text-[#9090a0]">
          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, "projects")}
            className="hover:text-[#f4f4f6] transition-colors uppercase"
          >
            01 / TRACKLIST
          </a>
          <a
            href="#frequencies"
            onClick={(e) => handleNavClick(e, "frequencies")}
            className="hover:text-[#f4f4f6] transition-colors uppercase"
          >
            02 / FREQUENCIES
          </a>
          <a
            href="#sessions"
            onClick={(e) => handleNavClick(e, "sessions")}
            className="hover:text-[#f4f4f6] transition-colors uppercase"
          >
            03 / SESSIONS
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="px-3 py-1.5 rounded-full border border-[#00f076] text-[#00f076] hover:bg-[#00f076] hover:text-black transition-all font-sans font-medium"
          >
            CONTACT
          </a>
        </nav>

      </div>
    </header>
  );
};
