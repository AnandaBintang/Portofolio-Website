import React from "react";
import { EnvelopeSimple, WhatsappLogo, GithubLogo, InstagramLogo, ArrowUpRight } from "@phosphor-icons/react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { audioEngine } from "../lib/audioEngine";

export const ContactSection: React.FC = () => {
  return (
    <footer id="contact" className="py-24 px-4 md:px-8 border-b border-[#262630] bg-[#0d0d10] relative">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* Top Split CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-[#262630] pb-16">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121216] border border-[#262630] text-xs font-mono text-[#00f076]">
              <span>04 / MASTER OUT TERMINAL</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#f4f4f6] leading-tight">
              LET'S ENGINEER <br />
              <span className="text-[#00f076]">SOMETHING RESILIENT.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#9090a0] max-w-xl leading-relaxed">
              Open for backend engineering roles, high-scale microservices development, and technical consulting.
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#121216] border border-[#262630] rounded-xl p-6 space-y-6">
            <div>
              <span className="text-xs font-mono text-[#5c5c6e] block uppercase">DIRECT TRANSMISSION</span>
              <a
                href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                onClick={() => audioEngine.playClickSfx()}
                className="text-lg font-bold text-[#f4f4f6] hover:text-[#00f076] transition-colors break-all"
              >
                {PORTFOLIO_DATA.profile.email}
              </a>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#262630]">
              <a
                href={`https://wa.me/6285330632334`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioEngine.playClickSfx()}
                className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a22] hover:bg-[#262630] border border-[#3a3a48] text-xs font-mono text-white transition-all"
              >
                <div className="flex items-center gap-2">
                  <WhatsappLogo size={16} className="text-[#00f076]" weight="fill" />
                  <span>WHATSAPP DIRECT</span>
                </div>
                <ArrowUpRight size={14} />
              </a>

              <a
                href={PORTFOLIO_DATA.profile.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioEngine.playClickSfx()}
                className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a22] hover:bg-[#262630] border border-[#3a3a48] text-xs font-mono text-white transition-all"
              >
                <div className="flex items-center gap-2">
                  <GithubLogo size={16} weight="fill" />
                  <span>GITHUB REPOSITORIES</span>
                </div>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Metadata & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[#5c5c6e]">
          <div>
            <span className="text-[#9090a0] font-semibold">{PORTFOLIO_DATA.profile.name}</span>
            <span className="mx-2">/</span>
            <span>BACKEND ENGINEER 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={PORTFOLIO_DATA.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00f076] transition-colors"
            >
              <GithubLogo size={18} />
            </a>
            <a
              href={PORTFOLIO_DATA.profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00f076] transition-colors"
            >
              <InstagramLogo size={18} />
            </a>
            <a
              href={`mailto:${PORTFOLIO_DATA.profile.email}`}
              className="hover:text-[#00f076] transition-colors"
            >
              <EnvelopeSimple size={18} />
            </a>
          </div>

          <p className="text-[11px]">
            NETLIFY READY / BUILT WITH VITE & WEB AUDIO API
          </p>
        </div>

      </div>
    </footer>
  );
};
