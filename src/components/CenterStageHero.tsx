import React, { useRef, useState, useEffect } from "react";
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
  const albumCoverRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  // 3D Magnetic Interactive Tilt & Glossy Sheen Reflection on Mouse Move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      // Subtle 3D perspective tilt
      setTilt({
        rotateX: -y * 14,
        rotateY: x * 16,
      });

      // Reflection glare percentage coordinates
      setGlare({
        x: (e.clientX / innerWidth) * 100,
        y: (e.clientY / innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col justify-between py-4 select-none overflow-hidden">
      
      {/* ── Top Micro Metadata Bar ── */}
      <div className="flex items-center justify-between text-xs font-mono text-[#5c5248] pb-3 border-b border-[#2a2520] relative z-20">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping shrink-0" />
          <span className="text-[#1db954] font-semibold tracking-widest">SIDE A · ALBUM 00</span>
          <span className="text-[#332d26]">/</span>
          <span className="text-[#a89880] truncate">STUDIO RESIDENCY: WEEKEND INC. (SAMPOERNA)</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#5c5248] tracking-widest uppercase">
          <span>{PROFILE.coordinates}</span>
          <span>·</span>
          <span>MASTER HI-RES AUDIO</span>
        </div>
      </div>

      {/* ── Center Stage Visual Composition ── */}
      <div className="relative flex-1 flex items-center justify-center my-6 md:my-10">
        
        {/* Layer 1: Massive Background Kinetic Display Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <span className="text-[13vw] font-bold tracking-tighter text-[#161310] leading-none uppercase select-none opacity-80 transition-transform duration-700">
            ANANDA
          </span>
          <span className="text-[13vw] font-bold tracking-tighter text-[#1c1814] leading-none uppercase select-none -mt-4 sm:-mt-8 opacity-60">
            BINTANG
          </span>
        </div>

        {/* Layer 2: Center Stage Floating 3D Master Album Jacket */}
        <div
          ref={albumCoverRef}
          className="relative z-10 flex items-center justify-center group cursor-pointer"
          style={{
            perspective: "1100px",
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transition: "transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
          }}
          onClick={onExploreTracks}
        >
          {/* Ambient Album Glow Halo (Pulses when Audio is Playing) */}
          <div
            className={`absolute -inset-10 sm:-inset-14 rounded-3xl transition-all duration-1000 pointer-events-none ${
              isPlaying
                ? "opacity-50 scale-105"
                : "opacity-20 scale-95"
            }`}
            style={{
              background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
              filter: "blur(35px)",
            }}
          />

          {/* Master 3D Square Album Sleeve Box */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[370px] md:h-[370px] rounded-2xl bg-[#141210] border border-[#3a332a] shadow-[0_30px_90px_rgba(0,0,0,0.95)] p-4 flex flex-col justify-between overflow-hidden group-hover:border-[#5c5248] transition-colors">
            
            {/* Glossy Holographic Light Reflection Film */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-300 z-30"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
              }}
            />

            {/* Subtle Vinyl Jacket Spine Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none z-20 border-r border-white/5" />

            {/* Album Header Sleeve Line */}
            <div className="relative z-20 flex items-center justify-between text-[10px] font-mono text-[#7a6e62] border-b border-[#2a2520] pb-2">
              <span className="tracking-widest font-bold" style={{ color: accentColor }}>
                VOL. 00 // THE ARCHITECT
              </span>
              <span className="bg-[#1c1916] px-2 py-0.5 rounded border border-[#2a2520] text-[9px] text-[#a89880]">
                LIMITED EDITION
              </span>
            </div>

            {/* Center Artwork Container (Photo as Main Album Art) */}
            <div className="relative z-10 aspect-square w-full rounded-xl overflow-hidden border border-[#2a2520] my-2 bg-[#0c0a08] shadow-inner">
              <img
                src={PROFILE.avatarUrl}
                alt={PROFILE.name}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 pointer-events-none scale-105 group-hover:scale-100"
              />

              {/* Parental Advisory / Tech Explicit Sticker */}
              <div className="absolute top-2.5 left-2.5 bg-black/90 backdrop-blur-md border border-white/20 px-2 py-1 rounded shadow-xl pointer-events-none">
                <span className="text-[8px] font-mono font-bold tracking-widest text-white block leading-none">
                  PARENTAL ADVISORY
                </span>
                <span className="text-[6px] font-mono tracking-wider text-[#a89880] block mt-0.5 leading-none uppercase">
                  EXPLICIT ARCHITECTURE
                </span>
              </div>

              {/* Barcode & Hologram Seal Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/90 backdrop-blur-md border border-white/20 px-2 py-1 rounded shadow-xl flex items-center gap-2 pointer-events-none">
                <div className="space-y-0.5">
                  <div className="flex gap-0.5 h-3 items-end">
                    {[2, 4, 1, 3, 5, 2, 4, 1, 3, 2, 5, 1].map((w, i) => (
                      <div key={i} className="bg-white/80" style={{ width: `${w}px`, height: "100%" }} />
                    ))}
                  </div>
                  <span className="text-[6px] font-mono text-[#7a6e62] block leading-none">
                    978-0-2026-ENG
                  </span>
                </div>
              </div>
            </div>

            {/* Album Footer Liner Info */}
            <div className="relative z-20 flex items-center justify-between pt-1 text-xs font-mono">
              <div>
                <span className="font-bold text-[#f0ebe3] block leading-tight text-sm tracking-tight">
                  {PROFILE.name}
                </span>
                <span className="text-[10px] text-[#5c5248] uppercase tracking-wider block mt-0.5">
                  PRODUCED & MASTERED 2026
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1db954] animate-pulse" />
                <span className="text-[10px] font-bold text-[#1db954] font-mono">
                  ORIGINAL MIX
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Layer 3: Overlaid Front Headline Badge */}
        <div className="absolute bottom-2 sm:bottom-4 z-20 text-center space-y-2 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141210]/95 backdrop-blur-md border border-[#332d26] text-xs font-mono tracking-widest text-[#e8a045] shadow-2xl">
            <span>BACKEND ARCHITECT & CLOUD SYSTEMS</span>
          </div>
          <p className="text-xs sm:text-sm text-[#a89880] font-mono max-w-md mx-auto hidden sm:block">
            High-Throughput Microservices · Sub-100ms SQL Indices · Enterprise APIs
          </p>
        </div>

      </div>

      {/* ── Bottom Modern Action Deck ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262630]/60 relative z-20">
        
        {/* Quick Bio Tagline */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#a89880] text-center sm:text-left">
          <Sparkle size={14} className="text-[#e8a045] shrink-0" />
          <span>Crafting resilient architectures at enterprise scale.</span>
        </div>

        {/* 2 Primary Modern Pill Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
          <button
            onClick={onExploreTracks}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#e8a045] text-black font-semibold text-xs font-mono hover:bg-[#f0b055] transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <span>EXPLORE TRACKS</span>
            <ArrowDown size={14} weight="bold" />
          </button>

          <a
            href={`mailto:${PROFILE.email}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1c1916] border border-[#4a4035] text-[#f0ebe3] font-mono text-xs hover:border-[#e8a045] transition-all cursor-pointer shadow-md"
          >
            <EnvelopeSimple size={14} />
            <span>TRANSMIT MESSAGE</span>
          </a>
        </div>

      </div>

    </div>
  );
};
