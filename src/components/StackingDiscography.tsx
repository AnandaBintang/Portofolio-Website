import React, { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PLAYABLE_TRACKS, PROJECTS, type Track } from "../data/tracks";

interface StackingDiscographyProps {
  activeTrackIdx: number;
  currentTrack: Track;
  isPlaying: boolean;
  onTrackInView?: (idx: number) => void;
}

export const StackingDiscography: React.FC<StackingDiscographyProps> = ({
  activeTrackIdx,
  isPlaying,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="space-y-10 sm:space-y-14 animate-[fadeIn_0.5s_ease-out] relative"
    >
      <div className="space-y-3 pb-6 border-b border-[#2a2520] relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#4a9eff]">
          <span className="w-2 h-2 rounded-full bg-[#4a9eff] animate-pulse" />
          <span>PROJECTS · FEATURED WORK</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f0ebe3]">
          SELECTED PROJECTS.
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#a89880] max-w-xl font-mono leading-relaxed">
          Scroll down naturally to explore each project.
        </p>
      </div>

      <div className="space-y-16 sm:space-y-24 pb-20 relative">
        {PLAYABLE_TRACKS.map((t, idx) => {
          const project = PROJECTS[t.id];
          const isActive = idx === activeTrackIdx;
          const stickyTopOffset = 88 + idx * 16;

          return (
            <div
              key={t.id}
              data-project-index={idx}
              className="project-parallax-card sticky transition-all duration-500 will-change-transform"
              style={{
                top: `${stickyTopOffset}px`,
                zIndex: idx + 1,
              }}
            >
              <div
                className={`relative rounded-3xl p-6 sm:p-10 border transition-all duration-500 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] group ${
                  isActive
                    ? "bg-[#141210] border-[#4a4035]"
                    : "bg-[#110f0d] border-[#2a2520] hover:border-[#3a332a]"
                }`}
                style={{
                  perspective: "1200px",
                }}
              >
                <div
                  className={`absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#12100e] border-4 border-[#24201a] shadow-2xl flex items-center justify-center pointer-events-none transition-transform duration-700 opacity-60 group-hover:opacity-100 group-hover:translate-x-4 ${
                    isPlaying && isActive ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "6s" }}
                >
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#3a332a]" />
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center p-1"
                    style={{
                      background: `radial-gradient(circle, ${t.artAccent} 0%, #1c1916 100%)`,
                      borderColor: t.artAccent,
                    }}
                  >
                    <span className="text-[7px] font-mono font-bold text-black uppercase">
                      {t.trackNo}
                    </span>
                  </div>
                </div>

                <div
                  className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none opacity-20 blur-3xl"
                  style={{ background: t.artAccent }}
                />

                <div className="absolute top-2 right-6 pointer-events-none z-0 select-none overflow-hidden">
                  <span
                    className="text-[100px] sm:text-[160px] font-bold tracking-tighter font-mono leading-none block opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                    style={{ color: t.artAccent }}
                  >
                    {t.trackNo}
                  </span>
                </div>

                <div className="relative z-10 space-y-6 max-w-2xl">
                  <div className="space-y-1.5 border-b border-[#24201a] pb-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2"
                        style={{ color: t.artAccent }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.artAccent }} />
                        {t.storyChapter} · {t.period}
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#1c1916] border border-[#2a2520] text-[#7a6e62]">
                        {t.role}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#f0ebe3]">
                      {t.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-[#a89880]">{project.tagline}</p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[10px] sm:text-[11px] font-mono text-[#5c5248] uppercase tracking-wider">
                      OVERVIEW
                    </h4>
                    <p className="text-xs sm:text-sm text-[#a89880] leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <h4 className="text-[10px] sm:text-[11px] font-mono text-[#5c5248] uppercase tracking-wider">
                      KEY DELIVERABLES
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {project.deliverables.map((deliv, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-[#1c1916]/90 border border-[#26211c] hover:border-[#383028] text-xs sm:text-sm text-[#f0ebe3] shadow-md transition-all group-hover:translate-x-1"
                        >
                          <span
                            className="font-mono font-bold shrink-0 mt-0.5 text-xs"
                            style={{ color: t.artAccent }}
                          >
                            0{dIdx + 1}
                          </span>
                          <span className="leading-relaxed text-[#dcd5cc] text-xs sm:text-sm">{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#24201a] flex flex-wrap items-center justify-between gap-4">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
