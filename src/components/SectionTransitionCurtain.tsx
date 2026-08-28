import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SectionTransitionCurtainProps {
  isTransitioning: boolean;
  targetSectionName: string;
  targetSectionSubtitle: string;
  accentColor: string;
}

export const SectionTransitionCurtain: React.FC<SectionTransitionCurtainProps> = ({
  isTransitioning,
  targetSectionName,
  targetSectionSubtitle,
  accentColor,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vinylDiscRef = useRef<HTMLDivElement | null>(null);
  const tonearmRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const scanlinesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (isTransitioning) {
        // INSTANT 100% COVERAGE (0ms delay, snaps immediately shut to mask layout switches)
        gsap.set(containerRef.current, {
          display: "flex",
          opacity: 1,
          pointerEvents: "auto",
        });

        const tl = gsap.timeline();

        // Tonearm drops on vinyl & disc spins at high speed
        tl.fromTo(
          tonearmRef.current,
          { rotate: -35, transformOrigin: "top right" },
          { rotate: 0, duration: 0.2, ease: "power3.out" }
        )
          .fromTo(
            vinylDiscRef.current,
            { scale: 0.8, rotate: 0 },
            { scale: 1, rotate: 720, duration: 0.9, ease: "none" },
            0
          )
          .fromTo(
            textRef.current,
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" },
            0.05
          );
      } else {
        // Smooth cinematic reveal when transitioning ends
        const tl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
              containerRef.current.style.pointerEvents = "none";
            }
          },
        });

        tl.to(tonearmRef.current, {
          rotate: -30,
          duration: 0.25,
          ease: "power2.in",
        })
          .to(
            textRef.current,
            {
              opacity: 0,
              y: -15,
              duration: 0.25,
              ease: "power2.in",
            },
            "<"
          )
          .to(
            containerRef.current,
            {
              opacity: 0,
              duration: 0.4,
              ease: "power3.out",
            },
            "-=0.1"
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070605] select-none overflow-hidden"
      style={{
        display: isTransitioning ? "flex" : "none",
        opacity: isTransitioning ? 1 : 0,
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 transition-colors duration-500 opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Retro Vinyl Grooves / Radar Scanline */}
      <div
        ref={scanlinesRef}
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.6)_51%)] bg-[length:100%_4px] pointer-events-none opacity-50"
      />

      {/* Main Music Turntable & Needle Cue Centerpiece */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 max-w-xl mx-auto text-center space-y-7">
        
        {/* Turntable Platter Deck Graphic */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-[#24201a] bg-[#12100e] p-3 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex items-center justify-center">
          
          {/* Outer Strobe Dots */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#3a332a] animate-[spin_8s_linear_infinite]" />

          {/* Spinning Vinyl Record with Grooves */}
          <div
            ref={vinylDiscRef}
            className="w-full h-full rounded-full border-2 border-[#332d26] bg-[radial-gradient(ellipse_at_center,#1c1916_0%,#0c0a08_40%,#181512_70%,#090807_100%)] flex items-center justify-center shadow-inner relative"
          >
            {/* Center Label (Sticker) */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center p-1 text-center shadow-md transition-colors duration-300"
              style={{
                background: `radial-gradient(circle, ${accentColor} 0%, #1c1916 100%)`,
                borderColor: accentColor,
              }}
            >
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-black uppercase leading-tight tracking-wider">
                SIDE 01
              </span>
              <span className="text-[7px] font-mono text-black/80 uppercase">
                45 RPM
              </span>
              {/* Spindle hole */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#090807] border border-[#332d26] mt-0.5" />
            </div>
          </div>

          {/* Turntable Tonearm (Needle Drop) */}
          <div
            ref={tonearmRef}
            className="absolute top-2 right-4 w-6 h-36 sm:h-40 pointer-events-none"
            style={{ transformOrigin: "top right" }}
          >
            {/* Pivot Base */}
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#3a332a] border border-[#5c5248] shadow-lg" />
            {/* Metal Arm */}
            <div className="absolute top-4 right-2.5 w-1 h-28 sm:h-32 bg-gradient-to-b from-[#8a7e70] to-[#4a4035] rounded-full shadow-md" />
            {/* Cartridge & Needle Head */}
            <div
              className="absolute bottom-0 right-0.5 w-4 h-6 rounded-sm shadow-md flex items-center justify-center"
              style={{ background: accentColor }}
            >
              <div className="w-1 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Needle Drop Audio Cue Title */}
        <div ref={textRef} className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1916] border border-[#332d26] text-xs font-mono tracking-widest text-[#a89880] shadow-inner">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ background: accentColor }}
            />
            <span className="text-[#f0ebe3] font-bold">DROPPING NEEDLE</span>
            <span className="text-[#5c5248]">/</span>
            <span>CUEING CHAPTER</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f0ebe3] leading-none">
            {targetSectionName}
          </h2>

          <p
            className="text-xs sm:text-sm font-mono tracking-wide font-medium"
            style={{ color: accentColor }}
          >
            {targetSectionSubtitle}
          </p>

          {/* Audio Equalizer Spectrum Bar */}
          <div className="flex items-center justify-center gap-1 pt-2">
            {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-[#242018] rounded-full overflow-hidden"
                style={{ height: "20px" }}
              >
                <div
                  className="w-full rounded-full animate-[pulse_0.4s_ease-in-out_infinite]"
                  style={{
                    height: `${h}%`,
                    background: accentColor,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
