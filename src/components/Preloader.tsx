import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
  callsign: string;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, callsign }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const vinylRef = useRef<HTMLDivElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Counter increment loop
    const startTime = Date.now();
    const duration = 1800; // 1.8s load

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);

        // 2. Play GSAP out-animation sequence
        if (containerRef.current) {
          const tl = gsap.timeline({
            onComplete: () => {
              onComplete();
            },
          });

          tl.to(textRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.35,
            ease: "power2.in",
          })
            .to(
              vinylRef.current,
              {
                scale: 1.15,
                opacity: 0,
                duration: 0.4,
                ease: "power3.in",
              },
              "-=0.2"
            )
            .to(
              progressLineRef.current,
              {
                scaleX: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
              },
              "-=0.25"
            )
            .to(
              containerRef.current,
              {
                yPercent: -100,
                duration: 0.65,
                ease: "power4.inOut",
              },
              "-=0.1"
            );
        } else {
          onComplete();
        }
      }
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0c0a08] flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
    >
      {/* Film grain texture */}
      <div className="grain" />

      {/* Top Bar Status */}
      <div className="flex items-center justify-between text-xs font-mono text-[#5c5248] border-b border-[#24201a] pb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#e8a045] animate-pulse" />
          <span className="text-[#f0ebe3] font-bold tracking-wider uppercase">
            {callsign}
          </span>
        </div>
        <span className="text-[10px] tracking-widest text-[#7a6e62]">
          SYSTEM INITIALIZING
        </span>
      </div>

      {/* Centerpiece Turntable & Kinetic Loading */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 my-auto">
        
        {/* Spinning Vinyl Master */}
        <div
          ref={vinylRef}
          className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-[#24201a] bg-[#12100e] p-2.5 shadow-[0_0_80px_rgba(232,160,69,0.15)] flex items-center justify-center"
        >
          {/* Outer strobe dashed track */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#3a332a] animate-[spin_8s_linear_infinite]" />

          {/* Vinyl Record */}
          <div className="w-full h-full rounded-full border-2 border-[#332d26] bg-[radial-gradient(ellipse_at_center,#1c1916_0%,#0c0a08_40%,#181512_70%,#090807_100%)] flex items-center justify-center shadow-inner animate-[spin_3s_linear_infinite]">
            {/* Center Label */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#e8a045] bg-gradient-to-tr from-[#e8a045] to-[#f0b055] flex flex-col items-center justify-center p-1 text-center shadow-lg">
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-black uppercase tracking-wider">
                MASTER
              </span>
              <span className="text-[7px] font-mono text-black/80 font-bold">
                45 RPM
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0c0a08] mt-0.5" />
            </div>
          </div>
        </div>

        {/* Dynamic Percentage & Title */}
        <div ref={textRef} className="text-center space-y-2 max-w-sm">
          <div className="flex items-center justify-center gap-1 font-mono font-bold text-4xl sm:text-6xl text-[#f0ebe3] tracking-tighter">
            <span>{progress}</span>
            <span className="text-[#e8a045] text-2xl sm:text-3xl">%</span>
          </div>

          <p className="text-xs sm:text-sm font-mono text-[#a89880] tracking-wider uppercase">
            CALIBRATING AUDIO & ARCHITECTURES
          </p>
        </div>
      </div>

      {/* Bottom Loading Bar Line */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#5c5248]">
          <span>FREQUENCY: 44.1 kHz</span>
          <span>BUFFER READY</span>
        </div>

        <div
          ref={progressLineRef}
          className="w-full h-1 bg-[#1c1916] rounded-full overflow-hidden border border-[#2a2520]"
        >
          <div
            className="h-full bg-gradient-to-r from-[#e8a045] via-[#4a9eff] to-[#1db954] transition-all duration-75 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
