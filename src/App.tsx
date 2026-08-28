import { useEffect, useRef, useState, useCallback } from "react";
import {
  CaretRight,
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
  ArrowDown,
  Sparkle,
  TerminalWindow,
  Cpu,
  GraduationCap,
  Briefcase,
  MapPin,
  Waveform as WaveformIcon,
  List,
} from "@phosphor-icons/react";
import {
  PLAYABLE_TRACKS,
  PROJECTS,
  SKILLS,
  SESSIONS,
  PROFILE,
  type Track,
} from "./data/tracks";
import { StickyAudioDeck } from "./components/StickyAudioDeck";
import { PlayerBar } from "./components/PlayerBar";
import { SectionTransitionCurtain } from "./components/SectionTransitionCurtain";
import { FullscreenMenuOverlay } from "./components/FullscreenMenuOverlay";
import { audio } from "./lib/audioEngine";

interface TransitionState {
  isTransitioning: boolean;
  name: string;
  subtitle: string;
  accent: string;
}

const SECTIONS_CONFIG = [
  {
    id: "prologue",
    navLabel: "PROLOGUE",
    mobileShort: "00",
    chapterNumber: "CH 00",
    name: "THE ACOUSTIC PROLOGUE",
    subtitle: "// PROFILE, SPECIALIZATION & RESIDENCY",
    accent: "#e8a045",
  },
  {
    id: "projects-area",
    navLabel: "DISCOGRAPHY",
    mobileShort: "01",
    chapterNumber: "CH 01",
    name: "STUDIO DISCOGRAPHY",
    subtitle: "// 4 MASTER PRODUCTION RELEASES",
    accent: "#4a9eff",
  },
  {
    id: "experience-area",
    navLabel: "SESSION LOGS",
    mobileShort: "02",
    chapterNumber: "CH 02",
    name: "STUDIO MASTER LOGS",
    subtitle: "// CHRONOLOGICAL PRODUCTION SESSIONS",
    accent: "#f472b6",
  },
  {
    id: "frequencies-area",
    navLabel: "STUDIO SETUP",
    mobileShort: "03",
    chapterNumber: "CH 03",
    name: "FREQUENCY BANDS",
    subtitle: "// 6 CALIBRATED EQUALIZER TIERS",
    accent: "#2dd4bf",
  },
];

