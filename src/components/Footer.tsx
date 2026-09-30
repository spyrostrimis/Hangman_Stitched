import React from 'react';
import { PageId } from '../types';

interface Props {
  onNavigate: (page: PageId) => void;
  onOpenCredits: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenCredits }) => {
  return (
    <footer className="w-full bg-[#06070e] border-t border-[#10cfe6]/25 py-6 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Telemetry Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#3ee07a]">
            <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
            <span className="font-headline text-[10px] uppercase tracking-widest font-bold">
              AUDIO: SYNTH-CORE ONLINE [44.1kHz]
            </span>
          </div>
          <span className="text-[#525975] hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 font-headline text-[10px] text-[#8d95b5]">
            <span className="w-2 h-2 rounded-full bg-[#10cfe6] animate-pulse"></span>
            TELEMETRY LINK: STABLE // ORBITAL BEACON ACTIVE
          </div>
        </div>

        {/* Center / Right Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-center font-mono-arcade text-xs text-[#525975]">
          <span className="text-[#8d95b5]">© 2024 HANGMAN: RESCUE MISSION. ARCADE SPEC 1.09</span>
          <div className="flex items-center gap-3 font-headline text-xs text-[#10cfe6]">
            <button
              onClick={() => onNavigate('homeworld')}
              className="hover:text-white transition-colors uppercase font-bold"
            >
              DISPATCH
            </button>
            <button
              onClick={() => onNavigate('illucia')}
              className="hover:text-white transition-colors uppercase font-bold"
            >
              AI PROTOCOL
            </button>
            <button
              onClick={() => onNavigate('hall-of-fame')}
              className="hover:text-white transition-colors uppercase font-bold"
            >
              LEADERBOARD
            </button>
            <button
              onClick={onOpenCredits}
              className="hover:text-[#f3f400] transition-colors uppercase font-bold underline"
            >
              CREDITS & LICENCES
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
