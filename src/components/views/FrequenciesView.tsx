import React from "react";
import { SKILLS } from "../../data/tracks";
import type { Track } from "../../data/tracks";

interface FrequenciesViewProps { track: Track; }

export const FrequenciesView: React.FC<FrequenciesViewProps> = ({ track }) => (
  <div style={{ minHeight: "100%", paddingTop: 40, paddingBottom: 40 }}>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          {track.trackNo} / STUDIO SETUP
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: "#f0ebe3", marginBottom: 4 }}>
          {track.title}
        </h1>
        <p style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color: "#5c5248" }}>
          {track.artist} - {track.album}
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16, marginBottom: 32 }}>
        {SKILLS.map((cat, i) => (
          <div key={i} style={{ background: "#1c1916", border: "1px solid #332d26", borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 20, color: track.artAccent }}>{cat.icon}</span>
              <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#a89880", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {cat.category}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cat.items.map((skill, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    height: 3, borderRadius: 999, flex: 1,
                    background: `linear-gradient(90deg, ${track.artAccent}40, ${track.artAccent})`,
                    width: `${62 + (j * 13 + i * 9) % 33}%`,
                    maxWidth: "100%",
                  }} />
                  <span style={{ fontSize: 12, color: "#a89880", flexShrink: 0 }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Signal chain */}
      <div style={{ background: "#1c1916", border: "1px solid #332d26", borderRadius: 14, padding: 24 }}>
        <p style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
          ENGINEERING SIGNAL CHAIN
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "Space Mono, monospace", color: "#a89880" }}>
          {["Clean Architecture", "→", "N+1 Elimination", "→", "Structured Logging", "→", "Automated Quality Pipelines", "→", "Production Reliability"].map((s, i) => (
            <span key={i} style={{ color: s === "→" ? track.artAccent : undefined }}>{s}</span>
          ))}
        </div>
      </div>

    </div>
  </div>
);
