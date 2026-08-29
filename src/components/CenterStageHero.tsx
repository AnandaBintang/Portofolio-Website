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
  const vinylHubRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // 3D Magnetic Interactive Tilt on Mouse Move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      // Subtle 3D perspective tilt
      setTilt({
        rotateX: -y * 12,
        rotateY: x * 15,
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
          <span className="text-[#1db954] font-semibold tracking-widest">SIDE A · TRACK 00</span>
          <span className="text-[#332d26]">/</span>
          <span className="text-[#a89880] truncate">RESIDENCY: WEEKEND INC. (SAMPOERNA)</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#5c5248] tracking-widest uppercase">
          <span>{PROFILE.coordinates}</span>
          <span>·</span>
          <span>96kHz / 24-BIT</span>
        </div>
      </div>

      {/* ── Center Stage Visual Composition ── */}
      <div className="relative flex-1 flex items-center justify-center my-6 md:my-10">
        
        {/* Layer 1: Massive Background Kinetic Display Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <span className="text-[14vw] font-bold tracking-tighter text-[#161310] leading-none uppercase select-none opacity-80 transition-transform duration-700">
            ANANDA
          </span>
          <span className="text-[14vw] font-bold tracking-tighter text-[#1c1814] leading-none uppercase select-none -mt-4 sm:-mt-8 opacity-60">
            BINTANG
          </span>
        </div>

        {/* Layer 2: Center Stage Floating 3D Vinyl Turntable Lens */}
        <div
          ref={vinylHubRef}
          className="relative z-10 flex items-center justify-center group cursor-pointer"
          style={{
            perspective: "1000px",
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transition: "transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
          }}
          onClick={onExploreTracks}
        >
          {/* Outward Acoustic Resonance Waves (Pulses when Audio is Playing) */}
          <div
            className={`absolute -inset-10 sm:-inset-16 rounded-full border border-dashed transition-all duration-1000 pointer-events-none ${
              isPlaying
                ? "border-[#1db954]/40 scale-110 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"
                : "border-white/10 scale-95"
            }`}
          />
          <div
            className={`absolute -inset-20 sm:-inset-28 rounded-full border border-white/5 pointer-events-none transition-all duration-700 ${
              isPlaying ? "scale-105 opacity-60" : "scale-90 opacity-20"
            }`}
          />

          {/* Master 3D Vinyl Record Platter */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-[#12100e] border-4 border-[#24201a] shadow-[0_30px_90px_rgba(0,0,0,0.95)] p-3 flex items-center justify-center">
            
            {/* Strobe Dots Ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-[#3a332a] animate-[spin_16s_linear_infinite]" />

            {/* Rotating Vinyl Grooves Body */}
            <div
              className={`w-full h-full rounded-full border-2 border-[#332d26] bg-[radial-gradient(ellipse_at_center,#1a1714_0%,#0c0a08_40%,#181512_70%,#070605_100%)] flex items-center justify-center shadow-inner relative transition-transform ${
                isPlaying ? "animate-[spin_6s_linear_infinite]" : "group-hover:rotate-45 duration-700"
              }`}
            >
              {/* Radial Grooves Sheen */}
              <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-10 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-white/5 pointer-events-none" />

              {/* Center Vinyl Label Housing The Photo Artwork */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full p-1.5 border-2 shadow-2xl flex items-center justify-center overflow-hidden transition-colors duration-500"
                style={{
                  background: `radial-gradient(circle, ${accentColor} 0%, #1c1916 100%)`,
                  borderColor: accentColor,
                }}
              >
                {/* Photo Lens */}
                <img
                  src={PROFILE.avatarUrl}
                  alt={PROFILE.name}
                  className="w-full h-full object-cover rounded-full grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                />

                {/* Micro Label Overlay */}
                <div className="absolute bottom-2 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-sm border border-white/20 text-[8px] font-mono text-white font-bold tracking-widest uppercase">
                  MASTER ARTIST
                </div>
              </div>
            </div>
          </div>

          {/* Floating Turntable Tonearm Stylus */}
          <div className="absolute -top-4 -right-2 sm:-top-8 sm:-right-4 w-10 h-44 sm:h-56 pointer-events-none transition-transform duration-700 group-hover:rotate-6">
            <div className="w-8 h-8 rounded-full bg-[#3a332a] border border-[#5c5248] shadow-2xl ml-auto" />
            <div className="w-1.5 h-36 sm:h-44 bg-gradient-to-b from-[#8a7e70] via-[#5c5248] to-[#332d26] rounded-full ml-auto mr-3 shadow-lg" />
            <div
              className="w-4 h-6 rounded-sm shadow-xl ml-auto mr-1.5 flex items-center justify-center transition-colors"
              style={{ background: accentColor }}
            >
              <div className="w-1 h-2 bg-white rounded-full" />
            </div>
          </div>

        </div>

        {/* Layer 3: Overlaid Front Punchy Headline Badge */}
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
