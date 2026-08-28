import React from "react";
import { SKILLS } from "../../data/tracks";
import { TRACKS } from "../../data/tracks";
import type { Track } from "../../data/tracks";

interface FrequenciesViewProps {
  track: Track;
}

export const FrequenciesView: React.FC<FrequenciesViewProps> = ({ track }) => {
  const freqTrack = TRACKS.find(t => t.id === "frequencies")!;

  return (
    <div className="w-full h-full scrollable">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest mb-1">{track.trackNo} / STUDIO SETUP</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#f0ebe3] mb-1">{track.title}</h1>
          <p className="text-sm font-mono text-[#5c5248]">{track.artist} - {track.album}</p>
        </div>

        {/* Skill grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map((cat, i) => (
            <div
              key={i}
              className="bg-[#1c1916] border border-[#332d26] rounded-xl p-5 hover:border-[#4a4035] transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg" style={{ color: freqTrack.artAccent }}>{cat.icon}</span>
                <p className="text-xs font-mono text-[#a89880] uppercase tracking-wider">{cat.category}</p>
              </div>

              <div className="space-y-2">
                {cat.items.map((skill, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div
                      className="h-1 rounded-full flex-1"
                      style={{
                        background: `linear-gradient(90deg, ${freqTrack.artAccent}40, ${freqTrack.artAccent})`,
                        width: `${65 + (j * 11 + i * 7) % 30}%`,
                        maxWidth: "100%",
                      }}
                    />
                    <span className="text-xs text-[#a89880] shrink-0">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Engineering philosophy */}
        <div className="mt-8 bg-[#1c1916] border border-[#332d26] rounded-xl p-6">
          <p className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest mb-3">ENGINEERING SIGNAL CHAIN</p>
          <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-[#a89880]">
            {["Clean Architecture", "→", "N+1 Elimination", "→", "Structured Logging", "→", "Automated Quality Pipelines", "→", "Production Reliability"].map((s, i) => (
              <span key={i} style={{ color: s === "→" ? freqTrack.artAccent : undefined }}>{s}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
