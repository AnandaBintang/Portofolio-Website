import React, { useEffect, useState } from "react";
import { PLAYABLE_TRACKS, type Track } from "../data/tracks";
import { audio } from "../lib/audioEngine";
import { Waveform } from "./Waveform";
import { Cassette } from "./Cassette";

interface PlayerBarProps {
  currentTrack: Track;
  scrollProgress: number; // Continuous 0 to 100%
  onPrevSection: () => void;
  onNextSection: () => void;
  onTrackSelect: (idx: number) => void;
  currentTrackIdx: number;
}

const IconPrev = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
);
const IconNext = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zm2.5-6l6-4.33v8.67L8.5 12zM16 6h2v12h-2z" />
  </svg>
);
const IconPlay = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  </svg>
);

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrack,
  scrollProgress,
  onPrevSection,
  onNextSection,
  onTrackSelect,
  currentTrackIdx,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Sync playing state from audio engine
  useEffect(() => {
    return audio.onStateChange(setIsPlaying);
  }, []);

  const handlePlayPause = () => {
    audio.sfx("click");
    audio.toggle();
  };

  const clampedProgress = Math.min(100, Math.max(0, scrollProgress));

  return (
    <>
      {/* Playlist Drawer */}
      {showPlaylist && (
        <div
          className="fixed bottom-[96px] right-4 sm:right-8 w-80 bg-[#141210] border border-[#332d26] rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{ backdropFilter: "blur(24px)" }}
        >
          <div className="px-5 py-4 border-b border-[#332d26] flex items-center justify-between">
            <span className="text-xs font-mono text-[#a89880] uppercase tracking-widest font-bold">
              FEATURED PROJECTS (4)
            </span>
            <button
              onClick={() => setShowPlaylist(false)}
              className="text-[#5c5248] hover:text-[#f0ebe3] transition-colors text-lg leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto scrollable p-2 space-y-1">
            {PLAYABLE_TRACKS.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  audio.sfx("click");
                  onTrackSelect(idx);
                  setShowPlaylist(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                  idx === currentTrackIdx
                    ? "bg-[#242018] text-[#e8a045] border border-[#4a4035]"
                    : "text-[#a89880] hover:bg-[#1c1916] hover:text-[#f0ebe3]"
                }`}
              >
                <span className="text-xs font-mono w-5 shrink-0 opacity-60">{track.trackNo}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate text-[#f0ebe3]">{track.title}</p>
                  <p className="text-xs text-[#5c5248] truncate">{track.subtitle}</p>
                </div>
                {idx === currentTrackIdx && isPlaying && (
                  <span className="shrink-0 w-2 h-2 rounded-full bg-[#1db954] pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Player Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#332d26]"
        style={{
          height: "88px",
          background: "rgba(15,13,11,0.95)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Realtime Smooth Continuous Scroll Progress Trackline */}
        <div className="w-full h-1 bg-[#242018] relative overflow-hidden">
          <div
            className="h-full origin-left will-change-transform"
            style={{
              transform: `scaleX(${clampedProgress / 100})`,
              transformOrigin: "left",
              background: `linear-gradient(90deg, ${currentTrack.artAccent}, #1db954)`,
              transition: "transform 0.08s linear",
            }}
          />
        </div>

        <div className="max-w-[1400px] mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Cassette Graphic & Current Track Metadata */}
          <div className="flex items-center gap-3.5 w-0 flex-1 min-w-0 lg:w-72 lg:flex-none">
            <div className="shrink-0 hidden sm:block">
              <Cassette isPlaying={isPlaying} accentColor={currentTrack.artAccent} size={54} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate text-[#f0ebe3] leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-xs text-[#a89880] truncate mt-0.5">{currentTrack.subtitle}</p>
              <p className="text-[10px] font-mono text-[#5c5248] truncate">{currentTrack.storyChapter} · {currentTrack.period}</p>
            </div>
          </div>

          {/* Center: Playhead Controls (Previous Section / Play / Next Section) */}
          <div className="flex flex-col items-center gap-1.5 flex-1 max-w-md">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#5c5248]">
              <span className="bg-[#1c1916] px-2 py-0.5 rounded border border-[#332d26] text-[#e8a045]">
                {Math.round(clampedProgress)}% SCROLL
              </span>
              <span>{currentTrack.role}</span>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={onPrevSection}
                className="text-[#a89880] hover:text-[#f0ebe3] active:scale-90 transition-all cursor-pointer p-1.5 rounded-full hover:bg-[#1c1916]"
                title="Previous Section"
              >
                <IconPrev />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-lg"
                style={{
                  background: isPlaying
                    ? "radial-gradient(circle, #1db954 0%, #17a847 100%)"
                    : `radial-gradient(circle, ${currentTrack.artAccent} 0%, #b8752f 100%)`,
                  boxShadow: isPlaying
                    ? "0 0 20px rgba(29,185,84,0.4)"
                    : `0 0 20px ${currentTrack.artAccent}40`,
                }}
                title={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
              >
                <span className="text-black">
                  {isPlaying ? <IconPause /> : <IconPlay />}
                </span>
              </button>

              <button
                onClick={onNextSection}
                className="text-[#a89880] hover:text-[#f0ebe3] active:scale-90 transition-all cursor-pointer p-1.5 rounded-full hover:bg-[#1c1916]"
                title="Next Section"
              >
                <IconNext />
              </button>
            </div>
          </div>

          {/* Right: Realtime Mini Waveform & Playlist Toggle */}
          <div className="flex items-center gap-3.5 w-0 flex-1 min-w-0 lg:w-72 lg:flex-none justify-end">
            <div className="hidden md:block w-36 h-8 opacity-80">
              <Waveform isPlaying={isPlaying} barCount={22} height={32} accent={currentTrack.artAccent} />
            </div>

            <button
              onClick={() => {
                audio.sfx("click");
                setShowPlaylist((p) => !p);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                showPlaylist
                  ? "bg-[#242018] border-[#e8a045] text-[#e8a045]"
                  : "bg-[#141210] border-[#332d26] text-[#5c5248] hover:text-[#a89880] hover:border-[#4a4035]"
              }`}
              title="Open Project List"
            >
              <IconList />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
