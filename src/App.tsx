import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import {
  CaretRight,
  ArrowUpRight,
  EnvelopeSimple,
  ArrowDown,
  Sparkle,
  Cpu,
  GraduationCap,
  Briefcase,
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
import { CustomMusicCursor } from "./components/CustomMusicCursor";
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

  // Initialize Lenis with Heavy Awwwards-tier smooth damping inside active container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstElementChild as HTMLElement,
      duration: 1.4, // Heavy inertia duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85, // Luxurious heavy scroll feel
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

      // Track exact timestamp when bottom is reached
      if (atBottom) {
        if (reachedBottomAtTimeRef.current === null) {
          reachedBottomAtTimeRef.current = Date.now();
        }
      } else {
        reachedBottomAtTimeRef.current = null;
      }

      // Track exact timestamp when top is reached
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

      // Check current scroll position strictly from Lenis or container
      const currentScroll = lenisRef.current ? lenisRef.current.scroll : container.scrollTop;
      const maxScroll = lenisRef.current
        ? lenisRef.current.limit
        : container.scrollHeight - container.clientHeight;

      const isStrictlyAtBottom = maxScroll > 0 ? currentScroll >= maxScroll - 6 : true;
      const isStrictlyAtTop = currentScroll <= 6;

      // Scrolling Downwards
      if (e.deltaY > 0) {
        // If we are NOT at the bottom, user is scrolling inside the section. Do NOT allow transition!
        if (!isStrictlyAtBottom) {
          reachedBottomAtTimeRef.current = null;
          accumulatedDeltaY = 0;
          return;
        }

        // If we just arrived at the bottom right now, record timestamp and clamp here (do not transition on same scroll)
        if (reachedBottomAtTimeRef.current === null) {
          reachedBottomAtTimeRef.current = now;
          accumulatedDeltaY = 0;
          return;
        }

        // User must have been settled at the bottom for at least 400ms before a new scroll down gesture can trigger transition
        const timeSettledAtBottom = now - reachedBottomAtTimeRef.current;
        if (timeSettledAtBottom < 400) {
          accumulatedDeltaY = 0;
          return;
        }

        // User is at bottom and deliberately initiated a new scroll down gesture
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
        // If we are NOT at the top, user is scrolling inside the section. Do NOT allow transition!
        if (!isStrictlyAtTop) {
          reachedTopAtTimeRef.current = null;
          accumulatedDeltaY = 0;
          return;
        }

        // If we just arrived at the top right now, record timestamp and clamp here
        if (reachedTopAtTimeRef.current === null) {
          reachedTopAtTimeRef.current = now;
          accumulatedDeltaY = 0;
          return;
        }

        // User must have been settled at the top for at least 400ms before a new scroll up gesture can trigger transition
        const timeSettledAtTop = now - reachedTopAtTimeRef.current;
        if (timeSettledAtTop < 400) {
          accumulatedDeltaY = 0;
          return;
        }

        // User is at top and deliberately initiated a new scroll up gesture
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
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-10 min-h-full">

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 0: PROLOGUE (MINIMALIST VINYL ALBUM SLEEVE HERO)
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 0 && (
            <div className="space-y-12 md:space-y-16 animate-[fadeIn_0.5s_ease-out]">
              
              {/* Minimal Liner Note Topbar */}
              <div className="flex items-center justify-between text-xs font-mono text-[#5c5248] pb-4 border-b border-[#2a2520]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping shrink-0" />
                  <span className="text-[#1db954] font-medium tracking-wider">SIDE A · TRACK 00</span>
                  <span className="text-[#332d26]">/</span>
                  <span className="text-[#a89880]">RESIDENCY: WEEKEND INC. (SAMPOERNA)</span>
                </div>
                <div className="hidden sm:block text-[11px] text-[#5c5248] tracking-widest uppercase">
                  MASTER STEREO 96kHz / 24-BIT
                </div>
              </div>

              {/* Minimalist Vinyl Sleeve Hero Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-4 md:py-8">
                
                {/* Left: Punchy Clean Typography & Bio */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs sm:text-sm font-mono text-[#e8a045] font-bold tracking-widest uppercase block">
                      // THE INVISIBLE ENGINE
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f0ebe3] leading-[1.04]">
                      BACKEND <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a045] via-[#f0ebe3] to-[#a89880]">
                        ARCHITECT.
                      </span>
                    </h1>
                  </div>

                  <p className="text-base sm:text-lg text-[#a89880] leading-relaxed max-w-xl font-normal">
                    Architecting high-throughput microservices, sub-100ms database query indexing, and mission-critical cloud APIs for enterprise retail platforms.
                  </p>

                  {/* Clean 2-Action Essential Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => goToSection(1)}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#e8a045] text-black font-semibold text-xs font-mono hover:bg-[#f0b055] transition-all cursor-pointer shadow-lg active:scale-95"
                    >
                      <span>EXPLORE TRACKS</span>
                      <ArrowDown size={14} weight="bold" />
                    </button>

                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1c1916] border border-[#4a4035] text-[#f0ebe3] font-mono text-xs hover:border-[#e8a045] transition-all cursor-pointer"
                    >
                      <EnvelopeSimple size={15} />
                      <span>GET IN TOUCH</span>
                    </a>
                  </div>
                </div>

                {/* Right: Vinyl Album Sleeve (Clean Photo + Vinyl Edge) */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-[340px] sm:max-w-[370px] group select-none">
                    
                    {/* Peeking Spinning Vinyl Record Behind Sleeve */}
                    <div
                      className={`absolute top-2 -right-8 sm:-right-12 w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#12100e] border-4 border-[#24201a] shadow-2xl flex items-center justify-center transition-all duration-700 group-hover:-right-14 sm:group-hover:-right-18 ${
                        isPlaying ? "animate-spin" : ""
                      }`}
                      style={{ animationDuration: "6s" }}
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-[#e8a045] bg-[radial-gradient(circle,#e8a045_0%,#1c1916_100%)] flex items-center justify-center p-1">
                        <span className="text-[7px] font-mono font-bold text-black uppercase">45 RPM</span>
                      </div>
                    </div>

                    {/* Minimalist Square Album Sleeve Frame */}
                    <div className="relative z-10 aspect-square w-full rounded-2xl overflow-hidden border border-[#332d26] bg-[#141210] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between group-hover:border-[#4a4035] transition-colors">
                      {/* Top Sleeve Label */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#5c5248]">
                        <span className="tracking-widest text-[#e8a045]">VOL. 01 / PROLOGUE</span>
                        <span>{PROFILE.coordinates}</span>
                      </div>

                      {/* Photo Artwork */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-[#2a2520] my-2">
                        <img
                          src={PROFILE.avatarUrl}
                          alt={PROFILE.name}
                          className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>

                      {/* Bottom Sleeve Title */}
                      <div className="flex items-center justify-between pt-1 text-xs font-mono">
                        <div>
                          <span className="font-bold text-[#f0ebe3] block leading-tight">{PROFILE.name}</span>
                          <span className="text-[10px] text-[#5c5248] uppercase tracking-wider block">{PROFILE.title}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#1db954] px-2 py-0.5 rounded bg-[#1c1916] border border-[#2a2520]">
                          ● ONLINE
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Bottom Subtle Transition Helper */}
              <div className="pt-6 border-t border-[#262630]/60 flex items-center justify-between text-xs font-mono text-[#5c5248]">
                <div className="flex items-center gap-2 text-[#e8a045]">
                  <Sparkle size={14} />
                  <span>STUDIO DISCOGRAPHY AHEAD</span>
                </div>
                <button
                  onClick={() => goToSection(1)}
                  className="flex items-center gap-2 hover:text-[#f0ebe3] transition-colors cursor-pointer"
                >
                  <span>SCROLL DOWN AT BOTTOM TO CUE NEXT CHAPTER</span>
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
