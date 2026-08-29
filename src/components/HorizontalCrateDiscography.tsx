import React, { useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PLAYABLE_TRACKS, PROJECTS, type Track } from "../data/tracks";

interface HorizontalCrateDiscographyProps {
  activeTrackIdx: number;
  currentTrack: Track;
  isPlaying: boolean;
  onTrackInView?: (idx: number) => void;
}

export const HorizontalCrateDiscography: React.FC<HorizontalCrateDiscographyProps> = ({
  activeTrackIdx,
  isPlaying,
  onTrackInView,
}) => {
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const [scrollXProgress, setScrollXProgress] = useState(0);

  // Sync scroll percentage and trigger active track change based on horizontal position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    if (maxScrollLeft > 0) {
      const progress = target.scrollLeft / maxScrollLeft;
      setScrollXProgress(progress);

      // Determine active index (0 to 3) based on horizontal scroll
      const cardWidth = target.scrollWidth / PLAYABLE_TRACKS.length;
      const currentIdx = Math.min(
        PLAYABLE_TRACKS.length - 1,
        Math.max(0, Math.round(target.scrollLeft / cardWidth))
      );

      if (onTrackInView && currentIdx !== activeTrackIdx) {
        onTrackInView(currentIdx);
      }
    }
  };

  // Convert vertical mouse wheel into smooth horizontal crate scrub when hovering over the track
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = scrollTrackRef.current;
    if (!target) return;

    const atHorizontalEnd = target.scrollLeft + target.clientWidth >= target.scrollWidth - 4;
    const atHorizontalStart = target.scrollLeft <= 4;

    // If still scrubbing horizontally inside the crate, convert vertical deltaY to horizontal scrollLeft
    if ((e.deltaY > 0 && !atHorizontalEnd) || (e.deltaY < 0 && !atHorizontalStart)) {
      e.stopPropagation();
      target.scrollLeft += e.deltaY * 1.5;
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-[fadeIn_0.5s_ease-out] relative">
      {/* ── Section Header ── */}
      <div className="space-y-3 pb-5 border-b border-[#2a2520] relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#4a9eff]">
            <span className="w-2 h-2 rounded-full bg-[#4a9eff] animate-pulse" />
            <span>STUDIO DISCOGRAPHY · HORIZONTAL VINYL CRATE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f0ebe3] mt-2">
            SELECTED RELEASES.
          </h2>
          <p className="text-xs sm:text-sm text-[#a89880] max-w-xl font-mono leading-relaxed mt-1">
            Scroll or swipe horizontally through the studio record crate to dig into architectural deliverables.
          </p>
        </div>

        {/* Horizontal Scrub Indicator Bar */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-mono text-[#5c5248]">
            DIGGING: TRACK 0{activeTrackIdx + 1} / 04
          </span>
          <div className="w-28 sm:w-36 h-1.5 bg-[#1c1916] rounded-full overflow-hidden border border-[#2a2520]">
            <div
              className="h-full bg-[#4a9eff] rounded-full transition-all duration-150"
              style={{
                width: `${Math.min(100, Math.max(15, (scrollXProgress + 0.1) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Horizontal Scrollable Vinyl Crate Stream ── */}
      <div
        ref={scrollTrackRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        className="flex gap-6 sm:gap-8 overflow-x-auto pb-8 pt-2 scrollable snap-x snap-mandatory select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {PLAYABLE_TRACKS.map((t, idx) => {
          const project = PROJECTS[t.id];
          const isActive = idx === activeTrackIdx;

          return (
            <div
              key={t.id}
              data-project-index={idx}
              className="w-[85vw] sm:w-[460px] md:w-[540px] shrink-0 snap-center will-change-transform"
            >
              {/* 3D Vinyl Crate Card */}
              <div
                className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-500 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between min-h-[500px] sm:min-h-[540px] group ${
                  isActive
                    ? "bg-[#141210] border-[#4a4035] scale-100 shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
                    : "bg-[#100e0c]/90 border-[#26211c] scale-98 hover:border-[#3a332a]"
                }`}
              >
                {/* Vinyl Record Peeking Out Behind Sleeve */}
                <div
                  className={`absolute -right-10 -top-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#12100e] border-4 border-[#24201a] shadow-2xl flex items-center justify-center pointer-events-none transition-all duration-700 opacity-60 group-hover:opacity-100 group-hover:scale-105 ${
                    isPlaying && isActive ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "6s" }}
                >
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#3a332a]" />
                  <div
                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-2 flex flex-col items-center justify-center p-1"
                    style={{
                      background: `radial-gradient(circle, ${t.artAccent} 0%, #1c1916 100%)`,
                      borderColor: t.artAccent,
                    }}
                  >
                    <span className="text-[7px] font-mono font-bold text-black uppercase">45 RPM</span>
                  </div>
                </div>

                {/* Subtle Ambient Radial Glow */}
                <div
                  className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
                  style={{ background: t.artAccent }}
                />

                {/* Background Watermark Track Number */}
                <div className="absolute bottom-2 right-4 pointer-events-none z-0 select-none overflow-hidden">
                  <span
                    className="text-[120px] sm:text-[160px] font-bold tracking-tighter font-mono leading-none block opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                    style={{ color: t.artAccent }}
                  >
                    {t.trackNo}
                  </span>
                </div>

                {/* Top Card Content */}
                <div className="relative z-10 space-y-5">
                  {/* Header Line */}
                  <div className="space-y-1.5 border-b border-[#24201a] pb-3.5">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2"
                        style={{ color: t.artAccent }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.artAccent }} />
                        {t.storyChapter} · {t.bpm} BPM
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1916] border border-[#2a2520] text-[#7a6e62]">
                        RELEASE {t.trackNo} / 04
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f0ebe3]">
                      {t.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-[#a89880]">{project.tagline}</p>
                  </div>

                  {/* Architectural Scope */}
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest">
                      // ARCHITECTURAL SCOPE
                    </h4>
                    <p className="text-xs sm:text-sm text-[#a89880] leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>

                  {/* Deliverables & Impact */}
                  <div className="space-y-2 pt-1">
                    <h4 className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest">
                      // KEY DELIVERABLES & SYSTEM IMPACT
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {project.deliverables.map((deliv, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-[#1c1916]/90 border border-[#26211c] text-xs text-[#f0ebe3] shadow-sm transition-all group-hover:translate-x-1"
                        >
                          <span
                            className="font-mono font-bold shrink-0 mt-0.5 text-xs"
                            style={{ color: t.artAccent }}
                          >
                            0{dIdx + 1}
                          </span>
                          <span className="leading-relaxed text-[#dcd5cc] text-xs">{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Tech Stack & Action Links */}
                <div className="relative z-10 pt-4 border-t border-[#24201a] flex flex-wrap items-center justify-between gap-3 mt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#181512] border border-[#26211c] text-[#a89880]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {"liveUrl" in project && project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-black text-xs font-mono font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
                        style={{ background: t.artAccent }}
                      >
                        <span>LIVE APP</span>
                        <ArrowUpRight size={12} weight="bold" />
                      </a>
                    )}

                    {"githubUrl" in project && project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold hover:bg-white/10 transition-all active:scale-95"
                        style={{
                          borderColor: t.artAccent,
                          color: t.artAccent,
                        }}
                      >
                        <span>REPO</span>
                        <ArrowUpRight size={12} weight="bold" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
