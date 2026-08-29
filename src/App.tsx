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
import { ParallaxDiscography } from "./components/ParallaxDiscography";
import { ContactModal } from "./components/ContactModal";
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
    chapterNumber: "00",
    name: "PROLOGUE",
    subtitle: "// PROFILE & BACKGROUND",
    accent: "#e8a045",
  },
  {
    id: "projects-area",
    navLabel: "PROJECTS",
    mobileShort: "01",
    chapterNumber: "01",
    name: "SELECTED PROJECTS",
    subtitle: "// ENTERPRISE PLATFORMS & APIS",
    accent: "#4a9eff",
  },
  {
    id: "experience-area",
    navLabel: "EXPERIENCE",
    mobileShort: "02",
    chapterNumber: "02",
    name: "WORK EXPERIENCE",
    subtitle: "// CAREER HISTORY & EDUCATION",
    accent: "#f472b6",
  },
  {
    id: "frequencies-area",
    navLabel: "SKILLS",
    mobileShort: "03",
    chapterNumber: "03",
    name: "TECH STACK",
    subtitle: "// CORE SKILLS & INFRASTRUCTURE",
    accent: "#2dd4bf",
  },
];

export default function App() {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
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

  const reachedBottomAtTimeRef = useRef<number | null>(null);
  const reachedTopAtTimeRef = useRef<number | null>(Date.now());

  useEffect(() => {
    activeSectionIdxRef.current = activeSectionIdx;
    reachedBottomAtTimeRef.current = null;
    reachedTopAtTimeRef.current = Date.now();
  }, [activeSectionIdx]);

  const currentTrack: Track = PLAYABLE_TRACKS[activeTrackIdx] || PLAYABLE_TRACKS[0];

  useEffect(() => {
    return audio.onStateChange(setIsPlaying);
  }, []);

  // Initialize Lenis with Heavy Awwwards-tier smooth damping & track cards intersection observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstElementChild as HTMLElement,
      duration: 1.4,
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

      // In Section 1 (Projects): Dynamically update active track in turntable deck based on visible card
      if (activeSectionIdxRef.current === 1) {
        const cards = container.querySelectorAll(".project-parallax-card");
        const containerRect = container.getBoundingClientRect();
        const midY = containerRect.top + containerRect.height * 0.45;

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          if (rect.top <= midY && rect.bottom >= midY) {
            const idxStr = card.getAttribute("data-project-index");
            if (idxStr !== null) {
              const pIdx = parseInt(idxStr, 10);
              if (!isNaN(pIdx) && pIdx !== activeTrackIdx) {
                setActiveTrackIdx(pIdx);
              }
            }
          }
        });
      }
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [activeSectionIdx, activeTrackIdx]);

  // Fullscreen Needle Drop Transition
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

      isTransitioningRef.current = true;
      transitionLockUntilRef.current = now + 2200;
      setMenuOpen(false);

      const targetMeta = SECTIONS_CONFIG[targetIdx];
      audio.sfx("rewind");

      setTransitionState({
        isTransitioning: true,
        name: targetMeta.name,
        subtitle: targetMeta.subtitle,
        accent: targetMeta.accent,
      });

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

  // ── Auto-Scroll Drive: Automatically scrolls page forward as Ambient Music plays ──
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (isTransitioningRef.current || Date.now() < transitionLockUntilRef.current || menuOpen || contactOpen) {
        return;
      }

      const container = scrollContainerRef.current;
      const lenis = lenisRef.current;
      if (!container || !lenis) return;

      const maxScroll = lenis.limit;
      const currentScroll = lenis.scroll;

      if (maxScroll > 0 && currentScroll < maxScroll - 6) {
        lenis.scrollTo(currentScroll + 4, { immediate: false, duration: 0.6 });
      } else if (currentScroll >= maxScroll - 6 && maxScroll > 0) {
        if (activeSectionIdxRef.current < SECTIONS_CONFIG.length - 1) {
          goToSection(activeSectionIdxRef.current + 1);
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, goToSection, menuOpen, contactOpen]);

  // ── Scrubber Seeking via Trackline Click (0 to 100%) ──
  const handleSeekProgress = useCallback(
    (seekPercent: number) => {
      const targetSection = Math.min(3, Math.floor(seekPercent / 25));
      const sectionOffsetRatio = (seekPercent % 25) / 25;

      if (targetSection !== activeSectionIdxRef.current) {
        goToSection(targetSection);
        setTimeout(() => {
          if (lenisRef.current) {
            const limit = lenisRef.current.limit;
            lenisRef.current.scrollTo(limit * sectionOffsetRatio, { immediate: true });
          }
        }, 800);
      } else {
        if (lenisRef.current) {
          const limit = lenisRef.current.limit;
          lenisRef.current.scrollTo(limit * sectionOffsetRatio, { immediate: false, duration: 0.8 });
        }
      }
    },
    [goToSection]
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuOpen) setMenuOpen(false);
        if (contactOpen) setContactOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, contactOpen]);

  // Two-Step Boundary Guard Wheel Listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let wheelDebounceTimeout: ReturnType<typeof setTimeout> | null = null;
    let accumulatedDeltaY = 0;

    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (isTransitioningRef.current || now < transitionLockUntilRef.current || menuOpen || contactOpen) {
        e.preventDefault();
        return;
      }

      const currentScroll = lenisRef.current ? lenisRef.current.scroll : container.scrollTop;
      const maxScroll = lenisRef.current
        ? lenisRef.current.limit
        : container.scrollHeight - container.clientHeight;

      const isStrictlyAtBottom = maxScroll > 0 ? currentScroll >= maxScroll - 6 : true;
      const isStrictlyAtTop = currentScroll <= 6;

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
            goToSection(cur + 1);
          }
        }
      } else if (e.deltaY < 0) {
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
            goToSection(cur - 1);
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
      if (isTransitioningRef.current || now < transitionLockUntilRef.current || menuOpen || contactOpen) {
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
      } else if (diffY < 0) {
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
  }, [goToSection, menuOpen, contactOpen]);

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

      {/* ── Contact & Resume Modal ── */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
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

            {/* Menu Trigger */}
            <button
              onClick={() => {
                audio.sfx("click");
                setMenuOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#1c1916] border border-[#4a4035] hover:border-[#e8a045] text-[#f0ebe3] text-xs font-mono font-bold active:scale-95 transition-all cursor-pointer shadow-md group"
            >
              <List size={16} className="text-[#e8a045] group-hover:rotate-90 transition-transform" />
              <span>MENU</span>
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
              STAGE 0: PROLOGUE / HERO (3D MASTER ALBUM HUB)
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 0 && (
            <CenterStageHero
              isPlaying={isPlaying}
              onExploreTracks={() => goToSection(1)}
              onOpenContact={() => setContactOpen(true)}
              accentColor={currentSectionConfig.accent}
            />
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 1: PROJECTS / SCROLL-DRIVEN PARALLAX STREAM
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 1 && (
            <ParallaxDiscography
              activeTrackIdx={activeTrackIdx}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 2: EXPERIENCE & EDUCATION
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 2 && (
            <div className="space-y-10 md:space-y-12 animate-[fadeIn_0.5s_ease-out]">
              <div className="space-y-3 pb-6 border-b border-[#2a2520]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#f472b6]">
                  <Briefcase size={14} />
                  <span>WORK EXPERIENCE</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  WORK EXPERIENCE.
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-[#a89880] max-w-xl font-mono leading-relaxed">
                  Professional background building scalable backend services, retail POS systems, and mentoring developers.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Experience Cards */}
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
                            {session.period}
                          </span>
                          <h3 className="text-lg sm:text-2xl font-bold text-[#f0ebe3]">
                            {session.role} @ {session.company}
                          </h3>
                          <p className="text-xs font-mono text-[#a89880] mt-0.5">
                            {session.client}
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
                            CURRENT POSITION
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

                {/* Sidebar: Education */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#141210] border border-[#332d26] rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#5c5248] uppercase border-b border-[#2a2520] pb-3">
                      <GraduationCap size={16} className="text-[#e8a045]" />
                      <span>EDUCATION</span>
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
                      <span>DEVELOPMENT PRINCIPLES</span>
                    </div>
                    <p className="text-xs text-[#a89880] leading-relaxed font-mono">
                      Clean Architecture, automated diff-based linting (Husky + Commitlint), database query optimization, and structured API error handling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 3: SKILLS & TECH STACK
          ════════════════════════════════════════════════════════════════════ */}
          {activeSectionIdx === 3 && (
            <div className="space-y-10 md:space-y-12 animate-[fadeIn_0.5s_ease-out]">
              <div className="space-y-3 pb-6 border-b border-[#2a2520]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#2dd4bf]">
                  <Cpu size={14} />
                  <span>SKILLS & TECHNOLOGIES</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  TECH STACK.
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-[#a89880] max-w-xl font-mono leading-relaxed">
                  Technical proficiencies across backend development, database management, cloud services, and code quality tools.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {SKILLS.map((cat, i) => (
                  <div
                    key={i}
                    className="bg-[#141210] border border-[#332d26] rounded-2xl p-6 hover:border-[#4a4035] transition-colors space-y-4 shadow-lg"
                  >
                    <div className="border-b border-[#2a2520] pb-3">
                      <h3 className="text-sm font-bold text-[#f0ebe3] uppercase">
                        {cat.category}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {cat.items.map((skill, j) => (
                        <div key={j} className="flex items-center justify-between text-xs">
                          <span className="text-[#dcd5cc] font-medium">{skill}</span>
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

      {/* ── Persistent Bottom Music Player Bar with Dynamic Section Metadata ── */}
      <PlayerBar
        currentTrack={currentTrack}
        activeSection={currentSectionConfig}
        activeSectionIdx={activeSectionIdx}
        scrollProgress={scrollProgress}
        onPrevSection={handlePrevSection}
        onNextSection={handleNextSection}
        onSeekProgress={handleSeekProgress}
      />
    </div>
  );
}
