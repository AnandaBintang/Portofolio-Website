import React from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PLAYABLE_TRACKS, PROJECTS, type Track } from "../data/tracks";
import { StickyAudioDeck } from "./StickyAudioDeck";

interface ParallaxDiscographyProps {
  activeTrackIdx: number;
  currentTrack: Track;
  isPlaying: boolean;
  onTrackInView?: (idx: number) => void;
}

export const ParallaxDiscography: React.FC<ParallaxDiscographyProps> = ({
  activeTrackIdx,
  currentTrack,
  isPlaying,
}) => {
  return (
    <div className="space-y-12 md:space-y-16 animate-[fadeIn_0.5s_ease-out]">
      {/* ── Section Header ── */}
      <div className="space-y-3 pb-6 border-b border-[#2a2520]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#4a9eff]">
          <span className="w-2 h-2 rounded-full bg-[#4a9eff] animate-pulse" />
          <span>PROJECTS · FEATURED WORK</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
          SELECTED PROJECTS.
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#a89880] max-w-xl font-mono leading-relaxed">
          Explore key backend systems, enterprise retail platforms, and fullstack applications.
        </p>
      </div>

      {/* ── Two Column Composition: Pinned Turntable Deck + Multi-Layer Parallax Track Stream ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        
        {/* Left Column: Sticky Turntable Deck */}
        <div className="lg:col-span-5 hidden lg:block sticky top-6 z-20">
          <StickyAudioDeck
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            activeSectionIdx={activeTrackIdx}
          />
        </div>

        {/* Right Column: 4 Vertically Scrollable Parallax Project Cards */}
        <div className="lg:col-span-7 space-y-14 sm:space-y-20">
          {PLAYABLE_TRACKS.map((t, idx) => {
            const project = PROJECTS[t.id];
            const isActive = idx === activeTrackIdx;

            return (
              <div
                key={t.id}
                data-project-index={idx}
                className={`project-parallax-card relative rounded-3xl p-6 sm:p-8 border transition-all duration-700 overflow-hidden group shadow-2xl ${
                  isActive
                    ? "bg-[#141210] border-[#4a4035] shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
                    : "bg-[#110f0d]/90 border-[#26211c] hover:border-[#383028]"
                }`}
              >
                {/* Background Watermark Track Number */}
                <div className="absolute top-2 right-4 pointer-events-none z-0 select-none overflow-hidden">
                  <span
                    className="text-[100px] sm:text-[140px] font-bold tracking-tighter font-mono leading-none block opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                    style={{ color: t.artAccent }}
                  >
                    {t.trackNo}
                  </span>
                </div>

                {/* Subtle Ambient Glow */}
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl transition-opacity duration-500"
                  style={{ background: t.artAccent }}
                />

                {/* Content Core */}
                <div className="relative z-10 space-y-5">
                  
                  {/* Track Meta Header */}
                  <div className="space-y-1.5 border-b border-[#24201a] pb-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2"
                        style={{ color: t.artAccent }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.artAccent }} />
                        {t.storyChapter} · {t.period}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1916] border border-[#2a2520] text-[#7a6e62]">
                        {t.role}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f0ebe3]">
                      {t.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-[#a89880]">{project.tagline}</p>
                  </div>

                  {/* Overview */}
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-mono text-[#5c5248] uppercase tracking-wider">
                      OVERVIEW
                    </h4>
                    <p className="text-xs sm:text-sm text-[#a89880] leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-2 pt-1">
                    <h4 className="text-[10px] font-mono text-[#5c5248] uppercase tracking-wider">
                      KEY DELIVERABLES
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

                  {/* Tech Stack Pills & Action Links */}
                  <div className="pt-4 border-t border-[#24201a] flex flex-wrap items-center justify-between gap-3 mt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#181512] border border-[#26211c] text-[#a89880]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {"liveUrl" in project && project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-black text-xs font-mono font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
                          style={{ background: t.artAccent }}
                        >
                          <span>LIVE APP</span>
                          <ArrowUpRight size={13} weight="bold" />
                        </a>
                      )}

                      {"githubUrl" in project && project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-mono font-bold hover:bg-white/10 transition-all active:scale-95"
                          style={{
                            borderColor: t.artAccent,
                            color: t.artAccent,
                          }}
                        >
                          <span>SOURCE REPO</span>
                          <ArrowUpRight size={13} weight="bold" />
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
    </div>
  );
};
