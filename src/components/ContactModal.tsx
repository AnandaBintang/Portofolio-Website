import React, { useState } from "react";
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  FilePdf,
  GithubLogo,
  LinkedinLogo,
  InstagramLogo,
  ArrowDown,
  Check,
} from "@phosphor-icons/react";
import { PROFILE } from "../data/tracks";

export const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#141210] border border-[#3a332a] rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] space-y-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2520] pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#e8a045] uppercase tracking-widest font-bold block">
              COMMUNICATION CHANNEL
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f0ebe3]">
              Get in Touch.
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#332d26] bg-[#1c1916] text-[#a89880] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ×
          </button>
        </div>

        {/* Contact List */}
        <div className="space-y-3 font-mono text-xs">
          
          {/* Location */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1c1916] border border-[#2a2520]">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-[#e8a045]" />
              <span className="text-[#a89880]">Location</span>
            </div>
            <span className="text-[#f0ebe3] font-medium">{PROFILE.location}</span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1c1916] border border-[#2a2520]">
            <div className="flex items-center gap-3">
              <EnvelopeSimple size={18} className="text-[#e8a045]" />
              <span className="text-[#a89880]">Email</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${PROFILE.email}`}
                className="text-[#f0ebe3] hover:text-[#e8a045] transition-colors font-medium"
              >
                {PROFILE.email}
              </a>
              <button
                onClick={() => handleCopy(PROFILE.email, "email")}
                className="p-1 rounded bg-[#242018] text-[#a89880] hover:text-white transition-colors cursor-pointer"
                title="Copy Email"
              >
                {copiedEmail ? <Check size={12} className="text-[#1db954]" /> : "Copy"}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1c1916] border border-[#2a2520]">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-[#e8a045]" />
              <span className="text-[#a89880]">Phone / WA</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${PROFILE.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f0ebe3] hover:text-[#e8a045] transition-colors font-medium"
              >
                {PROFILE.phone}
              </a>
              <button
                onClick={() => handleCopy(PROFILE.phone, "phone")}
                className="p-1 rounded bg-[#242018] text-[#a89880] hover:text-white transition-colors cursor-pointer"
                title="Copy Phone"
              >
                {copiedPhone ? <Check size={12} className="text-[#1db954]" /> : "Copy"}
              </button>
            </div>
          </div>

        </div>

        {/* Download Resume / CV CTA */}
        <div className="pt-2">
          <a
            href={PROFILE.resumeUrl}
            download="Ananda_Bintang_Saputra_CV.pdf"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-[#e8a045] text-black font-mono font-bold text-xs hover:bg-[#f0b055] transition-all shadow-lg active:scale-98"
          >
            <FilePdf size={18} weight="bold" />
            <span>DOWNLOAD CURRICULUM VITAE (CV)</span>
            <ArrowDown size={14} weight="bold" />
          </a>
        </div>

        {/* Social Links Row */}
        <div className="border-t border-[#2a2520] pt-4 flex items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[#5c5248]">SOCIAL CHANNELS:</span>

          <div className="flex items-center gap-2">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-[#a89880] hover:text-white hover:border-[#4a4035] transition-all"
              title="GitHub Profile"
            >
              <GithubLogo size={16} />
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-[#a89880] hover:text-[#0a66c2] hover:border-[#4a4035] transition-all"
              title="LinkedIn Profile"
            >
              <LinkedinLogo size={16} />
            </a>

            <a
              href={PROFILE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#1c1916] border border-[#2a2520] text-[#a89880] hover:text-[#e4405f] hover:border-[#4a4035] transition-all"
              title="Instagram Profile"
            >
              <InstagramLogo size={16} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
