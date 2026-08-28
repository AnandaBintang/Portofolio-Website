import React, { useEffect, useRef, useState } from "react";
import { TRACKS, type Track } from "../data/tracks";
import { audio } from "../lib/audioEngine";
import { Waveform } from "./Waveform";
import { Cassette } from "./Cassette";

interface PlayerBarProps {
  currentTrack: Track;
  onPrev: () => void;
  onNext: () => void;
  onTrackSelect: (idx: number) => void;
  currentIdx: number;
}

// Icons as simple SVG components (no library needed at this size)
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
  onPrev,
  onNext,
  onTrackSelect,
  currentIdx,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const progRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync playing state from audio engine
  useEffect(() => {
    return audio.onStateChange(setIsPlaying);
  }, []);

  // Simulate progress bar crawl while playing
  useEffect(() => {
    if (isPlaying) {
      progRef.current = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.15));
      }, 80);
    } else {
      if (progRef.current) clearInterval(progRef.current);
    }
    return () => { if (progRef.current) clearInterval(progRef.current); };
  }, [isPlaying]);

  // Reset progress on track change
  useEffect(() => { setProgress(0); }, [currentTrack.id]);

  const handlePlayPause = () => {
    audio.sfx("click");
    audio.toggle();
  };
  const handlePrev = () => { audio.sfx("prev"); onPrev(); };
  const handleNext = () => { audio.sfx("next"); onNext(); };

  return (
    <>
      {/* Playlist drawer */}
      {showPlaylist && (
        <div
          className="fixed bottom-[88px] right-4 w-72 bg-[#1c1916] border border-[#332d26] rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="px-4 py-3 border-b border-[#332d26] flex items-center justify-between">
            <span className="text-xs font-mono text-[#a89880] uppercase tracking-widest">Playlist</span>
            <button onClick={() => setShowPlaylist(false)} className="text-[#5c5248] hover:text-[#f0ebe3] transition-colors text-lg leading-none cursor-pointer">
              ×
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto scrollable py-2">
            {TRACKS.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => { audio.sfx("click"); onTrackSelect(idx); setShowPlaylist(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                  idx === currentIdx
                    ? "bg-[#2a2520] text-[#e8a045]"
                    : "text-[#a89880] hover:bg-[#242018] hover:text-[#f0ebe3]"
                }`}
              >
                <span className="text-xs font-mono w-6 shrink-0 opacity-50">{track.trackNo}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs opacity-60 truncate">{track.artist}</p>
                </div>
                {idx === currentIdx && isPlaying && (
                  <span className="ml-auto shrink-0 w-2 h-2 rounded-full bg-[#1db954] pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Player bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#332d26]"
        style={{
          height: "88px",
          background: "rgba(15,13,11,0.92)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Progress bar on very top of player */}
        <div className="w-full h-0.5 bg-[#332d26]">
          <div
            className="h-full transition-none"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #e8a045, #1db954)",
            }}
          />
        </div>

        <div className="max-w-screen-xl mx-auto h-full px-4 flex items-center gap-4">

          {/* Left: cassette + track info */}
          <div className="flex items-center gap-3 w-0 flex-1 min-w-0 lg:w-64 lg:flex-none">
            <div className="shrink-0 hidden sm:block">
              <Cassette isPlaying={isPlaying} accentColor={currentTrack.artAccent} size={56} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-[#f0ebe3] leading-tight">{currentTrack.title}</p>
              <p className="text-xs text-[#a89880] truncate mt-0.5">{currentTrack.artist}</p>
              <p className="text-[10px] font-mono text-[#5c5248] truncate">{currentTrack.album}</p>
            </div>
          </div>

          {/* Center: controls + waveform */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            {/* Track metadata mini pills */}
            <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-[#5c5248]">
              <span className="bg-[#242018] px-2 py-0.5 rounded border border-[#332d26]">{currentTrack.trackNo}</span>
              <span>{currentTrack.genre}</span>
              {currentTrack.bpm !== "—" && <><span>·</span><span>{currentTrack.bpm} BPM</span></>}
            </div>
            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="text-[#a89880] hover:text-[#f0ebe3] active:scale-90 transition-all cursor-pointer"
                title="Previous track"
              >
                <IconPrev />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                style={{
                  background: isPlaying
                    ? "radial-gradient(circle, #1db954 0%, #17a847 100%)"
                    : `radial-gradient(circle, ${currentTrack.artAccent} 0%, #b8752f 100%)`,
                  boxShadow: isPlaying
                    ? "0 0 20px rgba(29,185,84,0.4)"
                    : `0 0 20px ${currentTrack.artAccent}40`,
                }}
                title={isPlaying ? "Pause" : "Play lo-fi atmosphere"}
              >
                <span className="text-black">
                  {isPlaying ? <IconPause /> : <IconPlay />}
                </span>
              </button>

              <button
                onClick={handleNext}
                className="text-[#a89880] hover:text-[#f0ebe3] active:scale-90 transition-all cursor-pointer"
                title="Next track"
              >
                <IconNext />
              </button>
            </div>
          </div>

          {/* Right: waveform + playlist */}
          <div className="flex items-center gap-3 w-0 flex-1 min-w-0 lg:w-64 lg:flex-none justify-end">
            <div className="hidden md:block w-32 h-8 opacity-80">
              <Waveform isPlaying={isPlaying} barCount={20} height={32} accent={currentTrack.artAccent} />
            </div>

            <button
              onClick={() => { audio.sfx("click"); setShowPlaylist(p => !p); }}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                showPlaylist
                  ? "bg-[#2a2520] text-[#e8a045]"
                  : "text-[#5c5248] hover:text-[#a89880] hover:bg-[#242018]"
              }`}
              title="Playlist"
            >
              <IconList />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
