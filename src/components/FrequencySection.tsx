import React from "react";
import { SlidersHorizontal, Waveform } from "@phosphor-icons/react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export const FrequencySection: React.FC = () => {
  return (
    <section id="frequencies" className="py-24 px-4 md:px-8 border-b border-[#262630] bg-[#0d0d10]">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262630] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121216] border border-[#262630] text-xs font-mono text-[#00f076] mb-3">
              <SlidersHorizontal size={14} className="text-[#00f076]" />
              <span>02 / EQUALIZER & MASTERING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f4f4f6]">
              CORE FREQUENCIES.
            </h2>
          </div>
          <p className="text-sm text-[#9090a0] font-mono max-w-md leading-relaxed">
            Calibrated technical competencies across data persistence, domain logic, microservices, and cloud infrastructure.
          </p>
        </div>

        {/* Faders / Mixing Console Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PORTFOLIO_DATA.frequencies.map((freq, idx) => (
            <div
              key={idx}
              className="bg-[#121216] border border-[#262630] hover:border-[#3a3a48] rounded-xl p-6 flex flex-col justify-between space-y-6 transition-all group"
            >
              {/* Top Band Meta */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#5c5c6e] mb-1">
                  <span>{freq.band}</span>
                  <span className="text-[#00f076] font-bold">{freq.gainDb}</span>
                </div>
                <h3 className="text-lg font-bold text-[#f4f4f6] group-hover:text-[#00f076] transition-colors">
                  {freq.label}
                </h3>
              </div>

              {/* Virtual Fader Slider Representation */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-[#5c5c6e]">
                  <span>VU METER</span>
                  <span>{freq.level}%</span>
                </div>
                <div className="w-full h-3 bg-[#0a0a0c] border border-[#262630] rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00c460] to-[#00f076] transition-all duration-700"
                    style={{ width: `${freq.level}%` }}
                  />
                </div>
              </div>

              {/* Skills Pill List */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5c5c6e] uppercase">
                  <Waveform size={13} className="text-[#00f076]" />
                  <span>INSTRUMENTS & TOOLS</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {freq.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-[#1a1a22] border border-[#262630] text-[#f4f4f6]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Note / Philosophy */}
              <p className="text-xs text-[#9090a0] border-t border-[#262630] pt-4 leading-relaxed font-mono">
                {freq.note}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
