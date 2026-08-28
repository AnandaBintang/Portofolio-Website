import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CaretRight,
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
} from "@phosphor-icons/react";
import { TRACKS, PROJECTS, SKILLS, SESSIONS, PROFILE, type Track } from "./data/tracks";
import { StickyAudioDeck } from "./components/StickyAudioDeck";
import { PlayerBar } from "./components/PlayerBar";
import { audio } from "./lib/audioEngine";

gsap.registerPlugin(ScrollTrigger);

// Global window reference for scroll trigger accessibility
declare global {
  interface Window {
    __portfolioScrollTo?: (idx: number) => void;
  }
}

export default function App() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  const currentTrack: Track = TRACKS[activeIdx] || TRACKS[0];

  // Sync audio playing state
  useEffect(() => {
    return audio.onStateChange(setIsPlaying);
  }, []);

  // Smooth scroll handler
  const scrollToChapter = (idx: number) => {
    audio.sfx("click");
    const target = document.getElementById(`chapter-${idx}`);
    if (target) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -90, duration: 1.2 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  // Expose global scroll for easy debugging and synthetic triggers
  useEffect(() => {
    window.__portfolioScrollTo = scrollToChapter;
  }, []);

  // Initialize Lenis Smooth Scroll + GSAP ScrollTrigger
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

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Bind ScrollTrigger to all chapter sections for dynamic player & deck syncing
    const sections = document.querySelectorAll<HTMLElement>("[data-chapter-index]");
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const idx = Number(section.dataset.chapterIndex);
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top center+=120",
        end: "bottom center",
        onEnter: () => setActiveIdx(idx),
        onEnterBack: () => setActiveIdx(idx),
      });
      triggers.push(st);
    });

    // Reveal animations for narrative cards
    const cards = document.querySelectorAll(".story-reveal");
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      triggers.forEach((t) => t.kill());
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
    };
  }, []);

  const handlePrev = () => {
    audio.sfx("prev");
    const prevIdx = activeIdx > 0 ? activeIdx - 1 : TRACKS.length - 1;
    scrollToChapter(prevIdx);
  };

  const handleNext = () => {
    audio.sfx("next");
    const nextIdx = activeIdx < TRACKS.length - 1 ? activeIdx + 1 : 0;
    scrollToChapter(nextIdx);
  };

  return (
    <div
      className="min-h-screen text-[#f0ebe3] selection:bg-[#e8a045] selection:text-black pb-36 relative"
      style={{
        background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${currentTrack.artAccent}15 0%, #0f0d0b 70%)`,
        transition: "background 0.8s ease",
      }}
    >
      {/* Film Grain Texture Overlay */}
      <div className="grain" />

      {/* ── Persistent Top Storyline Navigation Bar ── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#332d26] bg-[#0f0d0b]/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div
            onClick={() => scrollToChapter(0)}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-full border border-[#4a4035] bg-[#1c1916] flex items-center justify-center text-white">
              <svg width="18" height="12" viewBox="0 0 100 62" fill="none">
                <rect x="2" y="2" width="96" height="58" rx="5" fill="#1c1916" stroke="#4a4035" strokeWidth="3" />
                <circle cx="26" cy="31" r="12" fill="#1a1714" stroke="#4a4035" strokeWidth="2" />
                <circle
                  cx="26" cy="31" r="7" fill="none" stroke={currentTrack.artAccent} strokeWidth="2" strokeDasharray="4 3"
                  style={{ transformOrigin: "26px 31px", animation: isPlaying ? "reel-spin 2s linear infinite" : "none" }}
                />
                <circle cx="74" cy="31" r="12" fill="#1a1714" stroke="#4a4035" strokeWidth="2" />
                <circle
                  cx="74" cy="31" r="7" fill="none" stroke={currentTrack.artAccent} strokeWidth="2" strokeDasharray="4 3"
                  style={{ transformOrigin: "74px 31px", animation: isPlaying ? "reel-spin 1.4s linear infinite reverse" : "none" }}
                />
              </svg>
            </div>
            <div>
              <span className="block font-bold text-sm text-[#f0ebe3] group-hover:text-[#e8a045] transition-colors">
                ANANDA BINTANG
              </span>
              <span className="text-[10px] font-mono text-[#5c5248] tracking-widest block uppercase">
                LO-FI AUDIO ARCHITECTURE
              </span>
            </div>
          </div>

          {/* Music Storyline Timeline Tracker */}
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {TRACKS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => scrollToChapter(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer select-none whitespace-nowrap flex items-center gap-1.5 ${
                  i === activeIdx
                    ? "font-bold text-black shadow-md scale-105"
                    : "text-[#5c5248] hover:text-[#a89880] hover:bg-[#1c1916]"
                }`}
                style={i === activeIdx ? { background: currentTrack.artAccent } : {}}
              >
                <span className="opacity-70 text-[10px]">{t.trackNo}</span>
                <span>{t.storyChapter.split(":")[0]}</span>
              </button>
            ))}
          </nav>

          {/* Right Status */}
          <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-[#5c5248] shrink-0">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full transition-colors"
                style={{ background: isPlaying ? "#1db954" : "#5c5248" }}
              />
              {isPlaying ? "LIVE MASTER" : "MUTED"}
            </span>
          </div>

        </div>
      </header>

      {/* ── Main Two-Column Scrollytelling Layout ── */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── Left Column: Sticky Interactive Audio Turntable ── */}
          <aside className="lg:col-span-5 hidden lg:block sticky top-28">
            <StickyAudioDeck
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              activeSectionIdx={activeIdx}
            />
          </aside>

          {/* ── Right Column: Continuous Storytelling Narrative Chapters ── */}
          <div className="lg:col-span-7 space-y-36 pb-20">

            {/* ══════════════════════════════════════════════════════════════
                CHAPTER 00: PROLOGUE: THE ACOUSTIC CORE
            ══════════════════════════════════════════════════════════════ */}
            <section
              id="chapter-0"
              data-chapter-index="0"
              className="min-h-[75vh] flex flex-col justify-center space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#e8a045]">
                  <span>{TRACKS[0].storyChapter}</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#f0ebe3] leading-[1.08]">
                  THE INVISIBLE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a045] via-[#f0ebe3] to-[#a89880]">
                    SIGNAL CHAIN.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-[#a89880] leading-relaxed max-w-xl font-normal">
                  Like warm analog tape mastering, robust backend engineering works in the background: zero latency, clean separation of domain frequencies, and absolute reliability when the volume peaks.
                </p>
              </div>

              <div className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest mb-1.5">
                    CURRENT RESIDENCY
                  </h3>
                  <p className="text-xl font-bold text-[#f0ebe3]">
                    Backend Engineer at Weekend Inc.
                  </p>
                  <p className="text-sm font-mono text-[#e8a045] mt-1">
                    Engineering core platforms for PT HM Sampoerna
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#a89880] leading-relaxed">
                  Specialized in microservices architecture, N+1 query elimination in high-traffic relational databases, clean service layers, and automated pre-commit diff linting pipelines.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {[
                    { label: "STATION", val: "Weekend Inc." },
                    { label: "SCALE", val: "Enterprise Retail" },
                    { label: "RUNTIME", val: "Laravel / Node" },
                    { label: "LOCATION", val: "Sidoarjo / Remote" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#1c1916] border border-[#2a2520] p-3.5 rounded-xl">
                      <span className="text-[10px] font-mono text-[#5c5248] block mb-0.5">{stat.label}</span>
                      <span className="text-xs font-bold text-[#f0ebe3]">{stat.val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#332d26]">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e8a045] text-black text-xs font-bold hover:bg-[#f0b055] transition-all cursor-pointer shadow-md"
                  >
                    <EnvelopeSimple size={15} weight="bold" />
                    <span>TRANSMIT MESSAGE</span>
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#4a4035] text-[#a89880] hover:text-[#f0ebe3] text-xs font-mono transition-all"
                  >
                    <GithubLogo size={15} weight="fill" />
                    <span>GITHUB REPOSITORIES</span>
                  </a>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                CHAPTER 01: AYO KASIR BY SRC (PT HM SAMPOERNA)
            ══════════════════════════════════════════════════════════════ */}
            <section
              id="chapter-1"
              data-chapter-index="1"
              className="min-h-[80vh] flex flex-col justify-center space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#4a9eff]">
                  <span>{TRACKS[1].storyChapter}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  AYO KASIR BY SRC.
                </h2>
                <p className="text-sm font-mono text-[#a89880]">
                  High-Volume POS & Retail Ecosystem | PT HM Sampoerna
                </p>
              </div>

              <div className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                    THE ARCHITECTURAL CHALLENGE
                  </h3>
                  <p className="text-sm sm:text-base text-[#a89880] leading-relaxed">
                    {PROJECTS["ayo-kasir"].description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                    KEY ENGINEERING DELIVERABLES
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {PROJECTS["ayo-kasir"].deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-xs sm:text-sm text-[#f0ebe3]"
                      >
                        <span className="font-mono font-bold text-[#4a9eff] shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <span className="leading-relaxed">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#332d26] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {PROJECTS["ayo-kasir"].stack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#1c1916] border border-[#332d26] text-[#a89880]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={PROJECTS["ayo-kasir"].liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4a9eff] text-black text-xs font-bold hover:bg-[#68aeff] transition-colors"
                  >
                    <span>LIVE ECOSYSTEM</span>
                    <ArrowUpRight size={13} weight="bold" />
                  </a>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                CHAPTER 02: AYO QONCIERGE BY SRC
            ══════════════════════════════════════════════════════════════ */}
            <section
              id="chapter-2"
              data-chapter-index="2"
              className="min-h-[80vh] flex flex-col justify-center space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#5dbf6e]">
                  <span>{TRACKS[2].storyChapter}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  AYO QONCIERGE.
                </h2>
                <p className="text-sm font-mono text-[#a89880]">
                  Staff & Coaching Workflow Platform | Clean Architecture
                </p>
              </div>

              <div className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                    SYSTEM DOMAIN DESIGN
                  </h3>
                  <p className="text-sm sm:text-base text-[#a89880] leading-relaxed">
                    {PROJECTS["ayo-qoncierge"].description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                    CORE CONTRIBUTIONS
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {PROJECTS["ayo-qoncierge"].deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-xs sm:text-sm text-[#f0ebe3]"
                      >
                        <span className="font-mono font-bold text-[#5dbf6e] shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <span className="leading-relaxed">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#332d26] flex flex-wrap gap-2">
                  {PROJECTS["ayo-qoncierge"].stack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#1c1916] border border-[#332d26] text-[#a89880]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                CHAPTER 03: MONEYMATE
            ══════════════════════════════════════════════════════════════ */}
            <section
              id="chapter-3"
              data-chapter-index="3"
              className="min-h-[80vh] flex flex-col justify-center space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#c77dff]">
                  <span>{TRACKS[3].storyChapter}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  MONEYMATE.
                </h2>
                <p className="text-sm font-mono text-[#a89880]">
                  AI Vision Scan & Realtime Carry-Over Budget Platform
                </p>
              </div>

              <div className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                    ALGORITHMIC FINANCIAL PLATFORM
                  </h3>
                  <p className="text-sm sm:text-base text-[#a89880] leading-relaxed">
                    {PROJECTS["moneymate"].description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                    CRITICAL SUBSYSTEMS
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {PROJECTS["moneymate"].deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-xs sm:text-sm text-[#f0ebe3]"
                      >
                        <span className="font-mono font-bold text-[#c77dff] shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <span className="leading-relaxed">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#332d26] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {PROJECTS["moneymate"].stack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#1c1916] border border-[#332d26] text-[#a89880]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={PROJECTS["moneymate"].liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c77dff] text-black text-xs font-mono font-bold hover:bg-[#d699ff] transition-all"
                    >
                      <span>LIVE WEB APP</span>
                      <ArrowUpRight size={13} weight="bold" />
                    </a>
                    <a
                      href={PROJECTS["moneymate"].githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#c77dff] text-[#c77dff] hover:bg-[#c77dff] hover:text-black text-xs font-mono font-bold transition-all"
                    >
                      <span>SOURCE REPO</span>
                      <ArrowUpRight size={13} weight="bold" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                CHAPTER 04: E-COMMERCE & TOP-UP PLATFORM
            ══════════════════════════════════════════════════════════════ */}
            <section
              id="chapter-4"
              data-chapter-index="4"
              className="min-h-[80vh] flex flex-col justify-center space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#fbbf24]">
                  <span>{TRACKS[4].storyChapter}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  TRANSACTION LEDGER.
                </h2>
                <p className="text-sm font-mono text-[#a89880]">
                  High-Throughput E-Commerce & Payment Webhooks
                </p>
              </div>

              <div className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                    TRANSACTION RELIABILITY
                  </h3>
                  <p className="text-sm sm:text-base text-[#a89880] leading-relaxed">
                    {PROJECTS["ecommerce"].description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                    FULFILLMENT PIPELINE
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {PROJECTS["ecommerce"].deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-xs sm:text-sm text-[#f0ebe3]"
                      >
                        <span className="font-mono font-bold text-[#fbbf24] shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <span className="leading-relaxed">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#332d26] flex flex-wrap gap-2">
                  {PROJECTS["ecommerce"].stack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#1c1916] border border-[#332d26] text-[#a89880]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                CHAPTER 05: CORE FREQUENCIES (STUDIO SETUP)
            ══════════════════════════════════════════════════════════════ */}
            <section
              id="chapter-5"
              data-chapter-index="5"
              className="min-h-[80vh] flex flex-col justify-center space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#2dd4bf]">
                  <span>{TRACKS[5].storyChapter}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  STUDIO SETUP.
                </h2>
                <p className="text-sm font-mono text-[#a89880]">
                  Calibrated stack frequencies across all architecture layers
                </p>
              </div>

              <div className="story-reveal grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILLS.map((cat, i) => (
                  <div
                    key={i}
                    className="bg-[#141210] border border-[#332d26] rounded-2xl p-5 hover:border-[#4a4035] transition-colors space-y-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-[#2a2520] pb-3">
                      <span className="text-xs font-mono font-bold text-[#2dd4bf]">
                        BAND 0{i + 1}
                      </span>
                      <span className="text-xs font-mono text-[#5c5248] uppercase">
                        {cat.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {cat.items.map((skill, j) => (
                        <div key={j} className="flex items-center justify-between text-xs">
                          <span className="text-[#f0ebe3] font-medium">{skill}</span>
                          <span className="font-mono text-[#5c5248] text-[11px]">OPTIMIZED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                CHAPTER 06: SESSION LOGBOOK (EXPERIENCE TIMELINE)
            ══════════════════════════════════════════════════════════════ */}
            <section
              id="chapter-6"
              data-chapter-index="6"
              className="min-h-[85vh] flex flex-col justify-center space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1916] border border-[#332d26] text-xs font-mono text-[#f472b6]">
                  <span>{TRACKS[6].storyChapter}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
                  SESSION LOGS.
                </h2>
                <p className="text-sm font-mono text-[#a89880]">
                  Professional session tracks from enterprise to community mentoring
                </p>
              </div>

              <div className="story-reveal space-y-4">
                {SESSIONS.map((session, i) => (
                  <div
                    key={i}
                    className={`bg-[#141210] border rounded-2xl p-6 sm:p-7 transition-all shadow-xl ${
                      session.active ? "border-[#f472b6]/50" : "border-[#332d26]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2520] pb-3.5 mb-4">
                      <div>
                        <span className="text-xs font-mono text-[#f472b6] font-bold block mb-1">
                          REC {session.no} / {session.period}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-[#f0ebe3]">
                          {session.role} @ {session.company}
                        </h3>
                        {session.client && (
                          <p className="text-xs font-mono text-[#a89880] mt-0.5">
                            Client Account: {session.client}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-mono text-[#5c5248]">{session.location}</span>
                    </div>

                    <ul className="space-y-2.5 mb-5">
                      {session.highlights.map((h, j) => (
                        <li key={j} className="text-xs sm:text-sm text-[#a89880] flex items-start gap-2.5 leading-relaxed">
                          <CaretRight size={14} className="text-[#f472b6] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#2a2520]">
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

              {/* Education Block */}
              <div className="story-reveal bg-[#141210] border border-[#332d26] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
                <h3 className="text-xs font-mono text-[#5c5248] uppercase tracking-widest">
                  ACADEMIC FOUNDATION
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#1c1916] p-4 rounded-xl border border-[#2a2520]">
                    <p className="text-base font-bold text-[#f0ebe3]">{PROFILE.education.school}</p>
                    <p className="text-xs text-[#a89880] mt-0.5">{PROFILE.education.degree}</p>
                    <p className="text-xs font-mono text-[#5c5248] mt-2">{PROFILE.education.period}</p>
                  </div>
                  <div className="bg-[#1c1916] p-4 rounded-xl border border-[#2a2520]">
                    <p className="text-base font-bold text-[#f0ebe3]">SMKS Antartika 2 Sidoarjo</p>
                    <p className="text-xs text-[#a89880] mt-0.5">Software Engineering</p>
                    <p className="text-xs font-mono text-[#5c5248] mt-2">Aug 2020 - Jun 2023</p>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>
      </main>

      {/* ── Persistent Bottom Music Player Bar ── */}
      <PlayerBar
        currentTrack={currentTrack}
        currentIdx={activeIdx}
        onPrev={handlePrev}
        onNext={handleNext}
        onTrackSelect={scrollToChapter}
      />
    </div>
  );
}
