"use client";
import React, { useEffect, useRef } from "react";
import { audio } from "../lib/audioEngine";

interface WaveformProps {
  isPlaying: boolean;
  className?: string;
  barCount?: number;
  height?: number;
  accent?: string;
}

export const Waveform: React.FC<WaveformProps> = ({
  isPlaying,
  className = "",
  barCount = 24,
  height = 32,
  accent = "#e8a045",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      timeRef.current += 0.05;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const rawData = isPlaying ? audio.getFreqData() : null;
      const barW = W / barCount - 1;

      for (let i = 0; i < barCount; i++) {
        let bh: number;
        if (isPlaying && rawData && rawData.length > 0) {
          const idx = Math.floor((i / barCount) * rawData.length);
          bh = Math.max(3, (rawData[idx] / 255) * H * 0.9);
        } else {
          bh = Math.max(3, 6 + Math.sin(timeRef.current + i * 0.4) * 4 + Math.cos(timeRef.current * 0.7 + i * 0.2) * 3);
        }

        const x = i * (barW + 1);
        const y = (H - bh) / 2;
        const alpha = isPlaying ? 0.9 : 0.35;

        ctx.fillStyle = accent + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.fillRect(x, y, barW, bh);
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, barCount, height, accent]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 5}
      height={height}
      className={`block ${className}`}
      style={{ width: "100%", height: `${height}px` }}
    />
  );
};
