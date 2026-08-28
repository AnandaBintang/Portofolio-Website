import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TRACKS, type Track, type TrackId } from "./data/tracks";
import { PlayerBar } from "./components/PlayerBar";
import { HomeView } from "./components/views/HomeView";
import { ProjectView } from "./components/views/ProjectView";
import { FrequenciesView } from "./components/views/FrequenciesView";
import { SessionsView } from "./components/views/SessionsView";
import { audio } from "./lib/audioEngine";

// Which view to render per track id
function TrackView({ track, isPlaying, onNavigate }: {
  track: Track;
  isPlaying: boolean;
  onNavigate: (idx: number) => void;
}) {
  switch (track.id as TrackId) {
    case "home":
      return <HomeView currentTrack={track} isPlaying={isPlaying} onNavigate={onNavigate} />;
    case "ayo-kasir":
    case "ayo-qoncierge":
    case "moneymate":
    case "ecommerce":
      return <ProjectView track={track} isPlaying={isPlaying} />;
    case "frequencies":
      return <FrequenciesView track={track} />;
    case "sessions":
      return <SessionsView track={track} />;
    default:
      return <HomeView currentTrack={track} isPlaying={isPlaying} onNavigate={onNavigate} />;
  }
}

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayedIdx, setDisplayedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Two panels for crossfade swap
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  const activePanelRef = useRef<"A" | "B">("A");

  const currentTrack = TRACKS[currentIdx];
  const displayedTrack = TRACKS[displayedIdx];

  // Sync playing state from engine
  useEffect(() => audio.onStateChange(setIsPlaying), []);

  // GSAP full-screen crossfade transition
  const navigateTo = useCallback((nextIdx: number) => {
    if (nextIdx === currentIdx || isTransitioning) return;
    setIsTransitioning(true);

    const incoming = activePanelRef.current === "A" ? panelBRef.current : panelARef.current;
    const outgoing = activePanelRef.current === "A" ? panelARef.current : panelBRef.current;
    const dir = nextIdx > currentIdx ? 1 : -1;

    if (!incoming || !outgoing) return;

    // Pre-position incoming off-screen
    gsap.set(incoming, { x: dir * 60, opacity: 0, pointerEvents: "none", zIndex: 2 });
    gsap.set(outgoing, { x: 0, opacity: 1, zIndex: 1 });

    // Update displayed track for incoming panel
    setDisplayedIdx(nextIdx);

    // Small tick to allow React to render new content in incoming
    setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          activePanelRef.current = activePanelRef.current === "A" ? "B" : "A";
          gsap.set(outgoing, { opacity: 0, x: -dir * 60, pointerEvents: "none", zIndex: 1 });
          gsap.set(incoming, { pointerEvents: "auto", zIndex: 1 });
          setCurrentIdx(nextIdx);
          setIsTransitioning(false);
        },
      });

      tl.to(outgoing, { x: -dir * 60, opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
      tl.to(incoming, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 0.1);
    }, 20);
  }, [currentIdx, isTransitioning]);

  const handlePrev = useCallback(() => {
    navigateTo(currentIdx === 0 ? TRACKS.length - 1 : currentIdx - 1);
  }, [currentIdx, navigateTo]);

  const handleNext = useCallback(() => {
    navigateTo(currentIdx === TRACKS.length - 1 ? 0 : currentIdx + 1);
  }, [currentIdx, navigateTo]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "l") handleNext();
      if (e.key === "ArrowLeft"  || e.key === "j") handlePrev();
      if (e.key === " ") { e.preventDefault(); audio.toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev]);

  // Accent bg glow from current track
  const accentGlow = currentTrack.artAccent;

  // Panel A holds the initial view; B starts hidden
  useEffect(() => {
    if (panelBRef.current) gsap.set(panelBRef.current, { opacity: 0, pointerEvents: "none" });
  }, []);

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100dvh",
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${accentGlow}12 0%, #0f0d0b 60%)`,
        transition: "background 0.8s ease",
      }}
    >
      {/* Film grain */}
      <div className="grain" />

      {/* Top nav strip */}
      <nav className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#332d26] bg-[#0f0d0b]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          {/* Animated cassette icon in nav */}
          <svg width="22" height="14" viewBox="0 0 100 62" fill="none">
            <rect x="2" y="2" width="96" height="58" rx="5" fill="#1c1916" stroke="#4a4035" strokeWidth="2" />
            <circle cx="26" cy="31" r="12" fill="#1a1714" stroke="#4a4035" strokeWidth="1" />
            <circle cx="26" cy="31" r="7" fill="none" stroke={accentGlow} strokeWidth="2" strokeDasharray="4 3"
              style={{ transformOrigin: "26px 31px", animation: isPlaying ? "reel-spin 2s linear infinite" : "none" }} />
            <circle cx="74" cy="31" r="12" fill="#1a1714" stroke="#4a4035" strokeWidth="1" />
            <circle cx="74" cy="31" r="7" fill="none" stroke={accentGlow} strokeWidth="2" strokeDasharray="4 3"
              style={{ transformOrigin: "74px 31px", animation: isPlaying ? "reel-spin 1.4s linear infinite reverse" : "none" }} />
          </svg>
          <span className="text-xs font-mono text-[#a89880] hidden sm:inline">ANANDA BINTANG / STUDIO</span>
        </div>

        {/* Track pill selector */}
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => navigateTo(i)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                i === currentIdx
                  ? "text-black font-bold"
                  : "text-[#5c5248] hover:text-[#a89880]"
              }`}
              style={i === currentIdx ? { background: currentTrack.artAccent } : {}}
            >
              {t.trackNo === "00" ? "HOME" : t.trackNo}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono text-[#5c5248] hidden md:block">
          {currentTrack.trackNo} / {TRACKS.length - 1} &nbsp;|&nbsp; {isPlaying ? (
            <span style={{ color: "#1db954" }}>PLAYING</span>
          ) : "PAUSED"}
        </div>
      </nav>

      {/* Main content area - two GSAP panels */}
      <div className="relative flex-1 overflow-hidden" style={{ paddingBottom: "88px" }}>
        {/* Panel A */}
        <div ref={panelARef} className="absolute inset-0">
          <TrackView
            track={activePanelRef.current === "A" ? currentTrack : TRACKS[currentIdx]}
            isPlaying={isPlaying}
            onNavigate={navigateTo}
          />
        </div>
        {/* Panel B */}
        <div ref={panelBRef} className="absolute inset-0">
          <TrackView
            track={activePanelRef.current === "B" ? currentTrack : displayedTrack}
            isPlaying={isPlaying}
            onNavigate={navigateTo}
          />
        </div>
      </div>

      {/* Persistent bottom player */}
      <PlayerBar
        currentTrack={currentTrack}
        currentIdx={currentIdx}
        onPrev={handlePrev}
        onNext={handleNext}
        onTrackSelect={navigateTo}
      />
    </div>
  );
}
