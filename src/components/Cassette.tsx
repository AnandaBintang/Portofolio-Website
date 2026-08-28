// Cassette tape SVG component with animated reels
import React from "react";

interface CassetteProps {
  isPlaying: boolean;
  accentColor?: string;
  size?: number;
}

export const Cassette: React.FC<CassetteProps> = ({
  isPlaying,
  accentColor = "#e8a045",
  size = 64,
}) => {
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 100 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cassette body */}
      <rect x="2" y="2" width="96" height="58" rx="5" ry="5" fill="#1c1916" stroke="#4a4035" strokeWidth="1.5" />

      {/* Label area */}
      <rect x="12" y="8" width="76" height="30" rx="3" fill="#242018" />

      {/* Label text placeholder lines */}
      <rect x="18" y="13" width="38" height="3" rx="1.5" fill={accentColor} opacity="0.7" />
      <rect x="18" y="20" width="26" height="2" rx="1" fill="#5c5248" />
      <rect x="18" y="26" width="32" height="2" rx="1" fill="#5c5248" />

      {/* Right reel hub area */}
      <circle cx="74" cy="23" r="12" fill="#1a1714" stroke="#4a4035" strokeWidth="1" />
      <circle
        cx="74"
        cy="23"
        r="8"
        fill="none"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        style={{
          transformOrigin: "74px 23px",
          animation: isPlaying ? "reel-spin 1.4s linear infinite" : "none",
        }}
      />
      <circle cx="74" cy="23" r="3" fill={accentColor} opacity="0.8" />

      {/* Left reel hub area */}
      <circle cx="26" cy="23" r="12" fill="#1a1714" stroke="#4a4035" strokeWidth="1" />
      <circle
        cx="26"
        cy="23"
        r="8"
        fill="none"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        style={{
          transformOrigin: "26px 23px",
          animation: isPlaying ? "reel-spin 2s linear infinite reverse" : "none",
        }}
      />
      <circle cx="26" cy="23" r="3" fill={accentColor} opacity="0.8" />

      {/* Tape window (middle section) */}
      <rect x="36" y="16" width="28" height="14" rx="2" fill="#0f0d0b" stroke="#332d26" strokeWidth="1" />
      {/* Tape strand */}
      <path d="M38 23 Q50 26 62 23" stroke="#332d26" strokeWidth="1" fill="none" />

      {/* Bottom screw holes */}
      <circle cx="14" cy="52" r="3" fill="#0f0d0b" stroke="#4a4035" strokeWidth="1" />
      <circle cx="50" cy="52" r="3" fill="#0f0d0b" stroke="#4a4035" strokeWidth="1" />
      <circle cx="86" cy="52" r="3" fill="#0f0d0b" stroke="#4a4035" strokeWidth="1" />

      {/* Play/Pause indicator dot */}
      <circle cx="50" cy="45" r="2" fill={isPlaying ? "#1db954" : "#5c5248"} />
    </svg>
  );
};
