import React from "react";
import { PROFILE, TRACKS, type Track } from "../../data/tracks";
import { AlbumArt } from "../AlbumArt";

interface HomeViewProps {
  currentTrack: Track;
  isPlaying: boolean;
  onNavigate: (idx: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ currentTrack, isPlaying, onNavigate }) => {
  const homeTrack = TRACKS[0];

  return (
    <div style={{ minHeight: "100%", paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Artist Hero ── */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 32, marginBottom: 48, flexWrap: "wrap" }}>
          <AlbumArt track={homeTrack} size={200} spinning={isPlaying} />

          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
              ARTIST PROFILE
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#f0ebe3", lineHeight: 1.05, marginBottom: 6 }}>
              {PROFILE.callsign}
            </h1>
            <p style={{ fontSize: 18, color: homeTrack.artAccent, fontWeight: 600, marginBottom: 4 }}>
              {PROFILE.role}
            </p>
            <p style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color: "#5c5248", marginBottom: 20 }}>
              {PROFILE.location}
            </p>
            <p style={{ fontSize: 14, color: "#a89880", lineHeight: 1.7, maxWidth: 420, marginBottom: 24 }}>
              {PROFILE.bio}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a href={`mailto:${PROFILE.email}`}
                style={{ padding: "8px 20px", borderRadius: 999, background: homeTrack.artAccent, color: "#000", fontSize: 12, fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em" }}>
                CONTACT ME
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer"
                style={{ padding: "8px 20px", borderRadius: 999, border: "1px solid #4a4035", color: "#a89880", fontSize: 12, fontFamily: "Space Mono, monospace", textDecoration: "none" }}>
                GITHUB
              </a>
              <span style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid #332d26", color: "#5c5248", fontSize: 11, fontFamily: "Space Mono, monospace" }}>
                {PROFILE.education.school}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 48 }}>
          {[
            { label: "Current Station", value: "Weekend Inc." },
            { label: "Client", value: "PT HM Sampoerna" },
            { label: "Core Stack", value: "Laravel / Node.js" },
            { label: "Architecture", value: "Microservices" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#1c1916", border: "1px solid #332d26", borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#f0ebe3" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Discography ── */}
        <div>
          <p style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#5c5248", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
            DISCOGRAPHY
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TRACKS.filter((t: Track) => t.id !== "home").map((track: Track, idx: number) => (
              <button
                key={track.id}
                onClick={() => onNavigate(idx + 1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 12,
                  borderRadius: 10,
                  border: `1px solid ${currentTrack.id === track.id ? "#4a4035" : "#332d26"}`,
                  background: currentTrack.id === track.id ? "#2a2520" : "#1c1916",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  width: "100%",
                }}
              >
                <AlbumArt track={track} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#f0ebe3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
                    {track.title}
                  </p>
                  <p style={{ fontSize: 11, color: "#5c5248", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {track.artist} - {track.album}
                  </p>
                </div>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#5c5248" }}>{track.genre}</span>
                  <span style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color: "#5c5248" }}>{track.duration}</span>
                  {currentTrack.id === track.id && isPlaying && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1db954", display: "inline-block" }} className="pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
