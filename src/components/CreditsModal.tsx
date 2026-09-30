import React from 'react';
import { CHARACTER_ASSETS } from '../data/words';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#06070e]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12162a] border border-[#10cfe6]/40 max-w-lg w-full rounded-xl p-6 shadow-2xl relative flex flex-col gap-4 text-[#e1e1f4] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#1a1f38] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10cfe6] text-[22px]">menu_book</span>
            <h3 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
              Lexicon Credits & Licences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a1f38] hover:bg-[#272937] flex items-center justify-center text-[#8d95b5] hover:text-white transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1f38]/70 border border-[#10cfe6]/20">
          <img
            src={CHARACTER_ASSETS.mwLogo}
            alt="Merriam-Webster's Collegiate Dictionary with Audio"
            className="w-[50px] h-[50px] object-contain rounded-full shadow-md bg-white p-0.5 shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-headline text-xs text-[#10cfe6] uppercase tracking-wider font-bold">
              Official Dictionary Partner
            </span>
            <span className="font-headline text-sm text-white font-bold leading-snug">
              Merriam-Webster's Collegiate® Dictionary with Audio
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 text-xs text-[#8d95b5] font-mono-arcade leading-relaxed">
          <p>
            Word definitions, phonetic pronunciation guides, parts of speech, and sample contextual usage
            are referenced from <strong className="text-white">Merriam-Webster's Collegiate® Dictionary with Audio</strong>.
          </p>
          <p>
            The mathematical candidate reduction matrices and vocabulary trees utilized in <strong className="text-[#a54ed7]">Illucia's Reverse Deduction Protocol</strong> incorporate open benchmark datasets:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#f1f2fa] pl-1">
            <li><strong>ENABLE (Enhanced North American Benchmark Lexicon)</strong> — Public Domain.</li>
            <li><strong>WordNet 3.0</strong> — Princeton University Cognitive Science Laboratory.</li>
            <li>Frequency occurrence spectrums calibrated against standard English corpus heuristics.</li>
          </ul>
          <p className="text-[11px] text-[#525975] pt-1">
            Hangman: Rescue Mission © 2024. All character likenesses (Artsy, Prof. Han Fastolfe, Illucia) are property of their respective creators. No telemetry or secret pilot credentials are transferred to external relays.
          </p>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#1a1f38]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1a1f38] hover:bg-[#272937] text-[#10cfe6] font-headline text-xs font-bold uppercase tracking-wider rounded-lg border border-[#10cfe6]/30 transition-all hover:shadow-[0_0_12px_rgba(16,207,230,0.3)]"
          >
            Acknowledge & Return
          </button>
        </div>
      </div>
    </div>
  );
};
