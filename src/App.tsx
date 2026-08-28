import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import { HeaderDeck } from "./components/HeaderDeck";
import { HeroSection } from "./components/HeroSection";
import { TracklistSection } from "./components/TracklistSection";
import { FrequencySection } from "./components/FrequencySection";
import { SessionSection } from "./components/SessionSection";
import { ContactSection } from "./components/ContactSection";
import { audioEngine } from "./lib/audioEngine";

export const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  const handleTogglePlay = () => {
    const nextState = audioEngine.togglePlay((playing) => {
      setIsPlaying(playing);
    });
    setIsPlaying(nextState);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0c] text-[#f4f4f6] selection:bg-[#00f076] selection:text-black">
      <HeaderDeck isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
      <main>
        <HeroSection isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
        <TracklistSection />
        <FrequencySection />
        <SessionSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default App;
