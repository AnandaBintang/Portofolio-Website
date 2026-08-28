import React, { useEffect, useRef } from "react";
import { audioEngine } from "../lib/audioEngine";

interface VisualizerCanvasProps {
  isPlaying: boolean;
  className?: string;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ isPlaying, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Get real frequency data or synthesize ambient wave
      const freqData = isPlaying ? audioEngine.getFrequencyData() : null;

      // Draw Oscilloscope Waveform & Equalizer Bars
      const numBars = 32;
      const barWidth = (width / numBars) - 2;

      // Subtle background grid lines
      ctx.strokeStyle = "rgba(40, 40, 52, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw dynamic frequency bars
      for (let i = 0; i < numBars; i++) {
        let barHeight = 6;
        if (isPlaying && freqData && freqData.length > 0) {
          const val = freqData[i % freqData.length] || 0;
          barHeight = Math.max(6, (val / 255) * (height * 0.85));
        } else {
          // Idle floating wave calculation
          const idleWave = Math.sin(time + i * 0.25) * 8 + Math.cos(time * 0.5 + i * 0.1) * 6;
          barHeight = Math.max(4, 12 + idleWave);
        }

        const x = i * (barWidth + 2);
        const y = height / 2 - barHeight / 2;

        // Gradient color from subtle silver to signal green
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, "#00f076");
          gradient.addColorStop(0.5, "#00c460");
          gradient.addColorStop(1, "#007a3c");
        } else {
          gradient.addColorStop(0, "#5c5c6e");
          gradient.addColorStop(1, "#262630");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      // Draw fluid center connection line
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? "rgba(0, 240, 118, 0.7)" : "rgba(144, 144, 160, 0.25)";
      ctx.lineWidth = 1.5;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2) + barWidth / 2;
        let barHeight = 6;
        if (isPlaying && freqData && freqData.length > 0) {
          const val = freqData[i % freqData.length] || 0;
          barHeight = Math.max(6, (val / 255) * (height * 0.85));
        } else {
          const idleWave = Math.sin(time + i * 0.25) * 8;
          barHeight = 12 + idleWave;
        }
        const y = height / 2 - barHeight / 2;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={90}
      className={`w-full h-full block ${className}`}
    />
  );
};
