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

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (isTransitioning) {
        // 1. Instantly mount backdrop at full opacity (0ms) so background glow never leaks
        gsap.set(containerRef.current, {
          display: "flex",
          opacity: 1,
          pointerEvents: "auto",
        });

        const tl = gsap.timeline();

        // 2. Cohesive Entrance: Platter, Tonearm, Text, and Spectrum enter together synchronously
        tl.fromTo(
          contentWrapperRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
        )
          .fromTo(
            platterRef.current,
            { scale: 0.85, opacity: 0, rotate: -15 },
            { scale: 1, opacity: 1, rotate: 0, duration: 0.45, ease: "back.out(1.3)" },
            0
          )
          .fromTo(
            vinylDiscRef.current,
            { rotate: 0 },
            { rotate: 1080, duration: 2.2, ease: "power1.inOut" },
            0
          )
          .fromTo(
            tonearmRef.current,
            { rotate: -38, transformOrigin: "top right" },
            { rotate: 2, duration: 0.4, ease: "power3.out" },
            0.1
          )
          // Headline, Badge, & Equalizer bars reveal immediately alongside the turntable
          .fromTo(
            [badgeRef.current, textRef.current, spectrumRef.current],
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.35,
              ease: "power2.out",
            },
            0.1
          );
      } else {
        // Smooth Exit Reveal: Needle lifts, typography slides up, backdrop fades out seamlessly
        const tl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
              containerRef.current.style.pointerEvents = "none";
            }
          },
        });

        // Step A: Tonearm lifts off the record
        tl.to(tonearmRef.current, {
          rotate: -38,
          duration: 0.35,
          ease: "power3.inOut",
        })
          // Step B: Content fades out together
          .to(
            contentWrapperRef.current,
            {
              opacity: 0,
              scale: 0.96,
              y: -10,
              duration: 0.3,
              ease: "power2.in",
            },
            "-=0.15"
          )
          // Step C: Backdrop fades out cleanly
          .to(
            containerRef.current,
            {
              opacity: 0,
              duration: 0.35,
              ease: "power2.out",
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
      {/* Solid Backdrop Layer (Ensures 100% opacity, no leaking page background) */}
      <div className="absolute inset-0 bg-[#070605] z-0" />

      {/* Subtle Radial Glow bound strictly inside the curtain */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-20 pointer-events-none z-1"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 65%)`,
        }}
      />

      {/* Retro Scanline texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.6)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40 z-2" />

      {/* Synchronized Content Wrapper */}
      <div
        ref={contentWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center p-6 max-w-xl mx-auto text-center space-y-6"
      >
        {/* Turntable Platter Deck */}
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
              <div className="w-2 h-2 rounded-full bg-[#090807] border border-[#332d26] mt-0.5" />
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
