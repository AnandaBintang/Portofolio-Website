// Shared AlbumArt component - SVG-based abstract art per track
import React from "react";
import type { Track } from "../data/tracks";

interface AlbumArtProps {
  track: Track;
  size?: number;
  className?: string;
  spinning?: boolean;
}

export const AlbumArt: React.FC<AlbumArtProps> = ({ track, size = 120, className = "", spinning = false }) => {
  // Generate unique abstract art from track id (deterministic)
  const seed = track.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rings = 4;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${track.artAccent}22 0%, #0f0d0b 100%)`,
        boxShadow: `0 0 40px ${track.artAccent}30, inset 0 0 30px rgba(0,0,0,0.5)`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          animation: spinning ? "vinyl-spin 8s linear infinite" : "none",
        }}
      >
        {/* Background circles - vinyl grooves */}
        {[...Array(rings + 2)].map((_, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={((i + 1) / (rings + 2)) * (size * 0.46)}
            fill="none"
            stroke={track.artAccent}
            strokeWidth={i === 0 ? 1.5 : 0.5}
            opacity={0.15 - i * 0.02}
          />
        ))}
        {/* Abstract pattern based on seed */}
        {[...Array(6)].map((_, i) => {
          const angle = ((seed * (i + 1) * 137.5) % 360) * (Math.PI / 180);
          const r = (size * 0.28) + (i * size * 0.03);
          const x1 = cx + Math.cos(angle) * r * 0.3;
          const y1 = cy + Math.sin(angle) * r * 0.3;
          const x2 = cx + Math.cos(angle) * r;
          const y2 = cy + Math.sin(angle) * r;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={track.artAccent} strokeWidth="1" opacity="0.3" />
          );
        })}
        {/* Center hole */}
        <circle cx={cx} cy={cy} r={size * 0.06} fill="#0f0d0b" stroke={track.artAccent} strokeWidth="1" opacity="0.6" />
        <circle cx={cx} cy={cy} r={size * 0.015} fill={track.artAccent} opacity="0.8" />
        {/* Track number text */}
        <text
          x={cx}
          y={cy - size * 0.12}
          textAnchor="middle"
          fontSize={size * 0.12}
          fill={track.artAccent}
          fontFamily="monospace"
          opacity="0.5"
        >
          {track.trackNo}
        </text>
      </svg>
    </div>
  );
};
