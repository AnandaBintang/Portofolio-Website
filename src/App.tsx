import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { audio } from "./lib/audioEngine";

gsap.registerPlugin(ScrollTrigger);

interface TransitionState {
  isTransitioning: boolean;
  name: string;
  subtitle: string;
  accent: string;
}

const SECTION_METADATA: Record<string, { name: string; subtitle: string; accent: string }> = {
  prologue: {
    name: "THE ACOUSTIC PROLOGUE",
    subtitle: "// PROFILE, SPECIALIZATION & RESIDENCY",
    accent: "#e8a045",
  },
  "projects-area": {
    name: "STUDIO DISCOGRAPHY",
    subtitle: "// 4 MASTER PRODUCTION RELEASES",
    accent: "#4a9eff",
  },
  "experience-area": {
    name: "STUDIO MASTER LOGS",
    subtitle: "// CHRONOLOGICAL PRODUCTION SESSIONS",
    accent: "#f472b6",
  },
  "frequencies-area": {
    name: "FREQUENCY BANDS",
    subtitle: "// 6 CALIBRATED EQUALIZER TIERS",
    accent: "#2dd4bf",
  },
};

export default function App() {
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [isProjectsSectionInView, setIsProjectsSectionInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    name: "",
    subtitle: "",
    accent: "#e8a045",
  });

  const lenisRef = useRef<Lenis | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTrack: Track = PLAYABLE_TRACKS[activeTrackIdx] || PLAYABLE_TRACKS[0];

  // Sync audio state
  useEffect(() => {
    return audio.onStateChange(setIsPlaying);
  }, []);

  // Fullscreen transition shutter trigger (Option 1: Cassette Tape Rewind & Shutter)
  const triggerSectionTransition = (targetId: string, customName?: string, customSubtitle?: string, customAccent?: string) => {
    const meta = SECTION_METADATA[targetId] || {
      name: customName || "STUDIO SESSION",
      subtitle: customSubtitle || "// SWITCHING TRACK & MASTER CHANNELS",
      accent: customAccent || currentTrack.artAccent,
    };

    audio.sfx("rewind");

    setTransitionState({
      isTransitioning: true,
      name: meta.name,
      subtitle: meta.subtitle,
      accent: meta.accent,
    });

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Smooth scroll during shutter closure
    setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: -70, immediate: true });
        } else {
          target.scrollIntoView({ behavior: "auto", block: "start" });
        }
      }
    }, 280);

    // Open shutter back
    transitionTimeoutRef.current = setTimeout(() => {
      setTransitionState((prev) => ({ ...prev, isTransitioning: false }));
    }, 650);
  };

  const handlePrevTrack = () => {
    audio.sfx("prev");
    const next = activeTrackIdx > 0 ? activeTrackIdx - 1 : PLAYABLE_TRACKS.length - 1;
    const targetTrack = PLAYABLE_TRACKS[next];
    triggerSectionTransition(`track-${next}`, targetTrack.title, targetTrack.storyChapter, targetTrack.artAccent);
  };

  const handleNextTrack = () => {
    audio.sfx("next");
    const next = activeTrackIdx < PLAYABLE_TRACKS.length - 1 ? activeTrackIdx + 1 : 0;
    const targetTrack = PLAYABLE_TRACKS[next];
    triggerSectionTransition(`track-${next}`, targetTrack.title, targetTrack.storyChapter, targetTrack.artAccent);
  };

  // Initialize Lenis + GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Observer for projects area (where vinyl deck is active)
    const projectsSection = document.getElementById("projects-area");
    if (projectsSection) {
      ScrollTrigger.create({
        trigger: projectsSection,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => setIsProjectsSectionInView(true),
        onLeave: () => setIsProjectsSectionInView(false),
        onEnterBack: () => setIsProjectsSectionInView(true),
        onLeaveBack: () => setIsProjectsSectionInView(false),
      });
    }

    // ScrollTrigger for each playable track
    const trackSections = document.querySelectorAll<HTMLElement>("[data-track-index]");
    const trackTriggers: ScrollTrigger[] = [];

    trackSections.forEach((section) => {
      const idx = Number(section.dataset.trackIndex);
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top center+=100",
        end: "bottom center",
        onEnter: () => setActiveTrackIdx(idx),
        onEnterBack: () => setActiveTrackIdx(idx),
      });
      trackTriggers.push(st);
    });

    // Reveal animations for cards
    const reveals = document.querySelectorAll(".story-reveal");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      trackTriggers.forEach((t) => t.kill());
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className="min-h-screen text-[#f0ebe3] selection:bg-[#e8a045] selection:text-black pb-36 relative"
      style={{
        background: isProjectsSectionInView
          ? `radial-gradient(ellipse 90% 55% at 50% 0%, ${currentTrack.artAccent}15 0%, #0f0d0b 70%)`
          : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,160,69,0.12) 0%, #0f0d0b 70%)",
        transition: "background 0.8s ease",
      }}
    >
      {/* Film Grain Texture */}
      <div className="grain" />

      {/* ── Fullscreen Tape Shutter Section Transition ── */}
      <SectionTransitionCurtain
        isTransitioning={transitionState.isTransitioning}
        targetSectionName={transitionState.name}
        targetSectionSubtitle={transitionState.subtitle}
        accentColor={transitionState.accent}
      />

      {/* ── Fixed Master Header ── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#332d26] bg-[#0f0d0b]/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Callsign */}
          <div
            onClick={() => triggerSectionTransition("prologue")}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-full border border-[#4a4035] bg-[#1c1916] flex items-center justify-center text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8a045] animate-pulse" />
            </div>
            <div>
              <span className="block font-bold text-sm text-[#f0ebe3] group-hover:text-[#e8a045] transition-colors">
                {PROFILE.name.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-[#5c5248] tracking-widest block uppercase">
                {PROFILE.coordinates} · {PROFILE.title.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Navigation Sections with Shutter Transition Triggers */}
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => triggerSectionTransition("prologue")}
              className="px-3.5 py-1.5 rounded-full text-xs font-mono text-[#a89880] hover:text-[#f0ebe3] hover:bg-[#1c1916] transition-all cursor-pointer whitespace-nowrap"
            >
              PROLOGUE
            </button>
            <button
              onClick={() => triggerSectionTransition("projects-area")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                isProjectsSectionInView
                  ? "font-bold text-black shadow-md"
                  : "text-[#a89880] hover:text-[#f0ebe3] hover:bg-[#1c1916]"
              }`}
              style={isProjectsSectionInView ? { background: currentTrack.artAccent } : {}}
            >
              DISCOGRAPHY (PROJECTS)
            </button>
            <button
              onClick={() => triggerSectionTransition("experience-area")}
              className="px-3.5 py-1.5 rounded-full text-xs font-mono text-[#a89880] hover:text-[#f0ebe3] hover:bg-[#1c1916] transition-all cursor-pointer whitespace-nowrap"
            >
              SESSION LOGS
            </button>
            <button
              onClick={() => triggerSectionTransition("frequencies-area")}
              className="px-3.5 py-1.5 rounded-full text-xs font-mono text-[#a89880] hover:text-[#f0ebe3] hover:bg-[#1c1916] transition-all cursor-pointer whitespace-nowrap"
            >
              STUDIO SETUP
            </button>
          </nav>

          {/* Live Audio Status Indicator */}
          <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-[#5c5248] shrink-0">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full transition-colors"
                style={{ background: isPlaying ? "#1db954" : "#5c5248" }}
              />
              {isPlaying ? "AUDIO LIVE" : "BGM READY"}
            </span>
          </div>

        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1: PROLOGUE (CINEMATIC HERO & ARTIST PROFILE)
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="prologue"
        className="min-h-[calc(100vh-4.5rem)] max-w-[1400px] mx-auto px-4 md:px-8 py-16 flex flex-col justify-between border-b border-[#2a2520]"
      >
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5c5248] pb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping" />
            <span className="text-[#1db954] font-medium tracking-wide">ACTIVE ON PRODUCTION PLATFORMS</span>
            <span className="text-[#332d26]">/</span>
            <span>PT HM SAMPOERNA (WEEKEND INC.)</span>
          </div>
          <div>
            <span>SYSTEM LATENCY: SUB-100MS OPTIMIZED</span>
          </div>
        </div>

        {/* Hero Main Grid: Photo + Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-6">
          
          {/* Left: Headline & Bio */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#e8a045]">
              <TerminalWindow size={14} className="text-[#e8a045]" />
              <span>THE INVISIBLE SIGNAL CHAIN</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f0ebe3] leading-[1.02]">
              ARCHITECTING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a045] via-[#f0ebe3] to-[#a89880]">
                INVISIBLE ENGINES.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#a89880] leading-relaxed max-w-2xl font-normal">
              {PROFILE.subheadline}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => triggerSectionTransition("projects-area")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e8a045] text-black font-semibold text-xs font-mono hover:bg-[#f0b055] transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <span>ENTER DISCOGRAPHY</span>
                <ArrowDown size={14} weight="bold" />
              </button>

              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c1916] border border-[#4a4035] text-[#f0ebe3] font-mono text-xs hover:border-[#e8a045] transition-all cursor-pointer"
              >
                <EnvelopeSimple size={14} />
                <span>TRANSMIT MESSAGE</span>
              </a>

              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c1916] border border-[#332d26] text-[#a89880] hover:text-[#f0ebe3] font-mono text-xs transition-all"
              >
                <GithubLogo size={15} weight="fill" />
                <span>GITHUB REPOSITORIES</span>
              </a>
            </div>
          </div>

          {/* Right: Personal Profile Card & Photography */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-[340px] bg-[#141210] border border-[#332d26] rounded-2xl p-5 shadow-2xl space-y-4 relative group">
              
              {/* Photo Frame with Tape / Analog Details */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-[#4a4035] bg-[#1c1916]">
                <img
                  src={PROFILE.avatarUrl}
                  alt={PROFILE.name}
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Vintage Frame Stamp */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0f0d0b]/80 border border-[#332d26] text-[9px] font-mono text-[#e8a045]">
                  MASTER ARTIST
                </div>
                
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#0f0d0b]/80 border border-[#332d26] text-[9px] font-mono text-[#a89880]">
                  {PROFILE.coordinates}
                </div>
              </div>

              {/* Identity Details */}
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

              {/* Fast Stats List */}
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

        {/* Bottom Transition Prompt */}
        <div className="pt-6 border-t border-[#262630]/60 flex items-center justify-between text-xs font-mono text-[#5c5248]">
          <div className="flex items-center gap-2 text-[#e8a045]">
            <Sparkle size={14} />
            <span>PLAYABLE DISCOGRAPHY AHEAD</span>
          </div>
          <button
            onClick={() => triggerSectionTransition("projects-area")}
            className="flex items-center gap-2 animate-bounce hover:text-[#f0ebe3] transition-colors cursor-pointer"
          >
            <span>CLICK OR SCROLL TO ENTER THE STUDIO</span>
            <ArrowDown size={14} />
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2: THE DISCOGRAPHY / PLAYABLE PROJECT TRACKS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="projects-area" className="max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-20 border-b border-[#2a2520]">
        
        {/* Section Lead Banner */}
        <div className="space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#4a9eff]">
            <WaveformIcon size={14} />
            <span>STUDIO DISCOGRAPHY · 4 MASTER TRACKS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
            SELECTED RELEASES.
          </h2>
          <p className="text-sm sm:text-base text-[#a89880] max-w-xl font-mono leading-relaxed">
            Scroll down through each release to engage the turntable deck, analyze frequency distributions, and inspect engineering deliverables.
          </p>
        </div>

        {/* Scrollytelling Two-Column Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sticky Interactive Audio Turntable Deck */}
          <aside className="lg:col-span-5 hidden lg:block sticky top-28">
            <StickyAudioDeck
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              activeSectionIdx={activeTrackIdx}
            />
          </aside>

          {/* Right Column: 4 Track Project Cards */}
          <div className="lg:col-span-7 space-y-36 pb-16">

            {PLAYABLE_TRACKS.map((track, idx) => {
              const project = PROJECTS[track.id];

              return (
                <div
                  key={track.id}
                  id={`track-${idx}`}
                  data-track-index={idx}
                  className="min-h-[75vh] flex flex-col justify-center space-y-6"
                >
                  {/* Track Header & Genre Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span
                        className="px-2.5 py-0.5 rounded font-bold text-black"
                        style={{ background: track.artAccent }}
                      >
                        {track.trackNo}
                      </span>
                      <span className="text-[#a89880]">{track.storyChapter}</span>
                      <span className="text-[#332d26]">/</span>
                      <span className="text-[#5c5248]">{track.bpm} BPM</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f0ebe3]">
                      {track.title}
                    </h3>
                    <p className="text-sm font-mono" style={{ color: track.artAccent }}>
                      {project.tagline}
                    </p>
                  </div>

                  {/* Narrative Card */}
                  <div className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                    
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
                            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-xs sm:text-sm text-[#f0ebe3]"
                          >
                            <span
                              className="font-mono font-bold shrink-0 mt-0.5"
                              style={{ color: track.artAccent }}
                            >
                              0{dIdx + 1}
                            </span>
                            <span className="leading-relaxed">{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stack & Action Links */}
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
                            style={{ background: track.artAccent }}
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
                              borderColor: track.artAccent,
                              color: track.artAccent,
                            }}
                          >
                            <span>SOURCE REPO</span>
                            <ArrowUpRight size={13} weight="bold" />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3: STUDIO MASTER LOGS (EXPERIENCE & EDUCATION)
      ════════════════════════════════════════════════════════════════════ */}
      <section id="experience-area" className="max-w-[1400px] mx-auto px-4 md:px-8 py-24 border-b border-[#2a2520]">
        <div className="space-y-3 mb-16">
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
                className={`story-reveal bg-[#141210] border rounded-2xl p-6 sm:p-8 transition-all shadow-xl ${
                  session.active ? "border-[#f472b6]/50" : "border-[#332d26]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2520] pb-4 mb-4">
                  <div>
                    <span className="text-xs font-mono text-[#f472b6] font-bold block mb-1">
                      {session.tapeId} · {session.period}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#f0ebe3]">
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

          {/* Sidebar: Academic Foundation & Discipline Standards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Academic Plaque */}
            <div className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 space-y-6 shadow-xl">
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

            {/* Quality Standard */}
            <div className="story-reveal bg-[#1c1916] border border-[#332d26] rounded-2xl p-6 space-y-3 shadow-lg">
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
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4: STUDIO SETUP (FREQUENCY BANDS / SKILLS)
      ════════════════════════════════════════════════════════════════════ */}
      <section id="frequencies-area" className="max-w-[1400px] mx-auto px-4 md:px-8 py-24">
        <div className="space-y-3 mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((cat, i) => (
            <div
              key={i}
              className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 hover:border-[#4a4035] transition-colors space-y-5 shadow-lg"
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
      </section>

      {/* ── Persistent Bottom Music Player Bar ── */}
      <PlayerBar
        currentTrack={currentTrack}
        currentIdx={activeTrackIdx}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onTrackSelect={(idx) => {
          const target = PLAYABLE_TRACKS[idx];
          triggerSectionTransition(`track-${idx}`, target.title, target.storyChapter, target.artAccent);
        }}
      />
    </div>
  );
}
