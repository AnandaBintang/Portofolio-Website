import React, { useEffect, useState, useRef } from "react";
import { type Track } from "../data/tracks";
import { audio } from "../lib/audioEngine";
import { Waveform } from "./Waveform";
import { Cassette } from "./Cassette";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";

interface SectionMeta {
  id: string;
  navLabel: string;
  mobileShort: string;
  chapterNumber: string;
  name: string;
  subtitle: string;
  accent: string;
}

interface PlayerBarProps {
  currentTrack: Track;
  activeSection: SectionMeta;
  activeSectionIdx: number;
  scrollProgress: number;
  onPrevSection: () => void;
  onNextSection: () => void;
  onSeekProgress?: (progressPercent: number) => void;
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

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrack,
  activeSection,
  activeSectionIdx,
  scrollProgress,
  onPrevSection,
  onNextSection,
  onSeekProgress,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const tracklineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return audio.onStateChange(setIsPlaying);
  }, []);

  const handlePlayPause = () => {
    audio.sfx("click");
    audio.toggle();
  };

  const handleToggleMute = () => {
    audio.sfx("click");
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleTracklineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tracklineRef.current || !onSeekProgress) return;
    const rect = tracklineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
    onSeekProgress(percent);
  };

  const clampedProgress = Math.min(100, Math.max(0, scrollProgress));

  // Convert scroll percentage to aesthetic player timecode (e.g. 0:00 to 3:45)
  const totalSeconds = 225; // 3:45 total duration
  const currentSeconds = Math.round((clampedProgress / 100) * totalSeconds);
  const curMin = Math.floor(currentSeconds / 60);
  const curSec = (currentSeconds % 60).toString().padStart(2, "0");
  const totMin = Math.floor(totalSeconds / 60);
  const totSec = (totalSeconds % 60).toString().padStart(2, "0");

  // Dynamic Metadata: Displays section info when in Section 0, 2, 3 and current project track when in Section 1 (Projects)
  const displayTitle =
    activeSectionIdx === 1
      ? currentTrack.title
      : activeSection.name;

  const displaySubtitle =
    activeSectionIdx === 1
      ? currentTrack.subtitle
      : activeSection.subtitle.replace("// ", "");

  const displayMeta =
    activeSectionIdx === 1
      ? `${currentTrack.storyChapter} · ${currentTrack.period}`
      : `SECTION ${activeSection.chapterNumber} / 03 · 2026`;

  const activeAccent =
    activeSectionIdx === 1 ? currentTrack.artAccent : activeSection.accent;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#332d26]"
      style={{
        height: "90px",
        background: "rgba(15,13,11,0.95)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div className="max-w-[1400px] mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Cassette Graphic & Dynamic Section / Track Metadata */}
        <div className="flex items-center gap-3.5 w-0 flex-1 min-w-0 lg:w-72 lg:flex-none">
          <div className="shrink-0 hidden sm:block">
            <Cassette isPlaying={isPlaying} accentColor={activeAccent} size={50} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate text-[#f0ebe3] leading-tight">
              {displayTitle}
            </p>
            <p className="text-xs text-[#a89880] truncate mt-0.5">{displaySubtitle}</p>
            <p className="text-[10px] font-mono text-[#5c5248] truncate">{displayMeta}</p>
          </div>
        </div>

        {/* Center: Interactive Scrubber Trackline & Playhead Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-lg">
          
          {/* Controls: Prev / Play / Next */}
          <div className="flex items-center gap-6">
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
                  : `radial-gradient(circle, ${activeAccent} 0%, #b8752f 100%)`,
                boxShadow: isPlaying
                  ? "0 0 20px rgba(29,185,84,0.4)"
                  : `0 0 20px ${activeAccent}40`,
              }}
              title={isPlaying ? "Pause audio & auto-scroll" : "Play ambient audio & auto-scroll"}
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

          {/* Authentic Music Player Scrub Trackline Bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#5c5248] w-8 text-right select-none">
              {curMin}:{curSec}
            </span>

            {/* Clickable / Draggable Trackline */}
            <div
              ref={tracklineRef}
              onClick={handleTracklineClick}
              className="flex-1 h-3 flex items-center cursor-pointer group py-1"
              title="Click to seek page position"
            >
              <div className="w-full h-1.5 bg-[#242018] group-hover:h-2 rounded-full relative overflow-hidden transition-all border border-[#332d26]/60">
                {/* Active Playhead Fill */}
                <div
                  className="h-full rounded-full will-change-transform"
                  style={{
                    width: `${clampedProgress}%`,
                    background: isPlaying
                      ? `linear-gradient(90deg, ${activeAccent}, #1db954)`
                      : activeAccent,
                  }}
                />
              </div>

              {/* Scrubber Knob Indicator */}
              <div
                className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity -ml-2 pointer-events-none z-10"
                style={{
                  transform: `translateX(${clampedProgress}%)`,
                }}
              />
            </div>

            <span className="text-[10px] font-mono text-[#5c5248] w-8 select-none">
              {totMin}:{totSec}
            </span>
          </div>

        </div>

        {/* Right: Realtime Mini Waveform & Sound Mute Toggle */}
        <div className="flex items-center gap-3.5 w-0 flex-1 min-w-0 lg:w-72 lg:flex-none justify-end">
          <div className="hidden md:block w-36 h-8 opacity-80">
            <Waveform isPlaying={isPlaying && !isMuted} barCount={22} height={32} accent={activeAccent} />
          </div>

          {/* Mute / Unmute Sound Toggle Button */}
          <button
            onClick={handleToggleMute}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isMuted
                ? "bg-[#242018] border-[#e8a045] text-[#e8a045]"
                : "bg-[#141210] border-[#332d26] text-[#a89880] hover:text-[#f0ebe3] hover:border-[#4a4035]"
            }`}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? (
              <SpeakerSlash size={18} weight="bold" />
            ) : (
              <SpeakerHigh size={18} weight="bold" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
