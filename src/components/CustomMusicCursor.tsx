import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface CustomMusicCursorProps {
  accentColor: string;
  isPlaying: boolean;
}

export const CustomMusicCursor: React.FC<CustomMusicCursorProps> = ({
  accentColor,
  isPlaying,
}) => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const vinylRef = useRef<HTMLDivElement | null>(null);
  const [hoverState, setHoverState] = useState<"default" | "pointer" | "text">("default");
  const [hoverText, setHoverText] = useState<string>("");
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isVisible = useRef(false);

  useEffect(() => {
    // Only mount custom cursor on desktop (hover capable devices)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }

      // Snappy position for the center stylus dot
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.05,
          ease: "none",
        });
      }

      // Check hover targets for interactive states
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("button, a, [role='button'], input, [data-cursor]");
      const isHeading = target.closest("h1, h2, h3");

      if (clickable) {
        setHoverState("pointer");
        const customText = clickable.getAttribute("data-cursor-text") || "PLAY";
        setHoverText(customText);
      } else if (isHeading) {
        setHoverState("text");
        setHoverText("");
      } else {
        setHoverState("default");
        setHoverText("");
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Smooth Heavy Inertia Lerp for the outer Vinyl Disc Ring
    let rafId: number;
    const lerpRing = () => {
      // Smooth Awwwards trailing lerp
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.14;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.14;

      if (ringRef.current) {
        gsap.set(ringRef.current, {
          x: ringPos.current.x,
          y: ringPos.current.y,
        });
      }

      rafId = requestAnimationFrame(lerpRing);
    };

    rafId = requestAnimationFrame(lerpRing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Center Stylus Dot / Needle Tip */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] transition-opacity duration-200 opacity-0"
        style={{ willChange: "transform" }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            hoverState === "pointer"
              ? "w-2 h-2 bg-white"
              : hoverState === "text"
              ? "w-1 h-5 bg-white rounded-none"
              : "w-2.5 h-2.5"
          }`}
          style={{
            background: hoverState === "pointer" ? "#ffffff" : accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
      </div>

      {/* Heavy Trailing Vinyl Ring & Strobe Audio Halo */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[99] transition-opacity duration-300 opacity-0 flex items-center justify-center"
        style={{ willChange: "transform" }}
      >
        <div
          ref={vinylRef}
          className={`rounded-full border transition-all duration-300 flex items-center justify-center ${
            hoverState === "pointer"
              ? "w-16 h-16 bg-[#141210]/95 border-2 scale-110 shadow-2xl backdrop-blur-sm"
              : hoverState === "text"
              ? "w-10 h-10 border-dashed opacity-40 scale-75"
              : "w-8 h-8 border-opacity-40"
          }`}
          style={{
            borderColor: accentColor,
            boxShadow: hoverState === "pointer" ? `0 0 25px ${accentColor}50` : "none",
          }}
        >
          {/* Rotating Vinyl Grooves on Hover or Audio Playback */}
          <div
            className={`w-full h-full rounded-full border border-dashed border-white/25 absolute inset-0 transition-transform ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
          />

          {/* Equalizer Frequency Pulse Dots inside Cursor */}
          {hoverState === "pointer" && (
            <span
              className="text-[9px] font-mono font-bold tracking-wider uppercase text-center select-none"
              style={{ color: accentColor }}
            >
              {hoverText}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
