import React from "react";
import { PROJECTS } from "../../data/tracks";
import { AlbumArt } from "../AlbumArt";
import type { Track } from "../../data/tracks";

interface ProjectViewProps {
  track: Track;
  isPlaying: boolean;
}

type ProjectKey = keyof typeof PROJECTS;

export const ProjectView: React.FC<ProjectViewProps> = ({ track, isPlaying }) => {
  const project = PROJECTS[track.id as ProjectKey];
  if (!project) return null;

  return (
    <div className="w-full h-full scrollable">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <AlbumArt track={track} size={160} spinning={isPlaying} className="shrink-0 mx-auto md:mx-0 shadow-2xl" />
          <div className="flex-1 flex flex-col justify-end">
            <p className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest mb-1">{track.trackNo} / PROJECT</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#f0ebe3] leading-tight mb-1">
              {track.title}
            </h1>
            <p className="text-base font-medium mb-0.5" style={{ color: track.artAccent }}>
              {track.artist}
            </p>
            <p className="text-sm text-[#5c5248] font-mono mb-4">{track.album}</p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full border border-[#332d26] text-[#a89880]">
                {track.genre}
              </span>
              {("scale" in project) && (
                <span className="text-xs font-mono px-3 py-1 rounded-full border border-[#332d26] text-[#a89880]">
                  {(project as { scale: string }).scale}
                </span>
              )}
            </div>

            {/* External links */}
            <div className="flex gap-3 mt-4">
              {("liveUrl" in project) && (project as { liveUrl?: string }).liveUrl && (
                <a
                  href={(project as { liveUrl: string }).liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full text-xs font-bold text-black active:scale-95 transition-all"
                  style={{ background: track.artAccent }}
                >
                  LIVE DEMO
                </a>
              )}
              {("githubUrl" in project) && (project as { githubUrl?: string }).githubUrl && (
                <a
                  href={(project as { githubUrl: string }).githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border text-xs font-mono text-[#a89880] hover:text-[#f0ebe3] transition-all"
                  style={{ borderColor: track.artAccent + "50" }}
                >
                  SOURCE CODE
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#332d26] mb-8" />

        {/* Description */}
        <div className="mb-8">
          <p className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest mb-3">ARCHITECTURAL OVERVIEW</p>
          <p className="text-sm sm:text-base text-[#a89880] leading-relaxed">{project.description}</p>
        </div>

        {/* Two columns: deliverables + stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deliverables */}
          <div className="bg-[#1c1916] border border-[#332d26] rounded-xl p-5">
            <p className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest mb-4">ENGINEERING DELIVERABLES</p>
            <ul className="space-y-3">
              {project.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#a89880]">
                  <span className="font-mono mt-0.5 shrink-0" style={{ color: track.artAccent }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="bg-[#1c1916] border border-[#332d26] rounded-xl p-5">
            <p className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest mb-4">STACK FREQUENCIES</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border text-[#f0ebe3]"
                  style={{
                    borderColor: track.artAccent + "40",
                    background: track.artAccent + "10",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Fake VU bars */}
            <div className="mt-5 space-y-2">
              {project.stack.slice(0, 4).map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#5c5248] w-20 shrink-0 truncate">{tech}</span>
                  <div className="flex-1 h-1.5 bg-[#242018] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${75 + (i * 7) % 20}%`,
                        background: `linear-gradient(90deg, ${track.artAccent}80, ${track.artAccent})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