export default function App() {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    name: "",
    subtitle: "",
    accent: "#e8a045",
  });

  const isTransitioningRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const touchStartYRef = useRef(0);
  const lastSectionChangeTimeRef = useRef(0);

  const currentTrack: Track = PLAYABLE_TRACKS[activeTrackIdx] || PLAYABLE_TRACKS[0];

  // Sync audio state
  useEffect(() => {
    return audio.onStateChange(setIsPlaying);
  }, []);

  // Recalculate and update continuous scroll percentage (0 to 100%)
  const computeAndSetProgress = useCallback((sectionIdx: number, scrollTop: number, scrollHeight: number, clientHeight: number) => {
    const maxScrollInStage = scrollHeight - clientHeight;
    const stageRatio = maxScrollInStage > 0 ? Math.min(1, Math.max(0, scrollTop / maxScrollInStage)) : 0;
    
    // Each section represents a exact 25% span of the entire journey
    const totalProg = (sectionIdx * 25) + (stageRatio * 25);
    setScrollProgress(Math.min(100, Math.max(0, totalProg)));
  }, []);

  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    computeAndSetProgress(activeSectionIdx, el.scrollTop, el.scrollHeight, el.clientHeight);
  };

  // Fullscreen transition shutter between pinned sections (strictly 1 section jump)
  const goToSection = useCallback(
    (targetIdx: number) => {
      const now = Date.now();
      // Strict cooldown lock of 850ms to prevent multi-section skips
      if (
        targetIdx < 0 ||
        targetIdx >= SECTIONS_CONFIG.length ||
        (targetIdx === activeSectionIdx && !menuOpen) ||
        isTransitioningRef.current ||
        now - lastSectionChangeTimeRef.current < 850
      ) {
        setMenuOpen(false);
        return;
      }

      isTransitioningRef.current = true;
      lastSectionChangeTimeRef.current = now;
      wheelAccumulatorRef.current = 0;
      setMenuOpen(false);
      const targetMeta = SECTIONS_CONFIG[targetIdx];

      audio.sfx("rewind");

      setTransitionState({
        isTransitioning: true,
        name: targetMeta.name,
        subtitle: targetMeta.subtitle,
        accent: targetMeta.accent,
      });

      // Switch view midway through shutter close
      setTimeout(() => {
        setActiveSectionIdx(targetIdx);
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
        setScrollProgress(targetIdx * 25);
      }, 300);

      // Open shutter
      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, isTransitioning: false }));
        isTransitioningRef.current = false;
        wheelAccumulatorRef.current = 0;
      }, 700);
    },
    [activeSectionIdx, menuOpen]
  );

  // Keyboard shortcut listener (ESC to close menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Wheel & Touch listener for bottom-boundary section transitions (Strictly 1 section at a time)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current || menuOpen) {
        return;
      }

      const container = scrollContainerRef.current;
      if (!container) return;

      const atBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 4;
      const atTop = container.scrollTop <= 4;

      if (e.deltaY > 0 && atBottom) {
        wheelAccumulatorRef.current += e.deltaY;
        // Higher threshold + strict cooldown ensures single-step transition
        if (wheelAccumulatorRef.current > 180) {
          wheelAccumulatorRef.current = 0;
          if (activeSectionIdx < SECTIONS_CONFIG.length - 1) {
            goToSection(activeSectionIdx + 1);
          }
        }
      } else if (e.deltaY < 0 && atTop) {
        wheelAccumulatorRef.current += e.deltaY;
        if (wheelAccumulatorRef.current < -180) {
          wheelAccumulatorRef.current = 0;
          if (activeSectionIdx > 0) {
            goToSection(activeSectionIdx - 1);
          }
        }
      } else {
        wheelAccumulatorRef.current = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTransitioningRef.current || menuOpen) {
        return;
      }
      const container = scrollContainerRef.current;
      if (!container) return;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartYRef.current - currentY;
      const atBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 6;
      const atTop = container.scrollTop <= 6;

      if (diffY > 90 && atBottom) {
        touchStartYRef.current = currentY;
        if (activeSectionIdx < SECTIONS_CONFIG.length - 1) {
          goToSection(activeSectionIdx + 1);
        }
      } else if (diffY < -90 && atTop) {
        touchStartYRef.current = currentY;
        if (activeSectionIdx > 0) {
          goToSection(activeSectionIdx - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [activeSectionIdx, goToSection, menuOpen]);

  // Section next / prev controls
  const handlePrevSection = () => {
    const nextIdx = activeSectionIdx > 0 ? activeSectionIdx - 1 : SECTIONS_CONFIG.length - 1;
    goToSection(nextIdx);
  };

  const handleNextSection = () => {
    const nextIdx = activeSectionIdx < SECTIONS_CONFIG.length - 1 ? activeSectionIdx + 1 : 0;
    goToSection(nextIdx);
  };

  const currentSectionConfig = SECTIONS_CONFIG[activeSectionIdx];

  return (
    <div
      className="h-screen w-screen overflow-hidden text-[#f0ebe3] selection:bg-[#e8a045] selection:text-black flex flex-col relative"
      style={{
        background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${currentSectionConfig.accent}15 0%, #0f0d0b 70%)`,
        transition: "background 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Film Grain Texture */}
      <div className="grain" />

      {/* ── Fullscreen Interactive Kinetic Menu Overlay ── */}
      <FullscreenMenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        sections={SECTIONS_CONFIG}
        activeSectionIdx={activeSectionIdx}
        onSelectSection={goToSection}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          audio.sfx("click");
          audio.toggle();
        }}
      />

      {/* ── Fullscreen Tape Shutter Section Transition ── */}
      <SectionTransitionCurtain
        isTransitioning={transitionState.isTransitioning}
        targetSectionName={transitionState.name}
        targetSectionSubtitle={transitionState.subtitle}
        accentColor={transitionState.accent}
      />

      {/* ── Fixed Master Header ── */}
      <header className="shrink-0 z-40 w-full border-b border-[#332d26] bg-[#0f0d0b]/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-18 flex items-center justify-between gap-3">
          
          {/* Brand Identity */}
          <div
            onClick={() => goToSection(0)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0 min-w-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#4a4035] bg-[#1c1916] flex items-center justify-center text-white shrink-0">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#e8a045] animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-xs sm:text-sm text-[#f0ebe3] group-hover:text-[#e8a045] transition-colors truncate">
                {PROFILE.callsign.toUpperCase()}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#5c5248] tracking-wider block uppercase truncate">
                {PROFILE.title.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Center: Active Stage Quick Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#141210] border border-[#332d26] text-xs font-mono">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: currentSectionConfig.accent }}
            />
            <span className="text-[#5c5248]">{currentSectionConfig.chapterNumber} :</span>
            <span className="text-[#f0ebe3] font-bold">{currentSectionConfig.navLabel}</span>
          </div>

          {/* Right Controls: Fullscreen Menu Button + Live Status */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#5c5248] pr-2 border-r border-[#2a2520]">
              <span
                className="w-2 h-2 rounded-full transition-colors"
                style={{ background: isPlaying ? "#1db954" : "#5c5248" }}
              />
              {isPlaying ? "AUDIO LIVE" : "BGM READY"}
            </div>

            {/* Kinetic Fullscreen Menu Trigger */}
            <button
              onClick={() => {
                audio.sfx("click");
                setMenuOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#1c1916] border border-[#4a4035] hover:border-[#e8a045] text-[#f0ebe3] text-xs font-mono font-bold active:scale-95 transition-all cursor-pointer shadow-md group"
            >
              <List size={16} className="text-[#e8a045] group-hover:rotate-90 transition-transform" />
              <span>CHAPTERS MENU</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── Active Pinned Section Stage ── */}
      <main
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        className="flex-1 overflow-y-auto scrollable relative pb-32"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-10 min-h-full">

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 0: PROLOGUE (CINEMATIC HERO & ARTIST PROFILE)
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 0 && (
            <div className="space-y-10 md:space-y-12 animate-[fadeIn_0.5s_ease-out]">
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#5c5248] pb-4 border-b border-[#2a2520]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping shrink-0" />
                  <span className="text-[#1db954] font-medium tracking-wide">ACTIVE PRODUCTION RESIDENCY</span>
                  <span className="text-[#332d26]">/</span>
                  <span className="truncate">WEEKEND INC. (SAMPOERNA)</span>
                </div>
                <div className="hidden sm:block">
                  <span>SYSTEM LATENCY: SUB-100MS OPTIMIZED</span>
                </div>
              </div>

              {/* Hero Main Grid: Photo + Typography */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4 md:py-6">
                
                {/* Left: Headline & Bio */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#e8a045]">
                    <TerminalWindow size={14} className="text-[#e8a045]" />
                    <span>THE INVISIBLE SIGNAL CHAIN</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#f0ebe3] leading-[1.05]">
                    ARCHITECTING <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a045] via-[#f0ebe3] to-[#a89880]">
                      INVISIBLE ENGINES.
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-[#a89880] leading-relaxed max-w-2xl font-normal">
                    {PROFILE.subheadline}
                  </p>

                  {/* Action CTAs */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                    <button
                      onClick={() => goToSection(1)}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#e8a045] text-black font-semibold text-xs font-mono hover:bg-[#f0b055] transition-all cursor-pointer shadow-lg active:scale-95"
                    >
                      <span>ENTER DISCOGRAPHY</span>
                      <ArrowDown size={14} weight="bold" />
                    </button>

                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#1c1916] border border-[#4a4035] text-[#f0ebe3] font-mono text-xs hover:border-[#e8a045] transition-all cursor-pointer"
                    >
                      <EnvelopeSimple size={14} />
                      <span>TRANSMIT MESSAGE</span>
                    </a>

                    <a
                      href={PROFILE.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#1c1916] border border-[#332d26] text-[#a89880] hover:text-[#f0ebe3] font-mono text-xs transition-all"
                    >
                      <GithubLogo size={15} weight="fill" />
                      <span>GITHUB</span>
                    </a>
                  </div>
                </div>

                {/* Right: Personal Profile Card */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="w-full max-w-[320px] sm:max-w-[340px] bg-[#141210] border border-[#332d26] rounded-2xl p-5 shadow-2xl space-y-4 relative group">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-[#4a4035] bg-[#1c1916]">
                      <img
                        src={PROFILE.avatarUrl}
                        alt={PROFILE.name}
                        className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0f0d0b]/80 border border-[#332d26] text-[9px] font-mono text-[#e8a045]">
                        MASTER ARTIST
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#0f0d0b]/80 border border-[#332d26] text-[9px] font-mono text-[#a89880]">
                        {PROFILE.coordinates}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-[#f0ebe3]">{PROFILE.name}</h3>
                        <span className="text-[10px] font-mono text-[#1db954]">● ONLINE</span>
                      </div>
                      <p className="text-xs font-mono text-[#e8a045]">{PROFILE.title}</p>
                      <p className="text-xs text-[#5c5248] font-mono flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{PROFILE.location}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2a2520] text-xs font-mono">
                      {PROFILE.stats.map((s, i) => (
                        <div key={i} className="bg-[#1c1916] p-2 rounded border border-[#2a2520]">
                          <span className="text-[9px] text-[#5c5248] block leading-tight">{s.label}</span>
                          <span className="text-[11px] font-semibold text-[#f0ebe3] block truncate">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Transition Helper */}
              <div className="pt-6 border-t border-[#262630]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#5c5248]">
                <div className="flex items-center gap-2 text-[#e8a045]">
                  <Sparkle size={14} />
                  <span>PLAYABLE DISCOGRAPHY AHEAD</span>
                </div>
                <button
                  onClick={() => goToSection(1)}
                  className="flex items-center gap-2 animate-bounce hover:text-[#f0ebe3] transition-colors cursor-pointer"
                >
                  <span>SCROLL DOWN AT BOTTOM TO TRIGGER SHUTTER WIPE</span>
                  <ArrowDown size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 1: THE DISCOGRAPHY / PLAYABLE PROJECT TRACKS
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 1 && (
            <div className="space-y-10 md:space-y-12 animate-[fadeIn_0.5s_ease-out]">
              {/* Section Header */}
              <div className="space-y-3 pb-6 border-b border-[#2a2520]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#4a9eff]">
                  <WaveformIcon size={14} />
                  <span>STUDIO DISCOGRAPHY · 4 MASTER TRACKS</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  SELECTED RELEASES.
                </h2>
                <p className="text-sm sm:text-base text-[#a89880] max-w-xl font-mono leading-relaxed">
                  Switch tracks to engage the turntable deck, inspect architectural scopes, and examine deliverable ledgers.
                </p>
              </div>

              {/* Two Column Layout: Sticky Deck + Track Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left: Sticky Turntable Deck */}
                <div className="lg:col-span-5 hidden lg:block sticky top-6">
                  <StickyAudioDeck
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    activeSectionIdx={activeTrackIdx}
                  />
                </div>

                {/* Right: Interactive Track Details */}
                <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                  {/* Track Switcher Pills */}
                  <div className="flex flex-wrap gap-2 pb-2">
                    {PLAYABLE_TRACKS.map((t, tIdx) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          audio.sfx("click");
                          setActiveTrackIdx(tIdx);
                        }}
                        className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                          tIdx === activeTrackIdx
                            ? "bg-[#242018] text-white border border-[#4a4035] shadow-lg font-bold"
                            : "bg-[#141210] text-[#a89880] border border-[#2a2520] hover:bg-[#1c1916]"
                        }`}
                      >
                        <span style={{ color: t.artAccent }}>{t.trackNo}</span>
                        <span>{t.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Track Showcase Card */}
                  {(() => {
                    const project = PROJECTS[currentTrack.id];
                    return (
                      <div className="bg-[#141210] border border-[#332d26] rounded-2xl p-5 sm:p-8 space-y-6 shadow-2xl">
                        <div className="space-y-1">
                          <span className="text-xs font-mono" style={{ color: currentTrack.artAccent }}>
                            {currentTrack.storyChapter} · {currentTrack.bpm} BPM
                          </span>
                          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#f0ebe3]">
                            {currentTrack.title}
                          </h3>
                          <p className="text-sm font-mono text-[#a89880]">{project.tagline}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                            ARCHITECTURAL SCOPE
                          </h4>
                          <p className="text-sm sm:text-base text-[#a89880] leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                            ENGINEERING DELIVERABLES
                          </h4>
                          <div className="grid grid-cols-1 gap-2.5">
                            {project.deliverables.map((deliv, dIdx) => (
                              <div
                                key={dIdx}
                                className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-xs sm:text-sm text-[#f0ebe3]"
                              >
                                <span
                                  className="font-mono font-bold shrink-0 mt-0.5"
                                  style={{ color: currentTrack.artAccent }}
                                >
                                  0{dIdx + 1}
                                </span>
                                <span className="leading-relaxed">{deliv}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stack & Outbound Links */}
                        <div className="pt-4 border-t border-[#332d26] flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            {project.stack.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#1c1916] border border-[#332d26] text-[#a89880]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-3">
                            {"liveUrl" in project && project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-black text-xs font-mono font-bold hover:opacity-90 transition-all shadow-md"
                                style={{ background: currentTrack.artAccent }}
                              >
                                <span>LIVE APP</span>
                                <ArrowUpRight size={13} weight="bold" />
                              </a>
                            )}

                            {"githubUrl" in project && project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-mono font-bold hover:bg-white/10 transition-all"
                                style={{
                                  borderColor: currentTrack.artAccent,
                                  color: currentTrack.artAccent,
                                }}
                              >
                                <span>SOURCE REPO</span>
                                <ArrowUpRight size={13} weight="bold" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 2: STUDIO MASTER LOGS (EXPERIENCE & EDUCATION)
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 2 && (
            <div className="space-y-10 md:space-y-12 animate-[fadeIn_0.5s_ease-out]">
              <div className="space-y-3 pb-6 border-b border-[#2a2520]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#f472b6]">
                  <Briefcase size={14} />
                  <span>THE MASTER LOGS · CHRONOLOGICAL SESSIONS</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  STUDIO SESSIONS.
                </h2>
                <p className="text-sm sm:text-base text-[#a89880] max-w-xl font-mono leading-relaxed">
                  Professional trajectory spanning enterprise retail architectures, high-scale digital commerce, and technical community mentorship.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Experience Tapes */}
                <div className="lg:col-span-8 space-y-6">
                  {SESSIONS.map((session, i) => (
                    <div
                      key={i}
                      className={`bg-[#141210] border rounded-2xl p-5 sm:p-8 transition-all shadow-xl ${
                        session.active ? "border-[#f472b6]/50" : "border-[#332d26]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2520] pb-4 mb-4">
                        <div>
                          <span className="text-xs font-mono text-[#f472b6] font-bold block mb-1">
                            {session.tapeId} · {session.period}
                          </span>
                          <h3 className="text-lg sm:text-2xl font-bold text-[#f0ebe3]">
                            {session.role} @ {session.company}
                          </h3>
                          <p className="text-xs font-mono text-[#a89880] mt-0.5">
                            Client Account: {session.client}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#1c1916] border border-[#332d26] text-[#f0ebe3]">
                            {session.location}
                          </span>
                        </div>
                      </div>

                      {session.active && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-2 h-2 rounded-full bg-[#1db954] animate-pulse" />
                          <span className="text-xs font-mono text-[#1db954] font-bold">
                            CURRENT PRODUCTION RESIDENCY
                          </span>
                        </div>
                      )}

                      <ul className="space-y-2.5 mb-6">
                        {session.highlights.map((h, j) => (
                          <li key={j} className="text-xs sm:text-sm text-[#a89880] flex items-start gap-2.5 leading-relaxed">
                            <CaretRight size={14} className="text-[#f472b6] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#2a2520]">
                        {session.tags.map((tag, j) => (
                          <span
                            key={j}
                            className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#1c1916] border border-[#332d26] text-[#a89880]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sidebar: Education & Protocol */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#141210] border border-[#332d26] rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#5c5248] uppercase border-b border-[#2a2520] pb-3">
                      <GraduationCap size={16} className="text-[#e8a045]" />
                      <span>ACOUSTIC FOUNDATION (EDUCATION)</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#1c1916] p-4 rounded-xl border border-[#2a2520]">
                        <h4 className="text-base font-bold text-[#f0ebe3]">{PROFILE.education.school}</h4>
                        <p className="text-xs text-[#e8a045] font-mono mt-0.5">{PROFILE.education.degree}</p>
                        <p className="text-xs font-mono text-[#5c5248] mt-2">{PROFILE.education.period}</p>
                      </div>

                      <div className="bg-[#1c1916] p-4 rounded-xl border border-[#2a2520]">
                        <h4 className="text-base font-bold text-[#f0ebe3]">{PROFILE.education.highschool}</h4>
                        <p className="text-xs text-[#a89880] mt-0.5">{PROFILE.education.highschoolMajor}</p>
                        <p className="text-xs font-mono text-[#5c5248] mt-2">{PROFILE.education.highschoolPeriod}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1c1916] border border-[#332d26] rounded-2xl p-6 space-y-3 shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#5c5248] uppercase">
                      <Cpu size={15} className="text-[#e8a045]" />
                      <span>ENGINEERING PROTOCOL</span>
                    </div>
                    <p className="text-xs text-[#a89880] leading-relaxed font-mono">
                      Clean Architecture discipline, automated diff-based linting (Husky + Commitlint), zero N+1 latency tolerance, and structured cloud observability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 3: STUDIO SETUP (FREQUENCY BANDS / SKILLS)
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 3 && (
            <div className="space-y-10 md:space-y-12 animate-[fadeIn_0.5s_ease-out]">
              <div className="space-y-3 pb-6 border-b border-[#2a2520]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#2dd4bf]">
                  <Cpu size={14} />
                  <span>STUDIO SETUP · 6 EQUALIZER FREQUENCY BANDS</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  FREQUENCY BANDS.
                </h2>
                <p className="text-sm sm:text-base text-[#a89880] max-w-xl font-mono leading-relaxed">
                  Calibrated technical proficiencies across persistence layers, core logic, cloud infrastructure, and quality automation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {SKILLS.map((cat, i) => (
                  <div
                    key={i}
                    className="bg-[#141210] border border-[#332d26] rounded-2xl p-6 hover:border-[#4a4035] transition-colors space-y-5 shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-[#2a2520] pb-3.5">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#2dd4bf] block mb-0.5">
                          {cat.band}
                        </span>
                        <h3 className="text-sm font-bold text-[#f0ebe3] uppercase">
                          {cat.category}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1916] border border-[#332d26] text-[#5c5248]">
                        {cat.freq}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {cat.items.map((skill, j) => (
                        <div key={j} className="flex items-center justify-between text-xs">
                          <span className="text-[#f0ebe3] font-medium">{skill}</span>
                          <span className="font-mono text-[#5c5248] text-[11px]">CALIBRATED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Persistent Bottom Music Player Bar with Direct Realtime Scroll Percentage ── */}
      <PlayerBar
        currentTrack={currentTrack}
        scrollProgress={scrollProgress}
        onPrevSection={handlePrevSection}
        onNextSection={handleNextSection}
        onTrackSelect={(idx) => {
          setActiveTrackIdx(idx);
          if (activeSectionIdx !== 1) {
            goToSection(1);
          }
        }}
        currentTrackIdx={activeTrackIdx}
      />
    </div>
  );
}
