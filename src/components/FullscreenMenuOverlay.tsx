import React, { useState, useEffect, useRef } from "react";
import { X, Play, Pause, Disc, ArrowUpRight } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { Waveform } from "./Waveform";

interface FullscreenMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Array<{
    id: string;
    navLabel: string;
    mobileShort: string;
    name: string;
    subtitle: string;
    accent: string;
    chapterNumber: string;
  }>;
  activeSectionIdx: number;
  onSelectSection: (idx: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const FullscreenMenuOverlay: React.FC<FullscreenMenuOverlayProps> = ({
  isOpen,
  onClose,
  sections,
  activeSectionIdx,
  onSelectSection,
  isPlaying,
  onTogglePlay,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small timeout to allow DOM mounting before GSAP animation
      const timer = setTimeout(() => {
        if (!overlayRef.current) return;
        const ctx = gsap.context(() => {
          const tl = gsap.timeline();

          // Stage 1: Full-screen curtain wipe from bottom to top
          tl.fromTo(
            backdropRef.current,
            { yPercent: 100, opacity: 1 },
            { yPercent: 0, duration: 0.5, ease: "power4.out" }
          )
            // Stage 2: Fade in content wrapper
            .fromTo(
              contentRef.current,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
              "-=0.25"
            )
            // Stage 3: Kinetic stagger for chapter headlines
            .fromTo(
              itemsRef.current.filter(Boolean),
              { opacity: 0, x: -50, filter: "blur(6px)" },
              {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                stagger: 0.08,
                duration: 0.5,
                ease: "power3.out",
              },
              "-=0.2"
            )
            // Stage 4: Vinyl deck rotate & scale in
            .fromTo(
              deckRef.current,
              { opacity: 0, scale: 0.8, rotate: -15 },
              { opacity: 1, scale: 1, rotate: 0, duration: 0.55, ease: "back.out(1.4)" },
              "-=0.3"
            );
        }, overlayRef);

        return () => ctx.revert();
      }, 10);

      return () => clearTimeout(timer);
    } else if (shouldRender) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setShouldRender(false);
          },
        });

        tl.to(contentRef.current, {
          opacity: 0,
          scale: 0.96,
          duration: 0.2,
          ease: "power2.in",
        }).to(
          backdropRef.current,
          { yPercent: 100, duration: 0.4, ease: "power4.in" },
          "-=0.08"
        );
      }, overlayRef);

      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const currentHoverAccent =
    hoveredIdx !== null
      ? sections[hoveredIdx].accent
      : sections[activeSectionIdx].accent;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* Full Seamless Backdrop Curtain (No split line in the center) */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[#0c0a08] z-10 shadow-2xl"
      />

      {/* Main Content Container inside Shutter */}
      <div
        ref={contentRef}
        className="relative z-20 w-full h-full flex flex-col justify-between p-6 sm:p-12 overflow-y-auto"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 50% at 80% 20%, ${currentHoverAccent}18 0%, transparent 65%)`,
          transition: "background 0.5s ease",
        }}
      >
        {/* Background Film Grain */}
        <div className="grain" />

        {/* Top Header bar */}
        <div className="flex items-center justify-between border-b border-[#332d26] pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#4a4035] bg-[#1c1916] flex items-center justify-center text-white shadow-inner">
              <Disc
                size={20}
                className={`transition-all duration-700 ${isPlaying ? "animate-spin text-[#1db954]" : "text-[#e8a045]"}`}
                style={{ animationDuration: "4s" }}
              />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#f0ebe3] block uppercase">
                STUDIO MASTER NAVIGATION
              </span>
              <span className="text-[10px] font-mono text-[#5c5248] tracking-widest block uppercase">
                SELECT RECORDING CHAPTER
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a4035] bg-[#1c1916] text-[#a89880] hover:text-[#f0ebe3] hover:border-[#e8a045] active:scale-95 transition-all cursor-pointer shadow-lg group"
            aria-label="Close Navigation"
          >
            <span className="text-xs font-mono">CLOSE TAPE</span>
            <X size={16} weight="bold" className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Center Section Chapters + Live Turntable Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-8 my-auto relative z-10">
          
          {/* Left: 4 Kinetic Chapter Headlines */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {sections.map((sec, idx) => {
              const isActive = idx === activeSectionIdx;
              const isHovered = idx === hoveredIdx;

              return (
                <div
                  key={sec.id}
                  ref={(el) => {
                    itemsRef.current[idx] = el;
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => onSelectSection(idx)}
                  className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 cursor-pointer py-2 border-b border-[#2a2520] transition-all"
                >
                  {/* Track Chapter Prefix */}
                  <span
                    className="text-xs sm:text-sm font-mono font-bold tracking-widest transition-colors duration-300"
                    style={{
                      color: isHovered || isActive ? sec.accent : "#5c5248",
                    }}
                  >
                    {sec.chapterNumber}
                  </span>

                  {/* Big Display Headline */}
                  <div className="flex-1">
                    <h2
                      className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-all duration-300 leading-none group-hover:translate-x-3"
                      style={{
                        color: isHovered || isActive ? "#f0ebe3" : "#7a6e62",
                      }}
                    >
                      {sec.name}
                    </h2>
                    <p className="text-xs sm:text-sm font-mono text-[#5c5248] group-hover:text-[#a89880] transition-colors mt-1.5">
                      {sec.subtitle}
                    </p>
                  </div>

                  {/* Active / Select Marker */}
                  <div className="shrink-0 flex items-center gap-2 pt-1 sm:pt-0">
                    {isActive && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#1db954] text-black shadow-md">
                        ACTIVE TAPE
                      </span>
                    )}
                    <span
                      className="w-8 h-8 rounded-full border border-[#332d26] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `${sec.accent}20`, borderColor: sec.accent }}
                    >
                      <ArrowUpRight size={14} style={{ color: sec.accent }} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Live Interactive Audio Deck Monitor */}
          <div
            ref={deckRef}
            className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center p-8 rounded-3xl bg-[#141210]/95 border border-[#332d26] shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between w-full border-b border-[#2a2520] pb-3 text-xs font-mono text-[#5c5248]">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: currentHoverAccent }}
                />
                MONITOR DECK
              </span>
              <span className="text-[#a89880]">96kHz / 24-BIT</span>
            </div>

            {/* Rotating Vinyl Graphic */}
            <div
              className={`w-44 h-44 rounded-full border border-[#4a4035] bg-gradient-to-tr from-[#12100e] via-[#1c1916] to-[#0a0908] shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center transition-transform duration-1000 ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "5s" }}
            >
              <div
                className="w-18 h-18 rounded-full border flex items-center justify-center p-2 text-center transition-colors duration-500"
                style={{
                  background: `radial-gradient(circle, ${currentHoverAccent}35 0%, #1c1916 100%)`,
                  borderColor: currentHoverAccent,
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a0908] border border-[#4a4035]" />
              </div>
            </div>

            {/* Mini Waveform & Audio Controller */}
            <div className="w-full space-y-3">
              <div className="h-8 bg-[#0a0807] border border-[#2a2520] rounded-xl p-1.5 overflow-hidden">
                <Waveform isPlaying={isPlaying} barCount={24} height={24} accent={currentHoverAccent} />
              </div>

            <button
              onClick={onTogglePlay}
              className="w-full py-3 rounded-xl border border-[#4a4035] bg-[#1c1916] hover:bg-[#242018] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              {isPlaying ? (
                <>
                  <Pause size={14} weight="fill" className="text-[#1db954]" />
                  <span>PAUSE AMBIENT AUDIO</span>
                </>
              ) : (
                <>
                  <Play size={14} weight="fill" style={{ color: currentHoverAccent }} />
                  <span>ENGAGE AMBIENT AUDIO</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Metadata Bar */}
      <div className="border-t border-[#332d26] pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5c5248] relative z-10">
        <div>
          <span>KEYBOARD SHORTCUTS: </span>
          <span className="text-[#a89880]">ESC to Close · SPACE to Play/Pause</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ANANDA BINTANG · 2026 ARCHIVE</span>
        </div>
      </div>
    </div>
  </div>
);
};
