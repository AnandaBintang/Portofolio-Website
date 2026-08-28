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
  const cardRef = useRef<HTMLDivElement | null>(null);
  const vinylDiscRef = useRef<HTMLDivElement | null>(null);
  const tonearmRef = useRef<HTMLDivElement | null>(null);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isTransitioning) {
      wasActiveRef.current = true;
      // 1. Instantly display & lock the solid backdrop
      containerRef.current.style.display = "flex";
      containerRef.current.style.pointerEvents = "auto";

      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 2. Solid Curtain Fades In quickly
        tl.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "power2.out" }
        )
          // 3. Entire Turntable + Typography enters together
          .fromTo(
            cardRef.current,
            { opacity: 0, scale: 0.88, y: 25 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" },
            0.05
          )
          // 4. Continuous Vinyl Spin
          .fromTo(
            vinylDiscRef.current,
            { rotate: 0 },
            { rotate: 1800, duration: 4, ease: "power1.inOut" },
            0
          )
          // 5. Tonearm Drops onto the spinning vinyl grooves
          .fromTo(
            tonearmRef.current,
            { rotate: -38, transformOrigin: "top right" },
            { rotate: 2, duration: 0.45, ease: "back.out(1.3)" },
            0.1
          );
      }, containerRef);

      return () => ctx.revert();
    } else if (wasActiveRef.current) {
      // ONLY RUN OUTGOING ANIMATION IF IT WAS ACTUALLY ACTIVE
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
              containerRef.current.style.pointerEvents = "none";
            }
            wasActiveRef.current = false;
          },
        });

        // Step 1: CLEAR NEEDLE LIFT (Tonearm swings up dramatically from record)
        tl.to(tonearmRef.current, {
          rotate: -40,
          duration: 0.5,
          ease: "power3.inOut",
        })
          // Step 2: Turntable card slides slightly up and scales down gracefully
          .to(
            cardRef.current,
            {
              opacity: 0,
              scale: 0.9,
              y: -20,
              duration: 0.45,
              ease: "power2.in",
            },
            "-=0.2"
          )
          // Step 3: Dark backdrop smoothly fades away revealing the target section
          .to(
            containerRef.current,
            {
              opacity: 0,
              duration: 0.45,
              ease: "power2.out",
            },
            "-=0.15"
          );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090807] select-none overflow-hidden"
      style={{
        display: "none",
        opacity: 0,
      }}
    >
      {/* 100% Opaque Solid Base to isolate section underneath */}
      <div className="absolute inset-0 bg-[#090807] z-0 pointer-events-none" />

      {/* Controlled Radial Atmosphere Glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none z-1"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 60%)`,
        }}
      />

      {/* Subtle Analog Tape Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.6)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40 z-2" />

      {/* Complete Synchronized Turntable & Cue Information Box */}
      <div
        ref={cardRef}
        className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-8 max-w-xl mx-auto text-center space-y-6"
      >
        {/* Turntable Platter Deck Graphic */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-[#24201a] bg-[#12100e] p-2.5 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex items-center justify-center">
          {/* Strobe Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#3a332a] animate-[spin_10s_linear_infinite]" />

          {/* Vinyl Record */}
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
              <div className="w-2.5 h-2.5 rounded-full bg-[#090807] border border-[#332d26] mt-0.5" />
            </div>
          </div>

          {/* Tonearm (Needle Drop & Lift) */}
          <div
            ref={tonearmRef}
            className="absolute top-2 right-4 w-6 h-32 sm:h-36 pointer-events-none"
            style={{ transformOrigin: "top right" }}
          >
            <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#3a332a] border border-[#5c5248] shadow-lg" />
            <div className="absolute top-3.5 right-2 w-1 h-24 sm:h-28 bg-gradient-to-b from-[#8a7e70] to-[#4a4035] rounded-full shadow-md" />
            <div
              className="absolute bottom-0 right-0 w-3.5 h-5 rounded-sm shadow-md flex items-center justify-center"
              style={{ background: accentColor }}
            >
              <div className="w-1 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Needle Drop Badge & Chapter Details (Always inlined together with vinyl) */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1916] border border-[#332d26] text-xs font-mono tracking-widest text-[#a89880] shadow-inner">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ background: accentColor }}
            />
            <span className="text-[#f0ebe3] font-bold">DROPPING NEEDLE</span>
            <span className="text-[#5c5248]">/</span>
            <span>CUEING CHAPTER</span>
          </div>

          <div className="space-y-1">
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
          <div className="flex items-center justify-center gap-1.5 pt-1.5">
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
