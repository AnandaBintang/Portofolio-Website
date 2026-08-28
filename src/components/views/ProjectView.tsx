import React from "react";
import { PROJECTS } from "../../data/tracks";
import { AlbumArt } from "../AlbumArt";
import type { Track } from "../../data/tracks";

type ProjectKey = keyof typeof PROJECTS;

interface ProjectViewProps {
  track: Track;
  isPlaying: boolean;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ track, isPlaying }) => {
  const project = PROJECTS[track.id as ProjectKey];
  if (!project) return null;

  const p = project as {
    description: string;
    stack: string[];
    deliverables: string[];
    scale?: string;
    liveUrl?: string;
    githubUrl?: string;
  };

  return (
    <div style={{ minHeight: "100%", paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", gap: 32, marginBottom: 40, flexWrap: "wrap", alignItems: "flex-end" }}>
          <AlbumArt track={track} size={160} spinning={isPlaying} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#5c5248", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              {track.trackNo} / PROJECT
            </p>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, color: "#f0ebe3", lineHeight: 1.1, marginBottom: 6 }}>
              {track.title}
            </h1>
            <p style={{ fontSize: 16, color: track.artAccent, fontWeight: 600, marginBottom: 4 }}>
              {track.artist}
            </p>
            <p style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color: "#5c5248", marginBottom: 20 }}>
              {track.album}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 11, fontFamily: "Space Mono, monospace", padding: "4px 12px", borderRadius: 999, border: `1px solid ${track.artAccent}40`, color: track.artAccent }}>
                {track.genre}
              </span>
              {p.scale && (
                <span style={{ fontSize: 11, fontFamily: "Space Mono, monospace", padding: "4px 12px", borderRadius: 999, border: "1px solid #332d26", color: "#a89880" }}>
                  {p.scale}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "8px 20px", borderRadius: 999, background: track.artAccent, color: "#000", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  LIVE DEMO
                </a>
              )}
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "8px 20px", borderRadius: 999, border: `1px solid ${track.artAccent}50`, color: "#a89880", fontSize: 12, fontFamily: "Space Mono, monospace", textDecoration: "none" }}>
                  SOURCE CODE
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "#332d26", marginBottom: 32 }} />

        {/* ── Description ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
            ARCHITECTURAL OVERVIEW
          </p>
          <p style={{ fontSize: 15, color: "#a89880", lineHeight: 1.75 }}>{p.description}</p>
        </div>

        {/* ── Two column: deliverables + stack ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Deliverables */}
          <div style={{ background: "#1c1916", border: "1px solid #332d26", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>
              ENGINEERING DELIVERABLES
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {p.deliverables.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: track.artAccent, flexShrink: 0, marginTop: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 13, color: "#a89880", lineHeight: 1.6 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div style={{ background: "#1c1916", border: "1px solid #332d26", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>
              STACK FREQUENCIES
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {p.stack.map((tech, i) => (
                <span key={i} style={{
                  fontSize: 12, fontFamily: "Space Mono, monospace",
                  padding: "6px 14px", borderRadius: 8,
                  border: `1px solid ${track.artAccent}35`,
                  background: `${track.artAccent}0f`,
                  color: "#f0ebe3",
                }}>
                  {tech}
                </span>
              ))}
            </div>
            {/* VU bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {p.stack.slice(0, 4).map((tech, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#5c5248", width: 80, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tech}
                  </span>
                  <div style={{ flex: 1, height: 4, background: "#242018", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 999,
                      width: `${72 + (i * 9 + 7) % 22}%`,
                      background: `linear-gradient(90deg, ${track.artAccent}60, ${track.artAccent})`,
                    }} />
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
