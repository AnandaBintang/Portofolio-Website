import React from "react";
import { SESSIONS, PROFILE } from "../../data/tracks";
import type { Track } from "../../data/tracks";

interface SessionsViewProps {
  track: Track;
}

export const SessionsView: React.FC<SessionsViewProps> = ({ track }) => {
  return (
    <div className="w-full h-full scrollable">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest mb-1">{track.trackNo} / LOGBOOK</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#f0ebe3] mb-1">{track.title}</h1>
          <p className="text-sm font-mono text-[#5c5248]">{track.artist} - {track.album}</p>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {SESSIONS.map((session, i) => (
            <div
              key={i}
              className={`bg-[#1c1916] border rounded-xl p-6 transition-all ${
                session.active
                  ? "border-[#4a4035]"
                  : "border-[#332d26]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded border"
                    style={{
                      color: track.artAccent,
                      borderColor: track.artAccent + "40",
                      background: track.artAccent + "10",
                    }}
                  >
                    REC {session.no}
                  </span>
                  <div>
                    <p className="font-semibold text-[#f0ebe3]">{session.role}</p>
                    <p className="text-sm text-[#a89880]">
                      {session.company}
                      {session.client && <span className="text-[#5c5248]"> for {session.client}</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-[#5c5248]">{session.period}</p>
                  <p className="text-xs text-[#5c5248]">{session.location}</p>
                </div>
              </div>

              {session.active && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#1db954] pulse" />
                  <span className="text-xs font-mono text-[#1db954]">CURRENTLY ACTIVE</span>
                </div>
              )}

              <ul className="space-y-1.5">
                {session.highlights.map((h, j) => (
                  <li key={j} className="text-sm text-[#a89880] flex items-start gap-2">
                    <span style={{ color: track.artAccent }} className="mt-1 shrink-0 text-xs">-</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-[#332d26]">
                {session.tags.map((tag, j) => (
                  <span key={j} className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#242018] border border-[#332d26] text-[#a89880]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mt-8 bg-[#1c1916] border border-[#332d26] rounded-xl p-6">
          <p className="text-[10px] font-mono text-[#5c5248] uppercase tracking-widest mb-4">ACADEMIC FOUNDATION</p>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="font-semibold text-[#f0ebe3]">{PROFILE.education.school}</p>
              <p className="text-sm text-[#a89880]">{PROFILE.education.degree}</p>
              <p className="text-xs font-mono text-[#5c5248] mt-1">{PROFILE.education.period}</p>
            </div>
            <div>
              <p className="font-semibold text-[#f0ebe3]">SMKS Antartika 2</p>
              <p className="text-sm text-[#a89880]">Software Engineering</p>
              <p className="text-xs font-mono text-[#5c5248] mt-1">Aug 2020 - Jun 2023</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
