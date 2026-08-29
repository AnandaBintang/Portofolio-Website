import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import {
  CaretRight,
  Cpu,
  GraduationCap,
  Briefcase,
  List,
} from "@phosphor-icons/react";
import {
  PLAYABLE_TRACKS,
  SKILLS,
  SESSIONS,
  PROFILE,
  type Track,
} from "./data/tracks";
import { PlayerBar } from "./components/PlayerBar";
import { SectionTransitionCurtain } from "./components/SectionTransitionCurtain";
import { FullscreenMenuOverlay } from "./components/FullscreenMenuOverlay";
import { CustomMusicCursor } from "./components/CustomMusicCursor";
import { CenterStageHero } from "./components/CenterStageHero";
import { HorizontalCrateDiscography } from "./components/HorizontalCrateDiscography";
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
  const lenisRef = useRef<Lenis | null>(null);
  const touchStartYRef = useRef(0);
  const transitionLockUntilRef = useRef<number>(0);
  const activeSectionIdxRef = useRef<number>(0);

  // Precise Boundary Time Tracking:
  // User MUST be settled at the boundary for at least 400ms before a new gesture can trigger a transition
  const reachedBottomAtTimeRef = useRef<number | null>(null);
  const reachedTopAtTimeRef = useRef<number | null>(Date.now());

  // Keep ref in sync with state
  useEffect(() => {
    activeSectionIdxRef.current = activeSectionIdx;
    reachedBottomAtTimeRef.current = null;
    reachedTopAtTimeRef.current = Date.now();
  }, [activeSectionIdx]);

  const currentTrack: Track = PLAYABLE_TRACKS[activeTrackIdx] || PLAYABLE_TRACKS[0];

  // Sync audio state
  useEffect(() => {
    return audio.onStateChange(setIsPlaying);
  }, []);

  // Initialize Lenis with Heavy Awwwards-tier smooth damping
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstElementChild as HTMLElement,
      duration: 1.4, // Heavy inertia duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    // Sync scroll progress and monitor boundary settlement via Lenis onScroll
    lenis.on("scroll", (e: { scroll: number; limit: number }) => {
      if (isTransitioningRef.current || Date.now() < transitionLockUntilRef.current) {
        if (e.scroll !== 0) lenis.scrollTo(0, { immediate: true });
        return;
      }

      const ratio = e.limit > 0 ? Math.min(1, Math.max(0, e.scroll / e.limit)) : 0;
      const totalProg = activeSectionIdxRef.current * 25 + ratio * 25;
      setScrollProgress(Math.min(100, Math.max(0, totalProg)));

      const atBottom = e.limit > 0 ? e.scroll >= e.limit - 6 : true;
      const atTop = e.scroll <= 6;

      if (atBottom) {
        if (reachedBottomAtTimeRef.current === null) {
          reachedBottomAtTimeRef.current = Date.now();
        }
      } else {
        reachedBottomAtTimeRef.current = null;
      }

      if (atTop) {
        if (reachedTopAtTimeRef.current === null) {
          reachedTopAtTimeRef.current = Date.now();
        }
      } else {
        reachedTopAtTimeRef.current = null;
      }
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [activeSectionIdx]);

  // Fullscreen Needle Drop Transition with self-contained autonomous sequence
  const goToSection = useCallback(
    (targetIdx: number) => {
      const now = Date.now();
      if (
        isTransitioningRef.current ||
        now < transitionLockUntilRef.current ||
        targetIdx < 0 ||
        targetIdx >= SECTIONS_CONFIG.length ||
        (targetIdx === activeSectionIdxRef.current && !menuOpen)
      ) {
        if (menuOpen) setMenuOpen(false);
        return;
      }

      // Lock for 2200ms
      isTransitioningRef.current = true;
      transitionLockUntilRef.current = now + 2200;
      setMenuOpen(false);

      const targetMeta = SECTIONS_CONFIG[targetIdx];
      audio.sfx("rewind");

      // 1. Trigger Autonomous Transition Sequence
      setTransitionState({
        isTransitioning: true,
        name: targetMeta.name,
        subtitle: targetMeta.subtitle,
        accent: targetMeta.accent,
      });

      // 2. STAGE SWITCH: Update content behind the opaque vinyl curtain at t=700ms
      setTimeout(() => {
        setActiveSectionIdx(targetIdx);
        activeSectionIdxRef.current = targetIdx;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        }
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
        setScrollProgress(targetIdx * 25);
      }, 700);
    },
    [menuOpen]
  );

  const handleAnimationComplete = useCallback(() => {
    setTransitionState((prev) => ({ ...prev, isTransitioning: false }));
    isTransitioningRef.current = false;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

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

  // Robust Native Wheel Listener: ONLY transitions if user has ALREADY settled at the boundary for >= 400ms
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let wheelDebounceTimeout: ReturnType<typeof setTimeout> | null = null;
    let accumulatedDeltaY = 0;

    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (isTransitioningRef.current || now < transitionLockUntilRef.current || menuOpen) {
        e.preventDefault();
        return;
      }

      const currentScroll = lenisRef.current ? lenisRef.current.scroll : container.scrollTop;
      const maxScroll = lenisRef.current
        ? lenisRef.current.limit
        : container.scrollHeight - container.clientHeight;

      const isStrictlyAtBottom = maxScroll > 0 ? currentScroll >= maxScroll - 6 : true;
      const isStrictlyAtTop = currentScroll <= 6;

      // Scrolling Downwards
      if (e.deltaY > 0) {
        if (!isStrictlyAtBottom) {
          reachedBottomAtTimeRef.current = null;
          accumulatedDeltaY = 0;
          return;
        }

        if (reachedBottomAtTimeRef.current === null) {
          reachedBottomAtTimeRef.current = now;
          accumulatedDeltaY = 0;
          return;
        }

        const timeSettledAtBottom = now - reachedBottomAtTimeRef.current;
        if (timeSettledAtBottom < 400) {
          accumulatedDeltaY = 0;
          return;
        }

        accumulatedDeltaY += e.deltaY;
        if (accumulatedDeltaY > 120) {
          accumulatedDeltaY = 0;
          reachedBottomAtTimeRef.current = null;
          const cur = activeSectionIdxRef.current;
          if (cur < SECTIONS_CONFIG.length - 1) {
            goToSection(cur + 1); // Next section
          }
        }
      }
      // Scrolling Upwards
      else if (e.deltaY < 0) {
        if (!isStrictlyAtTop) {
          reachedTopAtTimeRef.current = null;
          accumulatedDeltaY = 0;
          return;
        }

        if (reachedTopAtTimeRef.current === null) {
          reachedTopAtTimeRef.current = now;
          accumulatedDeltaY = 0;
          return;
        }

        const timeSettledAtTop = now - reachedTopAtTimeRef.current;
        if (timeSettledAtTop < 400) {
          accumulatedDeltaY = 0;
          return;
        }

        accumulatedDeltaY += e.deltaY;
        if (accumulatedDeltaY < -120) {
          accumulatedDeltaY = 0;
          reachedTopAtTimeRef.current = null;
          const cur = activeSectionIdxRef.current;
          if (cur > 0) {
            goToSection(cur - 1); // Previous section
          }
        }
      } else {
        accumulatedDeltaY = 0;
      }

      if (wheelDebounceTimeout) clearTimeout(wheelDebounceTimeout);
      wheelDebounceTimeout = setTimeout(() => {
        accumulatedDeltaY = 0;
      }, 200);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const now = Date.now();
      if (isTransitioningRef.current || now < transitionLockUntilRef.current || menuOpen) {
        return;
      }

      const currentScroll = lenisRef.current ? lenisRef.current.scroll : container.scrollTop;
      const maxScroll = lenisRef.current
        ? lenisRef.current.limit
        : container.scrollHeight - container.clientHeight;

      const isStrictlyAtBottom = maxScroll > 0 ? currentScroll >= maxScroll - 8 : true;
      const isStrictlyAtTop = currentScroll <= 8;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartYRef.current - currentY;

      // Swiping Up (Scrolling Down)
      if (diffY > 0) {
        if (!isStrictlyAtBottom) {
          reachedBottomAtTimeRef.current = null;
          return;
        }
        if (reachedBottomAtTimeRef.current === null) {
          reachedBottomAtTimeRef.current = now;
          return;
        }
        if (now - reachedBottomAtTimeRef.current < 400) {
          return;
        }

        if (diffY > 70) {
          touchStartYRef.current = currentY;
          reachedBottomAtTimeRef.current = null;
          const cur = activeSectionIdxRef.current;
          if (cur < SECTIONS_CONFIG.length - 1) {
            goToSection(cur + 1);
          }
        }
      }
      // Swiping Down (Scrolling Up)
      else if (diffY < 0) {
        if (!isStrictlyAtTop) {
          reachedTopAtTimeRef.current = null;
          return;
        }
        if (reachedTopAtTimeRef.current === null) {
          reachedTopAtTimeRef.current = now;
          return;
        }
        if (now - reachedTopAtTimeRef.current < 400) {
          return;
        }

        if (diffY < -70) {
          touchStartYRef.current = currentY;
          reachedTopAtTimeRef.current = null;
          const cur = activeSectionIdxRef.current;
          if (cur > 0) {
            goToSection(cur - 1);
          }
        }
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      if (wheelDebounceTimeout) clearTimeout(wheelDebounceTimeout);
    };
  }, [goToSection, menuOpen]);

  // Section next / prev controls
  const handlePrevSection = () => {
    const cur = activeSectionIdxRef.current;
    const nextIdx = cur > 0 ? cur - 1 : SECTIONS_CONFIG.length - 1;
    goToSection(nextIdx);
  };

  const handleNextSection = () => {
    const cur = activeSectionIdxRef.current;
    const nextIdx = cur < SECTIONS_CONFIG.length - 1 ? cur + 1 : 0;
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

      {/* ── Custom Interactive Music Stylus & Vinyl Cursor ── */}
      <CustomMusicCursor
        accentColor={currentSectionConfig.accent}
        isPlaying={isPlaying}
      />

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

      {/* ── Fullscreen Autonomous Turntable Transition Sequence ── */}
      <SectionTransitionCurtain
        isTransitioning={transitionState.isTransitioning}
        targetSectionName={transitionState.name}
        targetSectionSubtitle={transitionState.subtitle}
        accentColor={transitionState.accent}
        onAnimationComplete={handleAnimationComplete}
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

      {/* ── Active Pinned Section Stage (Driven by Lenis Smooth Scroll) ── */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollable relative pb-32"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6 min-h-full">

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 0: PROLOGUE (MODERN FULL-BLEED CENTER STAGE ALBUM HUB)
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 0 && (
            <CenterStageHero
              isPlaying={isPlaying}
              onExploreTracks={() => goToSection(1)}
              accentColor={currentSectionConfig.accent}
            />
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 1: THE DISCOGRAPHY / HORIZONTAL VINYL CRATE SCRUB
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 1 && (
            <HorizontalCrateDiscography
              activeTrackIdx={activeTrackIdx}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onTrackInView={(idx) => setActiveTrackIdx(idx)}
            />
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
