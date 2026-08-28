import React from "react";
import { PROFILE, TRACKS } from "../../data/tracks";
import { AlbumArt } from "../AlbumArt";
import type { Track } from "../../data/tracks";

interface HomeViewProps {
  currentTrack: Track;
  isPlaying: boolean;
  onNavigate: (idx: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ currentTrack, isPlaying, onNavigate }) => {
  const homeTrack = TRACKS[0];

  return (
    <div className="w-full h-full scrollable">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12">

        {/* Artist hero block */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          <AlbumArt track={homeTrack} size={180} spinning={isPlaying} className="shadow-2xl" />

          <div className="text-center md:text-left">
            <p className="text-xs font-mono text-[#5c5248] uppercase tracking-widest mb-2">ARTIST PROFILE</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#f0ebe3] leading-tight">
              {PROFILE.callsign}
            </h1>
            <p className="text-lg text-[#e8a045] font-medium mt-1">{PROFILE.role}</p>
            <p className="text-sm text-[#a89880] mt-1 font-mono">{PROFILE.location}</p>

            <p className="text-sm text-[#a89880] leading-relaxed mt-4 max-w-md">
              {PROFILE.bio}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5 justify-center md:justify-start">
              <a
                href={`mailto:${PROFILE.email}`}
                className="px-4 py-2 rounded-full bg-[#e8a045] text-black text-xs font-bold hover:bg-[#f0b055] active:scale-95 transition-all"
              >
                CONTACT ME
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-[#4a4035] text-[#a89880] text-xs font-mono hover:border-[#e8a045] hover:text-[#e8a045] active:scale-95 transition-all"
              >
                GITHUB
              </a>
              <span className="text-xs font-mono text-[#5c5248] px-3 py-2 border border-[#332d26] rounded-full">
                {PROFILE.education.school}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Current Station", value: "Weekend Inc." },
            { label: "Client", value: "PT HM Sampoerna" },
            { label: "Core Stack", value: "Laravel / Node.js" },
            { label: "Architecture", value: "Microservices" },
          ].map((s, i) => (
            <div key={i} className="bg-[#1c1916] border border-[#332d26] rounded-xl p-4">
              <p className="text-[10px] font-mono text-[#5c5248] uppercase mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-[#f0ebe3]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Playlist preview */}
        <div>
          <p className="text-xs font-mono text-[#5c5248] uppercase tracking-widest mb-4">DISCOGRAPHY</p>
          <div className="space-y-2">
            {TRACKS.filter((t: Track) => t.id !== "home").map((track: Track, idx: number) => (
              <button
                key={track.id}
                onClick={() => onNavigate(idx + 1)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg border text-left transition-all cursor-pointer group ${
                  currentTrack.id === track.id
                    ? "bg-[#2a2520] border-[#4a4035]"
                    : "bg-[#1c1916] border-[#332d26] hover:bg-[#242018] hover:border-[#4a4035]"
                }`}
              >
                <AlbumArt track={track} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#f0ebe3] truncate group-hover:text-[#e8a045] transition-colors">
                    {track.title}
                  </p>
                  <p className="text-xs text-[#5c5248] truncate">{track.artist} - {track.album}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono text-[#5c5248] hidden sm:inline">{track.genre}</span>
                  <span className="text-xs font-mono text-[#5c5248]">{track.duration}</span>
                  {currentTrack.id === track.id && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-[#1db954] pulse" />
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
