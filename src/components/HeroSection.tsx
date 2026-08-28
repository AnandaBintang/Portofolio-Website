import React from "react";
import { ArrowDownRight, TerminalWindow, Sparkle, Database, Cloud } from "@phosphor-icons/react";
import { VisualizerCanvas } from "./VisualizerCanvas";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { audioEngine } from "../lib/audioEngine";

interface HeroSectionProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isPlaying, onTogglePlay }) => {
  const handleScrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    audioEngine.playClickSfx();
    const elem = document.getElementById("projects");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-[calc(100dvh-4.5rem)] flex flex-col justify-between pt-8 pb-12 px-4 md:px-8 border-b border-[#262630]">
      
      {/* Top Meta Bar */}
      <div className="max-w-[1400px] w-full mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5c5c6e]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f076] animate-ping" />
          <span className="text-[#00f076] font-medium tracking-wide">STATUS: PRODUCTION ACTIVE</span>
          <span className="text-[#3a3a48]">/</span>
          <span>PT HM SAMPOERNA (WEEKEND INC.)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY: SUB-100MS OPTIMIZED</span>
          <span className="hidden sm:inline text-[#3a3a48]">|</span>
          <span className="hidden sm:inline">BASE: SIDOARJO / TELKOM UNIV</span>
        </div>
      </div>

      {/* Center Display Grid */}
      <div className="max-w-[1400px] w-full mx-auto my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Huge Editorial Display Typography */}
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121216] border border-[#262630] text-xs font-mono text-[#9090a0]">
            <TerminalWindow size={14} className="text-[#00f076]" />
            <span>BACKEND ENGINE / ARCHITECTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-[#f4f4f6]">
            ARCHITECTING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f076] via-[#f4f4f6] to-[#9090a0]">
              HIGH-THROUGHPUT
            </span> <br />
            SCALABLE SYSTEMS.
          </h1>

          <p className="text-base sm:text-lg text-[#9090a0] max-w-[62ch] leading-relaxed">
            Engineering resilient microservices, optimized SQL data layers, and clean backend APIs for enterprise platforms with zero compromise on reliability.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#projects"
              onClick={handleScrollToWork}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f4f4f6] text-black font-semibold text-sm hover:bg-[#00f076] active:scale-98 transition-all shadow-lg cursor-pointer"
            >
              <span>EXPLORE TRACKLIST</span>
              <ArrowDownRight size={18} weight="bold" />
            </a>

            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onTogglePlay();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121216] border border-[#3a3a48] text-[#f4f4f6] font-mono text-xs hover:border-[#00f076] active:scale-98 transition-all cursor-pointer"
            >
              <Sparkle size={16} className="text-[#00f076]" />
              <span>{isPlaying ? "PAUSE ATMOSPHERE" : "PLAY AMBIENT TONE"}</span>
            </button>
          </div>
        </div>

        {/* Right: Master Console Deck & Live Waveform Panel */}
        <div className="lg:col-span-4 bg-[#121216] border border-[#262630] rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262630] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f076]" />
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">CONSOLE MONITOR</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1a1a22] text-[#9090a0] border border-[#3a3a48]">
              MASTER OUT
            </span>
          </div>

          {/* Live Waveform Canvas */}
          <div className="h-24 bg-[#0a0a0c] border border-[#262630] rounded-lg p-2 overflow-hidden flex items-center justify-center">
            <VisualizerCanvas isPlaying={isPlaying} />
          </div>

          {/* Console Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="bg-[#1a1a22] p-2.5 rounded border border-[#262630]">
              <div className="flex items-center gap-1.5 text-[#5c5c6e] mb-1">
                <Database size={13} className="text-[#00f076]" />
                <span className="text-[10px]">CORE RUNTIME</span>
              </div>
              <p className="text-white font-medium">Laravel / Node.js</p>
            </div>
            <div className="bg-[#1a1a22] p-2.5 rounded border border-[#262630]">
              <div className="flex items-center gap-1.5 text-[#5c5c6e] mb-1">
                <Cloud size={13} className="text-[#00f076]" />
                <span className="text-[10px]">DEPLOYMENT</span>
              </div>
              <p className="text-white font-medium">AWS / Docker CI</p>
            </div>
          </div>

          {/* Now Playing Tape Track info */}
          <div className="bg-[#0a0a0c] border border-[#262630] p-3 rounded-lg flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#5c5c6e] block uppercase">CURRENT PLAYHEAD</span>
              <p className="text-[#f4f4f6] font-semibold truncate max-w-[200px]">{PORTFOLIO_DATA.profile.name}</p>
            </div>
            <span className="text-[#00f076] font-bold">2026.01</span>
          </div>
        </div>

      </div>

      {/* Bottom Footer Line / Quick Specs */}
      <div className="max-w-[1400px] w-full mx-auto pt-6 border-t border-[#262630]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-[#5c5c6e]">
        <div>
          <span className="text-[#9090a0] block">01 / DISCIPLINE</span>
          <span>Backend Microservices</span>
        </div>
        <div>
          <span className="text-[#9090a0] block">02 / PRIMARY ORM</span>
          <span>Knex.js / Eloquent SQL</span>
        </div>
        <div>
          <span className="text-[#9090a0] block">03 / SPECIALIZATION</span>
          <span>N+1 Query & Perf Tuning</span>
        </div>
        <div>
          <span className="text-[#9090a0] block">04 / CURRENT ENTERPRISE</span>
          <span className="text-[#00f076]">PT HM Sampoerna</span>
        </div>
      </div>

    </section>
  );
};
