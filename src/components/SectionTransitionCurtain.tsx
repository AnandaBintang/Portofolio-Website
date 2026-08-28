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
  const platterRef = useRef<HTMLDivElement | null>(null);
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const spectrumRef = useRef<HTMLDivElement | null>(null);
  const curtainTopRef = useRef<HTMLDivElement | null>(null);
  const curtainBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (isTransitioning) {
        // 1. INSTANT OPAQUE COVER: Mount container at full opacity at t=0
        gsap.set(containerRef.current, {
          display: "flex",
          opacity: 1,
          pointerEvents: "auto",
        });

        const tl = gsap.timeline();

        // 2. Dual physical shutter curtain closes with a solid analog snap
        tl.fromTo(
          curtainTopRef.current,
          { yPercent: -100 },
          { yPercent: 0, duration: 0.4, ease: "power4.inOut" }
        )
          .fromTo(
            curtainBottomRef.current,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.4, ease: "power4.inOut" },
            "<"
          )
          // 3. Complete Entrance: Platter, Vinyl, Tonearm, Text, and Spectrum enter harmoniously
          .fromTo(
            contentWrapperRef.current,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
            "-=0.15"
          )
          .fromTo(
            platterRef.current,
            { scale: 0.8, opacity: 0, rotate: -20 },
            { scale: 1, opacity: 1, rotate: 0, duration: 0.55, ease: "back.out(1.4)" },
            "<"
          )
          .fromTo(
            vinylDiscRef.current,
            { rotate: 0 },
            { rotate: 1440, duration: 3.5, ease: "power1.inOut" },
            "<"
          )
          // 4. Tonearm physically swings and drops onto the record grooves (Needle Drop)
          .fromTo(
            tonearmRef.current,
            { rotate: -42, transformOrigin: "top right" },
            { rotate: 2, duration: 0.5, ease: "power3.out" },
            "-=0.3"
          )
          // 5. Typography, Badge, and Spectrum reveal immediately
          .fromTo(
            [badgeRef.current, textRef.current, spectrumRef.current],
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.35"
          );
      } else {
        // FULL DRAMATIC NEEDLE LIFT & MECHANICAL SHUTTER REVEAL (Complete outgoing animation sequence)
        const tl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
              containerRef.current.style.pointerEvents = "none";
            }
          },
        });

        // Step A: Needle Lift Animation (Tonearm visibly swings back up from vinyl)
        tl.to(tonearmRef.current, {
          rotate: -42,
          duration: 0.45,
          ease: "power3.inOut",
        })
          // Step B: Text, Badge, Spectrum and Turntable Platter animate out smoothly
          .to(
            [textRef.current, badgeRef.current, spectrumRef.current],
            {
              opacity: 0,
              y: -20,
              stagger: 0.04,
              duration: 0.35,
              ease: "power2.in",
            },
            "-=0.25"
          )
          .to(
            platterRef.current,
            {
              scale: 0.8,
              opacity: 0,
              rotate: 15,
              duration: 0.4,
              ease: "power2.in",
            },
            "-=0.3"
          )
          .to(
            contentWrapperRef.current,
            {
              opacity: 0,
              scale: 0.95,
              duration: 0.3,
              ease: "power2.in",
            },
            "-=0.2"
          )
          // Step C: Mechanical shutter panels split open to reveal the target section
          .to(
            curtainTopRef.current,
            {
              yPercent: -100,
              duration: 0.55,
              ease: "power4.inOut",
            },
            "-=0.1"
          )
          .to(
            curtainBottomRef.current,
            {
              yPercent: 100,
              duration: 0.55,
              ease: "power4.inOut",
            },
            "<"
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        display: isTransitioning ? "flex" : "none",
        opacity: isTransitioning ? 1 : 0,
      }}
    >
      {/* Mechanical Shutter Top & Bottom Panels */}
      <div
        ref={curtainTopRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#080706] border-b border-[#24201a] z-10"
      />
      <div
        ref={curtainBottomRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#080706] border-t border-[#24201a] z-10"
      />

      {/* Centerpiece Container inside Shutter */}
      <div
        ref={contentWrapperRef}
        className="relative z-20 flex flex-col items-center justify-center p-6 max-w-xl mx-auto text-center space-y-6"
      >
        {/* Background Radial Glow */}
        <div
          className="absolute -inset-20 transition-colors duration-500 opacity-25 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 65%)`,
          }}
        />

        {/* Turntable Platter Deck Graphic */}
        <div
          ref={platterRef}
          className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-[#24201a] bg-[#12100e] p-2.5 shadow-[0_0_70px_rgba(0,0,0,0.9)] flex items-center justify-center"
        >
          {/* Outer Strobe Dots */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#3a332a] animate-[spin_10s_linear_infinite]" />

          {/* Spinning Vinyl Record with Grooves */}
          <div
            ref={vinylDiscRef}
            className="w-full h-full rounded-full border-2 border-[#332d26] bg-[radial-gradient(ellipse_at_center,#1c1916_0%,#0c0a08_40%,#181512_70%,#090807_100%)] flex items-center justify-center shadow-inner relative"
          >
            {/* Center Label (Sticker) */}
            <div
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-2 flex flex-col items-center justify-center p-1 text-center shadow-md transition-colors duration-300"
              style={{
                background: `radial-gradient(circle, ${accentColor} 0%, #1c1916 100%)`,
                borderColor: accentColor,
              }}
            >
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-black uppercase leading-tight tracking-wider">
                MASTER
              </span>
              <span className="text-[7px] font-mono text-black/80 uppercase">
                45 RPM
              </span>
              {/* Spindle hole */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#090807] border border-[#332d26] mt-0.5" />
            </div>
          </div>

          {/* Turntable Tonearm (Needle Drop & Lift) */}
          <div
            ref={tonearmRef}
            className="absolute top-2 right-4 w-6 h-32 sm:h-36 pointer-events-none"
            style={{ transformOrigin: "top right" }}
          >
            {/* Pivot Base */}
            <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#3a332a] border border-[#5c5248] shadow-lg" />
            {/* Metal Arm */}
            <div className="absolute top-3.5 right-2 w-1 h-24 sm:h-28 bg-gradient-to-b from-[#8a7e70] to-[#4a4035] rounded-full shadow-md" />
            {/* Cartridge & Needle Head */}
            <div
              className="absolute bottom-0 right-0 w-3.5 h-5 rounded-sm shadow-md flex items-center justify-center"
              style={{ background: accentColor }}
            >
              <div className="w-1 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Needle Drop Audio Cue Title */}
        <div className="space-y-2.5">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1916] border border-[#332d26] text-xs font-mono tracking-widest text-[#a89880] shadow-inner"
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ background: accentColor }}
            />
            <span className="text-[#f0ebe3] font-bold">DROPPING NEEDLE</span>
            <span className="text-[#5c5248]">/</span>
            <span>CUEING CHAPTER</span>
          </div>

          <div ref={textRef} className="space-y-1">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3] leading-none">
              {targetSectionName}
            </h2>

            <p
              className="text-xs sm:text-sm font-mono tracking-wide font-medium"
              style={{ color: accentColor }}
            >
              {targetSectionSubtitle}
            </p>
          </div>

          {/* Audio Equalizer Spectrum Bar */}
          <div
            ref={spectrumRef}
            className="flex items-center justify-center gap-1.5 pt-1.5"
          >
            {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70, 40, 60].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-[#242018] rounded-full overflow-hidden"
                style={{ height: "18px" }}
              >
                <div
                  className="w-full rounded-full animate-[pulse_0.5s_ease-in-out_infinite]"
                  style={{
                    height: `${h}%`,
                    background: accentColor,
                    animationDelay: `${i * 0.04}s`,
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
