import React from "react";
import { Broadcast, Briefcase, GraduationCap, MapPin } from "@phosphor-icons/react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export const SessionSection: React.FC = () => {
  return (
    <section id="sessions" className="py-24 px-4 md:px-8 border-b border-[#262630] bg-[#0a0a0c]">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262630] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121216] border border-[#262630] text-xs font-mono text-[#00f076] mb-3">
              <Broadcast size={14} className="text-[#00f076]" />
              <span>03 / STUDIO LOGBOOK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f4f4f6]">
              SESSION HISTORY.
            </h2>
          </div>
          <p className="text-sm text-[#9090a0] font-mono max-w-md leading-relaxed">
            Professional trajectory spanning enterprise engineering, freelance systems architecture, and community mentoring.
          </p>
        </div>

        {/* Timeline Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Experience Logs */}
          <div className="lg:col-span-8 space-y-4">
            {PORTFOLIO_DATA.sessions.map((session, idx) => (
              <div
                key={idx}
                className="bg-[#121216] border border-[#262630] hover:border-[#3a3a48] rounded-xl p-6 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262630] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1a1a22] text-[#00f076] border border-[#3a3a48]">
                      {session.sessionNo}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#f4f4f6]">
                      {session.role} <span className="text-[#5c5c6e]">@</span> {session.company}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#9090a0]">{session.period}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#5c5c6e]">
                  <MapPin size={13} className="text-[#00f076]" />
                  <span>{session.location}</span>
                </div>

                <ul className="space-y-2">
                  {session.highlights.map((point, pIdx) => (
                    <li key={pIdx} className="text-xs sm:text-sm text-[#9090a0] leading-relaxed flex items-start gap-2">
                      <span className="text-[#00f076] font-mono mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {session.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1a1a22] text-[#f4f4f6] border border-[#262630]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education & Bio Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Education Card */}
            <div className="bg-[#121216] border border-[#262630] rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#5c5c6e] uppercase border-b border-[#262630] pb-3">
                <GraduationCap size={16} className="text-[#00f076]" />
                <span>ACADEMIC FOUNDATION</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#f4f4f6]">
                  {PORTFOLIO_DATA.profile.education.institution}
                </h4>
                <p className="text-xs font-mono text-[#00f076] mt-0.5">
                  {PORTFOLIO_DATA.profile.education.degree}
                </p>
                <p className="text-xs font-mono text-[#5c5c6e] mt-1">
                  {PORTFOLIO_DATA.profile.education.period}
                </p>
              </div>

              <div className="border-t border-[#262630] pt-4">
                <h5 className="text-sm font-semibold text-[#f4f4f6]">SMKS Antartika 2 Sidoarjo</h5>
                <p className="text-xs font-mono text-[#9090a0]">Software Engineering (2020 - 2023)</p>
              </div>
            </div>

            {/* Engineering Standard */}
            <div className="bg-[#1a1a22] border border-[#262630] rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#5c5c6e] uppercase">
                <Briefcase size={15} className="text-[#00f076]" />
                <span>ENGINEERING DISCIPLINE</span>
              </div>
              <p className="text-xs text-[#9090a0] leading-relaxed font-mono">
                Clean Architecture principles, automated diff-based linting (Husky & Commitlint), zero N+1 tolerance, and structured cloud observability.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
