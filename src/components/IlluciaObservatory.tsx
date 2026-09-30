import React, { useState } from 'react';
import { PageId, PlayerProfile } from '../types';
import { CHARACTER_ASSETS } from '../data/words';
import { sound } from '../services/sound';
import { CreditsModal } from './CreditsModal';

interface Props {
  onNavigate: (page: PageId) => void;
  player: PlayerProfile;
}

export const IlluciaObservatory: React.FC<Props> = ({ onNavigate, player }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string>('E');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const SPEEDS = ['1.0X', '2.0X', 'INSTANT'];

  const FREQUENCY_DATA = [
    { letter: 'E', percent: 66, active: true },
    { letter: 'A', percent: 48, active: false },
    { letter: 'T', percent: 42, active: false },
    { letter: 'O', percent: 37, active: false },
    { letter: 'I', percent: 31, active: false },
    { letter: 'N', percent: 28, active: false },
    { letter: 'S', percent: 22, active: false },
    { letter: 'L', percent: 16, active: false }
  ];

  const togglePause = () => {
    sound.playKeyClick();
    setIsPaused(!isPaused);
  };

  const cycleSpeed = () => {
    sound.playKeyClick();
    setSpeedIndex((prev) => (prev + 1) % SPEEDS.length);
  };

  const triggerNewWord = () => {
    sound.playHitSound();
    setToastMessage('CALIBRATING NEW NEURAL MATRIX... TARGET CIPHER RESET');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex flex-col w-full text-[#e1e1f4] select-none pb-12 relative">
      {/* Dynamic Cosmic Background */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('${CHARACTER_ASSETS.backgrounds.observatory}')` }}
      ></div>
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#06070e]/95 via-[#0b0d1a]/85 to-[#06070e]/95"></div>

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-[#f3f400] text-[#06070e] font-headline text-xs uppercase tracking-widest font-bold shadow-[0_0_24px_rgba(243,244,0,0.8)] animate-in fade-in slide-in-from-top-4 duration-200">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-6 relative z-10 pt-4">
        {/* 1. Top Observatory HUD / Mission Bar */}
        <header className="w-full bg-[#12162a]/95 rounded-xl p-4 sm:p-5 shadow-2xl backdrop-blur-md border border-[#10cfe6]/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#a54ed7]/20 text-[#f5d9ff] text-[10px] font-headline uppercase tracking-widest border border-[#a54ed7]/40 shadow-[0_0_12px_rgba(165,78,215,0.4)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a54ed7] animate-pulse"></span>
                  NEURAL OBSERVATORY // REVERSE DEDUCTION PROTOCOL
                </span>
                <span className="text-[#525975] text-xs hidden sm:inline">|</span>
                <span className="text-[#10cfe6] text-xs font-headline uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">radar</span>
                  STAGE: DEEP SPACE TRANSIT // SECTOR ILLUCIA-9
                </span>
              </div>

              <div className="text-[#8d95b5] text-xs font-mono-arcade flex items-center gap-4 flex-wrap pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#525975]">CANDIDATES:</span>
                  <strong className="text-white font-mono-arcade">1,842</strong>
                  <span className="text-[#525975]">/ 11,200</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#1a1f38] text-[9px] text-[#10cfe6] uppercase tracking-wider border border-[#10cfe6]/20">
                    Master Matrix
                  </span>
                </span>
                <span className="hidden md:inline text-[#525975]">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#525975]">CONFIDENCE:</span>
                  <strong className="text-[#3ee07a] font-mono-arcade">94.2%</strong>
                  <span className="material-symbols-outlined text-[14px] text-[#3ee07a]">trending_up</span>
                </span>
                <span className="hidden md:inline text-[#525975]">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#525975]">WORD LENGTH:</span>
                  <strong className="text-[#f3f400] font-mono-arcade">7 LETTERS</strong>
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2.5 bg-[#06070e]/80 px-4 py-1.5 rounded-lg border border-[#10cfe6]/20 shadow-inner">
              <span className="material-symbols-outlined text-[#3ee07a] text-[18px]">verified_user</span>
              <div className="flex flex-col text-left">
                <span className="font-headline text-[10px] text-white uppercase tracking-widest font-bold">
                  REGISTERED PILOT CLEARED
                </span>
                <span className="font-headline text-[8px] text-[#525975] uppercase tracking-tight mt-0.5">
                  ZERO HALL-OF-FAME POINTS EARNED IN DUEL MODE
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. Main Dual Stage Grid: Character Holo Deck & Secret Word Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Illucia Holographic Pedestal & Dialogue (5 Cols) */}
          <section className="lg:col-span-5 flex flex-col gap-4 justify-between bg-[#12162a]/95 rounded-xl p-5 sm:p-6 relative overflow-hidden shadow-2xl border border-[#a54ed7]/30">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a54ed7] shadow-[0_0_10px_#a54ed7]"></span>
                <h2 className="font-headline text-base sm:text-lg tracking-wider text-white uppercase font-bold">
                  ILLUCIA AI // V4.1
                </h2>
              </div>
              <span className="font-headline text-[10px] px-2 py-0.5 rounded bg-[#1a1f38] text-[#10cfe6] tracking-widest uppercase border border-[#10cfe6]/20 font-bold">
                NEURAL PROBE ACTIVE
              </span>
            </div>

            {/* Hologram Stage */}
            <div className="relative flex flex-col items-center justify-center my-auto py-2 z-10">
              <div className="absolute bottom-2 w-64 h-12 bg-gradient-to-t from-[#a54ed7]/40 to-transparent rounded-full blur-md"></div>
              <div className="absolute bottom-0 w-60 h-7 bg-[#272937] rounded-full shadow-[0_0_24px_rgba(165,78,215,0.7)] flex items-center justify-center border border-[#a54ed7]/50">
                <div className="w-44 h-3 rounded-full bg-[#a54ed7]/30 animate-pulse"></div>
              </div>

              <img
                src={CHARACTER_ASSETS.illucia.standing}
                alt="Illucia AI Holographic Avatar"
                className="relative z-10 w-auto h-64 sm:h-72 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] filter contrast-105 illucia-hologram"
              />

              <div className="mt-2 z-10 flex items-center gap-2 bg-[#06070e]/90 px-3 py-1 rounded-full shadow-lg border border-[#3ee07a]/30">
                <span className="w-2 h-2 rounded-full bg-[#3ee07a] animate-ping"></span>
                <span className="font-headline text-[10px] text-white tracking-widest uppercase font-bold">
                  TACTICAL ANALYSIS ENGAGED
                </span>
              </div>
            </div>

            {/* Illucia Speech Bubble */}
            <div className="z-10 bg-[#0b0d1a] border border-[#a54ed7]/30 rounded-xl p-4 shadow-inner relative flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-headline text-[10px] text-[#a54ed7] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  THOUGHT TELEMETRY BROADCAST
                </span>
                <span className="font-mono-arcade text-[10px] text-[#525975] uppercase">LATENCY: 4ms</span>
              </div>

              <p className="font-mono-arcade text-xs text-[#f1f2fa] leading-relaxed">
                “Letter <strong className="text-[#f3f400] font-bold uppercase tracking-wide">E</strong> appears in <span className="text-[#10cfe6] font-bold">66%</span> of the <span className="text-white font-bold">1,842</span> candidate words in my active lexicon! If my predictive matrix holds, your secret word definitely contains an <strong className="text-[#f3f400]">E</strong> or an <strong className="text-[#10cfe6]">A</strong>. Let’s see if you can stump me, Commander!”
              </p>

              <div className="pt-1 flex items-center gap-2 text-xs font-mono-arcade text-[#8d95b5]">
                <span className="material-symbols-outlined text-[#3ee07a] text-[14px]">auto_awesome</span>
                <span className="truncate">
                  Neural certainty climbing: <strong className="text-[#3ee07a]">+14%</strong> since letter R confirmation.
                </span>
              </div>
            </div>
          </section>

          {/* Right Column: Board, Frequency Equalizer & Power Pods (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col gap-4 justify-between">
            {/* Player Secret Word Matrix Panel */}
            <div className="bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl p-5 shadow-2xl relative flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] text-[#525975] uppercase tracking-widest">
                    COMMANDER'S ENCRYPTED CIPHER
                  </span>
                  <h3 className="font-headline text-base text-white tracking-wide uppercase font-bold">
                    YOUR SECRET WORD DECK
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-[#1a1f38] px-3 py-1 rounded-lg border border-[#10cfe6]/20">
                  <span className="text-[#ffb4ab] font-headline text-[10px] font-bold uppercase tracking-wider">
                    2 MISSES
                  </span>
                  <span className="text-[#525975] text-xs">/</span>
                  <span className="text-[#3ee07a] font-headline text-[10px] font-bold uppercase tracking-wider">
                    4 DISCOVERED
                  </span>
                </div>
              </div>

              {/* Word Guess Slots [ _ ] [ E ] [ _ ] [ _ ] [ L ] [ A ] [ R ] */}
              <div className="grid grid-cols-7 gap-2 sm:gap-3 my-1">
                {/* Slot 1: Blank */}
                <div className="aspect-square bg-[#0b0d1a] border border-[#10cfe6]/20 rounded-lg flex flex-col items-center justify-center relative shadow-inner">
                  <span className="font-headline text-2xl sm:text-3xl text-[#a54ed7]/40 font-bold">_</span>
                  <span className="absolute bottom-1 font-headline text-[8px] text-[#525975]">P-01</span>
                </div>
                {/* Slot 2: Solved E */}
                <div className="aspect-square bg-[#1a1f38] border border-[#3ee07a]/60 rounded-lg flex flex-col items-center justify-center relative shadow-[0_0_14px_rgba(62,224,122,0.3)]">
                  <span className="font-headline text-2xl sm:text-3xl text-[#3ee07a] font-bold drop-shadow-[0_0_10px_rgba(62,224,122,0.8)]">
                    E
                  </span>
                  <span className="absolute bottom-1 font-headline text-[8px] text-[#3ee07a]/80 font-bold">
                    CONFIRMED
                  </span>
                </div>
                {/* Slot 3: Target Cursor */}
                <div className="aspect-square bg-[#0b0d1a] border border-[#a54ed7]/50 rounded-lg flex flex-col items-center justify-center relative shadow-inner">
                  <span className="w-5 h-1.5 bg-[#a54ed7] rounded-full animate-bounce shadow-[0_0_8px_#a54ed7]"></span>
                  <span className="absolute bottom-1 font-headline text-[8px] text-[#a54ed7] font-bold">
                    TARGET
                  </span>
                </div>
                {/* Slot 4: Blank */}
                <div className="aspect-square bg-[#0b0d1a] border border-[#10cfe6]/20 rounded-lg flex flex-col items-center justify-center relative shadow-inner">
                  <span className="font-headline text-2xl sm:text-3xl text-[#525975]/40 font-bold">_</span>
                  <span className="absolute bottom-1 font-headline text-[8px] text-[#525975]">P-04</span>
                </div>
                {/* Slot 5: Solved L */}
                <div className="aspect-square bg-[#1a1f38] border border-[#10cfe6]/50 rounded-lg flex flex-col items-center justify-center relative shadow-[0_0_14px_rgba(16,207,230,0.3)]">
                  <span className="font-headline text-2xl sm:text-3xl text-[#10cfe6] font-bold drop-shadow-[0_0_8px_rgba(16,207,230,0.7)]">
                    L
                  </span>
                  <span className="absolute bottom-1 font-headline text-[8px] text-[#10cfe6]/80 font-bold">
                    P-05
                  </span>
                </div>
                {/* Slot 6: Solved A */}
                <div className="aspect-square bg-[#1a1f38] border border-[#10cfe6]/50 rounded-lg flex flex-col items-center justify-center relative shadow-[0_0_14px_rgba(16,207,230,0.3)]">
                  <span className="font-headline text-2xl sm:text-3xl text-[#10cfe6] font-bold drop-shadow-[0_0_8px_rgba(16,207,230,0.7)]">
                    A
                  </span>
                  <span className="absolute bottom-1 font-headline text-[8px] text-[#10cfe6]/80 font-bold">
                    P-06
                  </span>
                </div>
                {/* Slot 7: Solved R */}
                <div className="aspect-square bg-[#1a1f38] border border-[#10cfe6]/50 rounded-lg flex flex-col items-center justify-center relative shadow-[0_0_14px_rgba(16,207,230,0.3)]">
                  <span className="font-headline text-2xl sm:text-3xl text-[#10cfe6] font-bold drop-shadow-[0_0_8px_rgba(16,207,230,0.7)]">
                    R
                  </span>
                  <span className="absolute bottom-1 font-headline text-[8px] text-[#10cfe6]/80 font-bold">
                    P-07
                  </span>
                </div>
              </div>

              {/* Illucia Shield Capacitors */}
              <div className="flex flex-col gap-2 pt-1 border-t border-[#1a1f38]">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-[10px] text-[#8d95b5] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                    <span className="material-symbols-outlined text-[15px] text-[#10cfe6]">battery_charging_full</span>
                    ILLUCIA'S SHIELD CAPACITORS (6 ENERGY CELLS)
                  </span>
                  <span className="font-headline text-[10px] text-[#3ee07a] tracking-widest font-bold">
                    4 ONLINE // 2 OFFLINE
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  <div className="h-9 rounded-lg bg-[#0b0d1a] border border-[#bd1b6d]/50 flex items-center justify-between px-2 text-[#ffb4ab]">
                    <span className="font-headline text-[10px] font-bold">C-01</span>
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </div>
                  <div className="h-9 rounded-lg bg-[#0b0d1a] border border-[#bd1b6d]/50 flex items-center justify-between px-2 text-[#ffb4ab]">
                    <span className="font-headline text-[10px] font-bold">C-02</span>
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </div>
                  <div className="h-9 rounded-lg bg-[#1a1f38] border border-[#3ee07a]/60 flex items-center justify-between px-2 shadow-[0_0_10px_rgba(62,224,122,0.3)]">
                    <span className="font-headline text-[10px] text-[#3ee07a] font-bold">C-03</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3ee07a] shadow-[0_0_8px_#3ee07a]"></span>
                  </div>
                  <div className="h-9 rounded-lg bg-[#1a1f38] border border-[#3ee07a]/60 flex items-center justify-between px-2 shadow-[0_0_10px_rgba(62,224,122,0.3)]">
                    <span className="font-headline text-[10px] text-[#3ee07a] font-bold">C-04</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3ee07a] shadow-[0_0_8px_#3ee07a]"></span>
                  </div>
                  <div className="h-9 rounded-lg bg-[#1a1f38] border border-[#3ee07a]/60 flex items-center justify-between px-2 shadow-[0_0_10px_rgba(62,224,122,0.3)]">
                    <span className="font-headline text-[10px] text-[#3ee07a] font-bold">C-05</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3ee07a] shadow-[0_0_8px_#3ee07a]"></span>
                  </div>
                  <div className="h-9 rounded-lg bg-[#1a1f38] border border-[#3ee07a]/60 flex items-center justify-between px-2 shadow-[0_0_10px_rgba(62,224,122,0.3)]">
                    <span className="font-headline text-[10px] text-[#3ee07a] font-bold">C-06</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3ee07a] shadow-[0_0_8px_#3ee07a]"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Live Letter Frequency Spectrum Visualizer */}
            <div className="bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl p-5 shadow-2xl relative flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10cfe6] text-[20px]">equalizer</span>
                  <h3 className="font-headline text-sm sm:text-base text-white tracking-wide uppercase font-bold">
                    NEURAL FREQUENCY SPECTRUM
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded bg-[#0b0d1a] border border-[#f3f400]/40 text-[#f3f400] font-headline text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-inner font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#f3f400] animate-ping"></span>
                  NEXT HYPOTHESIS: LETTER ‘{selectedLetter}’ [BIAS 0.662]
                </div>
              </div>

              {/* Vertical Frequency Bars */}
              <div className="bg-[#0b0d1a]/90 rounded-xl p-4 flex flex-col gap-2 border border-[#10cfe6]/20 shadow-inner">
                <div className="grid grid-cols-8 gap-2 sm:gap-3 items-end h-32 pt-2 px-2">
                  {FREQUENCY_DATA.map((item) => {
                    const isSelected = item.letter === selectedLetter;
                    return (
                      <div
                        key={item.letter}
                        onClick={() => setSelectedLetter(item.letter)}
                        className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                      >
                        <span
                          className={`font-headline text-[10px] font-bold transition-transform group-hover:scale-110 ${
                            isSelected ? 'text-[#f3f400]' : 'text-[#8d95b5]'
                          }`}
                        >
                          {item.percent}%
                        </span>
                        <div
                          className={`w-full rounded-t transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-t from-[#f3f400]/40 via-[#f3f400] to-white shadow-[0_0_16px_rgba(243,244,0,0.8)]'
                              : 'bg-[#272937] hover:bg-[#10cfe6]/40'
                          }`}
                          style={{ height: `${item.percent}%` }}
                        ></div>
                        <div
                          className={`w-7 sm:w-8 h-7 sm:h-8 rounded flex items-center justify-center font-headline text-xs sm:text-sm font-bold transition-all ${
                            isSelected
                              ? 'bg-[#f3f400] text-[#06070e] shadow-[0_0_12px_rgba(243,244,0,0.6)] scale-105'
                              : 'bg-[#1a1f38] text-white hover:bg-[#272937]'
                          }`}
                        >
                          {item.letter}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs font-mono-arcade text-[#525975] pt-2 border-t border-[#12162a]">
                  <span>FREQUENCY SPECTRUM SAMPLING: 1,842 LEXICAL BRANCHES</span>
                  <span className="text-[#10cfe6] uppercase tracking-wider font-bold text-[10px]">
                    SORT: DEDUCTIVE OCCURRENCE
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 4. Telemetry Trail & Simulation Operating Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* History Telemetry Trail (7 Cols) */}
          <section className="lg:col-span-7 bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs text-[#8d95b5] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[15px] text-[#10cfe6]">history</span>
                REVERSE DEDUCTION CHRONOLOGY
              </span>
              <span className="font-headline text-[10px] text-[#525975] uppercase">
                TOTAL TEST CYCLES: 06
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-[#0b0d1a] border border-[#bd1b6d]/40 rounded-lg p-2.5 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#93000a] text-white font-headline text-xs font-bold flex items-center justify-center">
                    S
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-headline text-[8px] text-[#525975]">ROUND 01</span>
                    <span className="font-headline text-[10px] text-[#ffb4ab] font-bold uppercase">MISS</span>
                  </div>
                </div>
                <span className="text-[9px] text-[#bd1b6d] font-headline font-bold">-1 POD</span>
              </div>

              <div className="bg-[#0b0d1a] border border-[#10cfe6]/30 rounded-lg p-2.5 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#10cfe6]/20 text-[#10cfe6] font-headline text-xs font-bold flex items-center justify-center">
                    A
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-headline text-[8px] text-[#525975]">ROUND 02</span>
                    <span className="font-headline text-[10px] text-[#10cfe6] font-bold uppercase">HIT</span>
                  </div>
                </div>
                <span className="text-[9px] text-[#10cfe6] font-headline font-bold">SLOT 6</span>
              </div>

              <div className="bg-[#0b0d1a] border border-[#bd1b6d]/40 rounded-lg p-2.5 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#93000a] text-white font-headline text-xs font-bold flex items-center justify-center">
                    T
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-headline text-[8px] text-[#525975]">ROUND 03</span>
                    <span className="font-headline text-[10px] text-[#ffb4ab] font-bold uppercase">MISS</span>
                  </div>
                </div>
                <span className="text-[9px] text-[#bd1b6d] font-headline font-bold">-1 POD</span>
              </div>

              <div className="bg-[#0b0d1a] border border-[#10cfe6]/30 rounded-lg p-2.5 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#10cfe6]/20 text-[#10cfe6] font-headline text-xs font-bold flex items-center justify-center">
                    L
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-headline text-[8px] text-[#525975]">ROUND 04</span>
                    <span className="font-headline text-[10px] text-[#10cfe6] font-bold uppercase">HIT</span>
                  </div>
                </div>
                <span className="text-[9px] text-[#10cfe6] font-headline font-bold">SLOT 5</span>
              </div>

              <div className="bg-[#0b0d1a] border border-[#10cfe6]/30 rounded-lg p-2.5 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#10cfe6]/20 text-[#10cfe6] font-headline text-xs font-bold flex items-center justify-center">
                    R
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-headline text-[8px] text-[#525975]">ROUND 05</span>
                    <span className="font-headline text-[10px] text-[#10cfe6] font-bold uppercase">HIT</span>
                  </div>
                </div>
                <span className="text-[9px] text-[#10cfe6] font-headline font-bold">SLOT 7</span>
              </div>

              <div className="bg-[#f3f400]/10 border border-[#f3f400]/40 rounded-lg p-2.5 flex items-center justify-between shadow-[0_0_12px_rgba(243,244,0,0.25)]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#f3f400] text-[#06070e] font-headline text-xs font-bold flex items-center justify-center animate-pulse">
                    E
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-headline text-[8px] text-[#f3f400] font-bold">ROUND 06</span>
                    <span className="font-headline text-[10px] text-white font-bold uppercase">TESTING...</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#f3f400] animate-ping"></span>
              </div>
            </div>
          </section>

          {/* Tactical Control Deck & Mandatory Credits (5 Cols) */}
          <section className="lg:col-span-5 bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 justify-between">
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs text-[#8d95b5] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[15px] text-[#f3f400]">tune</span>
                SIMULATION OPERATING CONTROLS
              </span>
              <span className="font-headline text-[10px] text-[#10cfe6] uppercase tracking-wider font-bold">
                AUTO-SOLVER: {isPaused ? 'PAUSED' : 'SYNCED'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={togglePause}
                className="px-4 py-3 rounded-lg bg-[#1a1f38] hover:bg-[#272937] active:translate-y-1 text-[#10cfe6] font-headline text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#10cfe6]/30 shadow-[0_4px_0_#070913] transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPaused ? 'play_circle' : 'pause_circle'}
                </span>
                <span>{isPaused ? 'RESUME DEDUCTION' : 'PAUSE DEDUCTION'}</span>
              </button>

              <button
                onClick={cycleSpeed}
                className="px-4 py-3 rounded-lg bg-[#1a1f38] hover:bg-[#272937] active:translate-y-1 text-[#10cfe6] font-headline text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#10cfe6]/30 shadow-[0_4px_0_#070913] transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">speed</span>
                <span>SPEED: {SPEEDS[speedIndex]}</span>
              </button>

              <button
                onClick={triggerNewWord}
                className="col-span-2 px-4 py-3.5 rounded-lg bg-[#f3f400] hover:bg-white text-[#06070e] font-headline text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_0_#9a9b00,0_0_16px_rgba(243,244,0,0.4)] active:translate-y-1 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] font-bold">restart_alt</span>
                INITIALIZE NEW SECRET WORD
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono-arcade text-[#525975] border-t border-[#1a1f38]">
              <span className="text-[11px] truncate">ILLUCIA HEURISTIC LEXICON ENGINE</span>
              <button
                onClick={() => setShowCreditsModal(true)}
                className="text-[11px] font-headline text-[#10cfe6] hover:text-white transition-colors underline uppercase tracking-wider shrink-0 font-bold"
              >
                CREDITS & LICENCES
              </button>
            </div>
          </section>
        </div>
      </div>

      <CreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
    </div>
  );
};
