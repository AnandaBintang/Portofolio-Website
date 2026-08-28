import React from "react";

interface SectionTransitionCurtainProps {
  isTransitioning: boolean;
  targetSectionName: string;
  targetSectionSubtitle: string;
  accentColor: string;
}

export const SectionTransitionCurtain: React.FC<SectionTransitionCurtainProps> = ({
  isTransitioning,
  targetSectionName,
  targetSectionSubtitle,
  accentColor,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center transition-all duration-700 ${
        isTransitioning
          ? "opacity-100 backdrop-blur-2xl"
          : "opacity-0 backdrop-blur-none pointer-events-none"
      }`}
      style={{
        background: isTransitioning ? "rgba(10, 8, 7, 0.95)" : "transparent",
      }}
    >
      {/* Tape Scanlines & Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

      {/* Shutter Content Centerpiece */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center p-8 max-w-lg mx-auto text-center space-y-6 transform transition-all duration-500 ${
          isTransitioning ? "scale-100 translate-y-0" : "scale-90 translate-y-8"
        }`}
      >
        {/* Animated Tape Rewind Icon */}
        <div className="relative w-24 h-16 rounded-xl border-2 border-[#4a4035] bg-[#141210] p-2 flex items-center justify-between shadow-2xl">
          {/* Reel Left */}
          <div className="w-8 h-8 rounded-full border border-[#4a4035] bg-[#1c1916] flex items-center justify-center">
            <div
              className="w-5 h-5 rounded-full border border-dashed animate-spin"
              style={{
                borderColor: accentColor,
                animationDuration: "0.4s",
              }}
            />
          </div>

          {/* Center Tape Window */}
          <div className="w-6 h-5 rounded bg-[#0a0807] border border-[#332d26] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1db954] animate-ping" />
          </div>

          {/* Reel Right */}
          <div className="w-8 h-8 rounded-full border border-[#4a4035] bg-[#1c1916] flex items-center justify-center">
            <div
              className="w-5 h-5 rounded-full border border-dashed animate-spin"
              style={{
                borderColor: accentColor,
                animationDuration: "0.4s",
                animationDirection: "reverse",
              }}
            />
          </div>
        </div>

        {/* Shutter Status & Section Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1916] border border-[#332d26] text-[11px] font-mono tracking-widest text-[#a89880]">
            <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
            <span>FAST FORWARDING TAPE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f0ebe3]">
            {targetSectionName}
          </h2>

          <p className="text-xs sm:text-sm font-mono" style={{ color: accentColor }}>
            {targetSectionSubtitle}
          </p>
        </div>

        {/* Progress Loading Bar */}
        <div className="w-48 h-1 bg-[#242018] rounded-full overflow-hidden border border-[#332d26]">
          <div
            className="h-full rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"
            style={{
              background: `linear-gradient(90deg, ${accentColor}, #1db954)`,
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};
