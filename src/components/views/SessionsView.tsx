import React from "react";
import { SESSIONS, PROFILE, type Track } from "../../data/tracks";

interface SessionsViewProps {
  track: Track;
}

export const SessionsView: React.FC<SessionsViewProps> = ({ track }) => {
  return (
    <div style={{ minHeight: "100%", paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
            {track.trackNo} / LOGBOOK
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: "#f0ebe3", marginBottom: 4 }}>
            {track.title}
          </h1>
          <p style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color: "#5c5248" }}>
            {track.artist} - {track.album}
          </p>
        </div>

        {/* ── Timeline Sessions ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {SESSIONS.map((session, i) => (
            <div
              key={i}
              style={{
                background: "#1c1916",
                border: `1px solid ${session.active ? "#4a4035" : "#332d26"}`,
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "Space Mono, monospace",
                      padding: "3px 10px",
                      borderRadius: 6,
                      border: `1px solid ${track.artAccent}40`,
                      background: `${track.artAccent}10`,
                      color: track.artAccent,
                    }}
                  >
                    REC {session.no}
                  </span>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0ebe3", marginBottom: 2 }}>
                      {session.role}
                    </h3>
                    <p style={{ fontSize: 13, color: "#a89880" }}>
                      {session.company}
                      {session.client && <span style={{ color: "#5c5248" }}> for {session.client}</span>}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#5c5248" }}>{session.period}</p>
                  <p style={{ fontSize: 12, color: "#5c5248" }}>{session.location}</p>
                </div>
              </div>

              {session.active && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1db954" }} className="pulse" />
                  <span style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#1db954", fontWeight: 700 }}>
                    CURRENTLY ACTIVE
                  </span>
                </div>
              )}

              <ul style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {session.highlights.map((h, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#a89880", lineHeight: 1.6 }}>
                    <span style={{ color: track.artAccent, flexShrink: 0 }}>•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 16, borderTop: "1px solid #332d26" }}>
                {session.tags.map((tag, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 10,
                      fontFamily: "Space Mono, monospace",
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: "#242018",
                      border: "1px solid #332d26",
                      color: "#a89880",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Education Foundation ── */}
        <div style={{ background: "#1c1916", border: "1px solid #332d26", borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
            ACADEMIC FOUNDATION
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#f0ebe3" }}>{PROFILE.education.school}</p>
              <p style={{ fontSize: 13, color: "#a89880", marginTop: 2 }}>{PROFILE.education.degree}</p>
              <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#5c5248", marginTop: 4 }}>{PROFILE.education.period}</p>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#f0ebe3" }}>SMKS Antartika 2</p>
              <p style={{ fontSize: 13, color: "#a89880", marginTop: 2 }}>Software Engineering</p>
              <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#5c5248", marginTop: 4 }}>Aug 2020 - Jun 2023</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
