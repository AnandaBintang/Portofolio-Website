import React, { useState, useEffect } from "react";
import { ArrowDown, EnvelopeSimple, Sparkle } from "@phosphor-icons/react";
import { PROFILE } from "../data/tracks";

interface CenterStageHeroProps {
  isPlaying: boolean;
  onExploreTracks: () => void;
  accentColor: string;
}

export const CenterStageHero: React.FC<CenterStageHeroProps> = ({
  isPlaying,
  onExploreTracks,
  accentColor,
}) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      setTilt({
        rotateX: -y * 8,
        rotateY: x * 10,
      });

      setGlare({
        x: (e.clientX / innerWidth) * 100,
        y: (e.clientY / innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-full flex flex-col justify-between py-2 space-y-8 select-none">
      
      {/* ── Top Status Bar ── */}
      <div className="flex items-center justify-between text-xs font-mono text-[#5c5248] pb-3 border-b border-[#2a2520] w-full">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping shrink-0" />
          <span className="text-[#1db954] font-medium tracking-wider text-[11px] sm:text-xs">
            CURRENT ROLE
          </span>
          <span className="text-[#332d26]">/</span>
          <span className="text-[#a89880] truncate text-[11px] sm:text-xs">
            BACKEND ENGINEER @ WEEKEND INC. (SAMPOERNA)
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#5c5248] tracking-wider">
          <span>SIDOARJO, INDONESIA</span>
        </div>
      </div>

      {/* ── Center Stage Visual Composition ── */}
      <div className="relative flex flex-col items-center justify-center py-6 sm:py-10">
        
        {/* Layer 1: Background Kinetic Display Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden">
          <span className="text-[14vw] font-bold tracking-tighter text-[#161310] leading-none uppercase select-none opacity-60">
            ANANDA
          </span>
          <span className="text-[14vw] font-bold tracking-tighter text-[#1a1612] leading-none uppercase select-none -mt-4 sm:-mt-8 opacity-40">
            BINTANG
          </span>
        </div>

        {/* Layer 2: Center Stage Floating 3D Album Cover */}
        <div
          className="relative z-10 flex items-center justify-center group cursor-pointer my-2"
          style={{
            perspective: "1000px",
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transition: "transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
          }}
          onClick={onExploreTracks}
        >
          {/* Ambient Glow */}
          <div
            className={`absolute -inset-8 sm:-inset-12 rounded-3xl transition-all duration-1000 pointer-events-none ${
              isPlaying ? "opacity-50 scale-105" : "opacity-20 scale-95"
            }`}
            style={{
              background: `radial-gradient(circle, ${accentColor}30 0%, transparent 65%)`,
              filter: "blur(30px)",
            }}
          />

          {/* Master 3D Album Sleeve Box */}
          <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-2xl bg-[#141210] border border-[#3a332a] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-4 flex flex-col justify-between overflow-hidden group-hover:border-[#5c5248] transition-colors">
            
            {/* Holographic Gloss Sheen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300 z-30"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.35) 0%, transparent 60%)`,
              }}
            />

            {/* Vinyl Spine Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none z-20 border-r border-white/5" />

            {/* Album Header Line */}
            <div className="relative z-20 flex items-center justify-between text-[10px] font-mono text-[#7a6e62] border-b border-[#2a2520] pb-2">
              <span className="tracking-wider font-bold" style={{ color: accentColor }}>
                PORTFOLIO 2026
              </span>
              <span className="bg-[#1c1916] px-2 py-0.5 rounded border border-[#2a2520] text-[9px] text-[#a89880]">
                BACKEND ENGINEER
              </span>
            </div>

            {/* Center Photo Container */}
            <div className="relative z-10 aspect-square w-full rounded-xl overflow-hidden border border-[#2a2520] my-2 bg-[#0c0a08] shadow-inner">
              <img
                src={PROFILE.avatarUrl}
                alt={PROFILE.name}
                className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700 pointer-events-none scale-105 group-hover:scale-100"
              />

              {/* Status Badge */}
              <div className="absolute bottom-2.5 left-2.5 bg-black/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded shadow-xl pointer-events-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1db954] animate-pulse" />
                <span className="text-[9px] font-mono text-[#f0ebe3]">
                  AVAILABLE FOR WORK
                </span>
              </div>
            </div>

            {/* Album Footer Info */}
            <div className="relative z-20 flex items-center justify-between pt-1 text-xs font-mono">
              <div>
                <span className="font-bold text-[#f0ebe3] block leading-tight text-sm tracking-tight">
                  {PROFILE.name}
                </span>
                <span className="text-[10px] text-[#5c5248] tracking-wider block mt-0.5">
                  Laravel · Node.js · Microservices
                </span>
              </div>

              <span className="text-[10px] font-mono text-[#a89880] px-2 py-0.5 rounded bg-[#1c1916] border border-[#2a2520]">
                PROFILE
              </span>
            </div>

          </div>

        </div>

        {/* Layer 3: Clear Professional Headline Below Card */}
        <div className="relative z-20 text-center space-y-2 mt-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141210] border border-[#332d26] text-xs font-mono tracking-wider text-[#e8a045] shadow-lg">
            <span>BACKEND ENGINEER & WEB DEVELOPER</span>
          </div>
          <p className="text-xs sm:text-sm text-[#a89880] font-mono leading-relaxed px-4">
            {PROFILE.subheadline}
          </p>
        </div>

      </div>

      {/* ── Bottom Action Deck ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262630]/60 w-full">
        
        <div className="flex items-center gap-2 text-xs font-mono text-[#a89880]">
          <Sparkle size={14} className="text-[#e8a045] shrink-0" />
          <span>Building high-scale services & APIs.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
          <button
            onClick={onExploreTracks}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#e8a045] text-black font-semibold text-xs font-mono hover:bg-[#f0b055] transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <span>VIEW PROJECTS</span>
            <ArrowDown size={14} weight="bold" />
          </button>

          <a
            href={`mailto:${PROFILE.email}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1c1916] border border-[#4a4035] text-[#f0ebe3] font-mono text-xs hover:border-[#e8a045] transition-all cursor-pointer shadow-md"
          >
            <EnvelopeSimple size={14} />
            <span>CONTACT ME</span>
          </a>
        </div>

      </div>

    </div>
  );
};
