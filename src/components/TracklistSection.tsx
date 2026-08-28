import React, { useState } from "react";
import { Play, CaretDown, CaretUp, ArrowSquareOut, GithubLogo, CheckCircle, Cpu } from "@phosphor-icons/react";
import { PORTFOLIO_DATA, type ProjectTrack } from "../data/portfolioData";
import { audioEngine } from "../lib/audioEngine";

export const TracklistSection: React.FC = () => {
  const [activeTrackId, setActiveTrackId] = useState<string>(PORTFOLIO_DATA.projects[0].id);

  const handleTrackClick = (track: ProjectTrack) => {
    audioEngine.playClickSfx();
    setActiveTrackId(prev => (prev === track.id ? "" : track.id));
  };

  return (
    <section id="projects" className="py-24 px-4 md:px-8 border-b border-[#262630] bg-[#0a0a0c]">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262630] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121216] border border-[#262630] text-xs font-mono text-[#00f076] mb-3">
              <span>01 / DISCOGRAPHY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f4f4f6]">
              SELECTED TRACKLIST.
            </h2>
          </div>
          <p className="text-sm text-[#9090a0] font-mono max-w-md leading-relaxed">
            Engineered systems delivered for high-scale enterprise operations, microservices workflows, and production APIs.
          </p>
        </div>

        {/* Tracklist Table / Card Grid */}
        <div className="space-y-4">
          {PORTFOLIO_DATA.projects.map((track, idx) => {
            const isExpanded = activeTrackId === track.id;

            return (
              <div
                key={track.id}
                className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "bg-[#121216] border-[#00f076]/40 shadow-xl"
                    : "bg-[#0f0f13] border-[#262630] hover:border-[#3a3a48]"
                }`}
              >
                {/* Track Row Bar */}
                <div
                  onClick={() => handleTrackClick(track)}
                  className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                      isExpanded ? "bg-[#00f076] text-black" : "bg-[#1a1a22] text-[#9090a0] border border-[#3a3a48]"
                    }`}>
                      {isExpanded ? <Play size={16} weight="fill" /> : `0${idx + 1}`}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#5c5c6e]">{track.trackNumber}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1a1a22] text-[#00f076] border border-[#262630]">
                          {track.category}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#f4f4f6] mt-0.5">
                        {track.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-[#262630]/60">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] font-mono text-[#5c5c6e] block uppercase">SCALE / SCOPE</span>
                      <span className="text-xs font-mono text-[#f4f4f6]">{track.metrics}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#9090a0]">
                      <span>{track.duration}</span>
                      <button className="p-1.5 rounded-full hover:bg-[#1a1a22] text-[#9090a0]">
                        {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Technical Liner Notes */}
                {isExpanded && (
                  <div className="px-5 pb-6 md:px-6 md:pb-8 pt-2 border-t border-[#262630] space-y-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                      
                      {/* Description & Key Deliverables */}
                      <div className="lg:col-span-8 space-y-4">
                        <div>
                          <h4 className="text-xs font-mono text-[#5c5c6e] uppercase mb-1">ARCHITECTURAL OVERVIEW</h4>
                          <p className="text-sm sm:text-base text-[#9090a0] leading-relaxed">
                            {track.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono text-[#5c5c6e] uppercase mb-2">ENGINEERING DELIVERABLES</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {track.keyDeliverables.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2 text-xs text-[#f4f4f6] bg-[#1a1a22] p-3 rounded border border-[#262630]">
                                <CheckCircle size={15} weight="fill" className="text-[#00f076] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Tech Stack & Outbound Links */}
                      <div className="lg:col-span-4 bg-[#1a1a22] p-5 rounded-lg border border-[#262630] space-y-4">
                        <div>
                          <h4 className="text-xs font-mono text-[#5c5c6e] uppercase mb-2 flex items-center gap-1.5">
                            <Cpu size={14} className="text-[#00f076]" />
                            <span>STACK FREQUENCIES</span>
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {track.stack.map((tech, techIdx) => (
                              <span key={techIdx} className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#121216] border border-[#3a3a48] text-[#f4f4f6]">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#262630] flex flex-wrap gap-3">
                          {track.liveUrl && (
                            <a
                              href={track.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00f076] text-black font-semibold text-xs hover:bg-[#00c460] transition-colors"
                            >
                              <span>LIVE ECOSYSTEM</span>
                              <ArrowSquareOut size={14} weight="bold" />
                            </a>
                          )}
                          {track.githubUrl && (
                            <a
                              href={track.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121216] border border-[#3a3a48] text-white font-mono text-xs hover:border-[#00f076] transition-colors"
                            >
                              <GithubLogo size={15} weight="fill" />
                              <span>SOURCE REPO</span>
                            </a>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
