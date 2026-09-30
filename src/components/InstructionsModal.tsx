import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#06070e]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12162a] border border-[#10cfe6]/40 max-w-lg w-full rounded-xl p-6 shadow-2xl relative flex flex-col gap-4 text-[#e1e1f4] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#1a1f38] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f3f400] text-[22px]">sports_esports</span>
            <h3 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
              Mission Instructions & Pilot Tips
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a1f38] hover:bg-[#272937] flex items-center justify-center text-[#8d95b5] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs font-mono-arcade text-[#8d95b5] leading-relaxed">
          <div className="p-3 rounded-lg bg-[#1a1f38] border border-[#10cfe6]/20 flex flex-col gap-1">
            <span className="font-headline text-[#10cfe6] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">battery_charging_full</span>
              6 Plasma Energy Pods (Zero Gallows)
            </span>
            <p>
              In deep space, there are zero grim gallows. You defend Artsy’s life support pod powered by 6 glowing plasma cells. Each incorrect letter input depletes 1 life cell.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#1a1f38] border border-[#f3f400]/20 flex flex-col gap-1">
            <span className="font-headline text-[#f3f400] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">psychology</span>
              Professor Fastolfe’s Dual Hints
            </span>
            <p>
              Stuck on a tricky cipher? Professor Han Fastolfe provides two distinct tactical advisories:
              <strong className="text-white"> Hint #1</strong> is an etymological clue / synonym;
              <strong className="text-white"> Hint #2</strong> gives situational cosmic context.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#1a1f38] border border-[#3ee07a]/20 flex flex-col gap-1">
            <span className="font-headline text-[#3ee07a] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">palette</span>
              The Revival Art Painting Reward
            </span>
            <p>
              Deciphering the secret word revitalizes Artsy from stasis and unlocks his vibrant galactic artwork directly to your gallery vault, accompanied by Merriam-Webster phonetic audio and definition logs!
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#1a1f38]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#f3f400] hover:bg-white text-[#06070e] font-headline text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_3px_0_#999a00] active:translate-y-0.5 transition-all"
          >
            Understood, Launch!
          </button>
        </div>
      </div>
    </div>
  );
};
