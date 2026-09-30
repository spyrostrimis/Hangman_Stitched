import React, { useState, useEffect, useCallback } from 'react';
import { PageId, WordItem, PlayerProfile } from '../types';
import { WORD_COLLECTION, CHARACTER_ASSETS } from '../data/words';
import { sound } from '../services/sound';
import { playerService } from '../services/player';
import { InstructionsModal } from './InstructionsModal';
import { CreditsModal } from './CreditsModal';

interface Props {
  onNavigate: (page: PageId) => void;
  player: PlayerProfile;
}

const MAX_MISSES = 6;

export const HangmanCockpit: React.FC<Props> = ({ onNavigate, player }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [isPronouncing, setIsPronouncing] = useState(false);

  const currentWordItem: WordItem = WORD_COLLECTION[wordIndex] || WORD_COLLECTION[0];
  const targetWord = currentWordItem.word.toUpperCase();
  const lettersInWord = targetWord.split('');

  // Calculate missed letters
  const missedLetters = guessedLetters.filter((l) => !lettersInWord.includes(l));
  const correctLetters = guessedLetters.filter((l) => lettersInWord.includes(l));
  const missesCount = missedLetters.length;
  const remainingCells = Math.max(0, MAX_MISSES - missesCount);

  // Check victory / loss conditions
  useEffect(() => {
    if (isGameOver || isVictory) return;

    if (missesCount >= MAX_MISSES) {
      setIsGameOver(true);
      sound.playGameOver();
      playerService.resetStreak();
    } else if (lettersInWord.every((char) => guessedLetters.includes(char))) {
      setIsVictory(true);
      sound.playVictoryFanfare();
      playerService.addRescueWin(100);
    }
  }, [guessedLetters, missesCount, lettersInWord, isGameOver, isVictory]);

  const handleGuess = useCallback(
    (letter: string) => {
      const char = letter.toUpperCase();
      if (guessedLetters.includes(char) || isGameOver || isVictory) {
        return;
      }

      setGuessedLetters((prev) => [...prev, char]);

      if (lettersInWord.includes(char)) {
        sound.playHitSound();
      } else {
        sound.playMissSound();
      }
    },
    [guessedLetters, isGameOver, isVictory, lettersInWord]
  );

  // Keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleGuess]);

  const handleNewWord = () => {
    sound.playKeyClick();
    const nextIdx = (wordIndex + 1) % WORD_COLLECTION.length;
    setWordIndex(nextIdx);
    setGuessedLetters([]);
    setIsGameOver(false);
    setIsVictory(false);
    setShowHint2(false);
  };

  const handleResign = () => {
    sound.playMissSound();
    setIsGameOver(true);
    playerService.resetStreak();
  };

  const handlePronounce = () => {
    setIsPronouncing(true);
    sound.speakPronunciation(currentWordItem.word);
    setTimeout(() => setIsPronouncing(false), 800);
  };

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="flex flex-col w-full relative">
      {/* Ambient Deep Space Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen bg-cover bg-center"
        style={{ backgroundImage: `url('${CHARACTER_ASSETS.backgrounds.cockpit}')` }}
      ></div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#06070e]/80 via-transparent to-[#0b0d1a]/95"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Mission Header HUD Strip */}
        <div className="w-full bg-[#12162a]/95 border border-[#10cfe6]/30 backdrop-blur-md rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#3ee07a] animate-ping"></div>
            <div className="flex flex-col">
              <span className="font-headline text-[10px] text-[#10cfe6] tracking-widest uppercase">
                ENCRYPTION PROTOCOL // SECTOR ORION-9
              </span>
              <span className="font-headline text-lg sm:text-xl text-white tracking-wide flex items-center gap-2 font-bold">
                MISSION: RESCUE ARTSY
                <span className="px-2 py-0.5 rounded bg-[#1a1f38] text-[#f3f400] font-headline text-[10px] border border-[#f3f400]/30 font-bold">
                  DIFF: VOYAGER
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5 bg-[#1a1f38] px-3.5 py-1.5 rounded-lg border border-[#10cfe6]/20">
              <span className="material-symbols-outlined text-[#10cfe6] text-[18px]">timer</span>
              <div className="flex flex-col">
                <span className="font-headline text-[9px] text-[#8d95b5]">STATION CHRONO</span>
                <span className="font-mono-arcade text-xs text-[#3ee07a] font-bold tracking-wider">
                  04:42.8
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-[#1a1f38] px-3.5 py-1.5 rounded-lg border border-[#f3f400]/20">
              <span className="material-symbols-outlined text-[#f3f400] text-[18px]">military_tech</span>
              <div className="flex flex-col">
                <span className="font-headline text-[9px] text-[#8d95b5]">BOUNTY VALUE</span>
                <span className="font-mono-arcade text-xs text-[#f3f400] font-bold tracking-wider">
                  +100 XP / ART REVEAL
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1f38] text-[#8d95b5] font-headline text-[10px] border border-[#10cfe6]/20">
              <span className="material-symbols-outlined text-[#3ee07a] text-[14px]">keyboard</span>
              <span>KEYBOARD INPUT ACTIVE [A-Z]</span>
            </div>
          </div>
        </div>

        {/* 3-Column Primary Tactical Cockpit Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Artsy's Stasis Containment & Power Pods (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-2 text-[#525975]">
                <span className="font-headline text-xs text-[#ff8c00] uppercase flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse"></span>
                  STASIS POD ALPHA-1
                </span>
                <span className="font-headline text-[10px] text-[#8d95b5]">
                  SYS_STABLE // {Math.round((remainingCells / MAX_MISSES) * 100)}%
                </span>
              </div>

              {/* Stasis Glass Tank */}
              <div className="relative w-full h-64 bg-[#0b0d1a] rounded-lg flex items-center justify-center p-2 overflow-hidden my-2 border border-[#10cfe6]/20">
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff8c00]/15 via-[#10cfe6]/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#10cfe6] to-transparent animate-pulse"></div>

                <img
                  src={CHARACTER_ASSETS.artsy.stasis}
                  alt="Artsy Robot at Easel in Stasis"
                  className={`h-56 w-auto object-contain z-10 transition-all duration-500 ${
                    isVictory ? 'drop-shadow-[0_0_24px_rgba(243,244,0,0.8)] scale-105' : 'drop-shadow-[0_0_16px_rgba(255,140,0,0.35)]'
                  }`}
                />

                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-[#06070e]/85 px-3 py-1 rounded backdrop-blur-sm z-20 border border-[#10cfe6]/20">
                  <span className="font-headline text-[10px] text-[#3ee07a]">
                    CREATIVE SYNC: {isVictory ? '100% AWAKE' : isGameOver ? 'CONTAINMENT BREACHED' : '92Hz'}
                  </span>
                  <span className="font-headline text-[10px] text-[#f3f400]">
                    RESCUE TARGET
                  </span>
                </div>
              </div>

              {/* Integrity Readout */}
              <div className="w-full mt-2 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-headline font-bold">
                  <span className="text-[#8d95b5] uppercase">STASIS INTEGRITY</span>
                  <span className={remainingCells <= 2 ? 'text-[#ffb4ab]' : 'text-[#3ee07a]'}>
                    {remainingCells} / {MAX_MISSES} CELLS CHARGED ({Math.round((remainingCells / MAX_MISSES) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#1a1f38] overflow-hidden p-0.5 border border-[#10cfe6]/20">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      remainingCells <= 2 ? 'bg-[#bd1b6d]' : 'bg-[#3ee07a]'
                    }`}
                    style={{ width: `${(remainingCells / MAX_MISSES) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 6 Tactical Life Pod Shield Cells (Zero Gallows) */}
              <div className="w-full mt-4 pt-3 bg-[#1a1f38]/70 border border-[#10cfe6]/20 rounded-lg p-3 flex flex-col gap-2">
                <span className="font-headline text-[10px] text-[#10cfe6] tracking-wider uppercase flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  RESCUE LIFE-POD ENERGY CELLS
                </span>
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: MAX_MISSES }).map((_, i) => {
                    const isAlive = i < remainingCells;
                    return (
                      <div
                        key={i}
                        className={`flex flex-col items-center gap-1 p-1 rounded border transition-all ${
                          isAlive
                            ? 'bg-[#0b0d1a] border-[#3ee07a]/40'
                            : 'bg-[#93000a]/30 border-[#bd1b6d]/60 opacity-80'
                        }`}
                      >
                        <div
                          className={`w-full h-8 rounded flex items-center justify-center transition-all ${
                            isAlive
                              ? 'bg-[#3ee07a] shadow-[0_0_10px_rgba(62,224,122,0.6)] text-[#06070e]'
                              : 'bg-[#bd1b6d]/30 text-[#ffb4ab]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px] font-bold">
                            {isAlive ? 'bolt' : 'close'}
                          </span>
                        </div>
                        <span
                          className={`font-headline text-[9px] font-bold ${
                            isAlive ? 'text-[#3ee07a]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {isAlive ? `C-0${i + 1}` : 'BURNT'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-[11px] font-mono-arcade text-[#8d95b5] text-center mt-1">
                  Wrong guesses overload auxiliary pods. {remainingCells} reserves remaining.
                </div>
              </div>
            </div>

            {/* Telemetry Data Stream */}
            <div className="bg-[#12162a]/90 border border-[#10cfe6]/20 rounded-xl p-3 shadow-md flex items-center justify-between font-headline text-xs text-[#8d95b5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10cfe6] text-[16px]">terminal</span>
                <span>FREQ: 1420.405 MHz</span>
              </div>
              <span className="text-[#3ee07a] font-bold uppercase tracking-wider">
                POD RELAY: LINKED
              </span>
            </div>
          </div>

          {/* CENTER COLUMN: Word Matrix & Arcade Keyboard (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Active Mystery Word Slots Container */}
            <div className="bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl p-5 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
              <div className="w-full flex items-center justify-between mb-3 text-[#8d95b5]">
                <span className="font-headline text-xs text-[#10cfe6] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px]">lock_open</span>
                  TARGET WORD [{targetWord.length} CHARACTERS]
                </span>
                <span className="font-headline text-xs text-[#f3f400] font-bold uppercase">
                  CATEGORY: {currentWordItem.category}
                </span>
              </div>

              {/* Word Guess Slots */}
              <div className="py-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {lettersInWord.map((char, idx) => {
                  const isRevealed = guessedLetters.includes(char) || isGameOver || isVictory;
                  const isMissedAtEnd = isGameOver && !guessedLetters.includes(char);
                  return (
                    <div
                      key={idx}
                      className={`w-11 h-14 sm:w-13 sm:h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                        isRevealed
                          ? isMissedAtEnd
                            ? 'bg-[#93000a]/40 border border-[#bd1b6d] text-[#ffb4ab] shadow-[0_0_12px_rgba(189,27,109,0.4)]'
                            : isVictory
                            ? 'bg-[#e9ea00] text-[#06070e] font-bold shadow-[0_0_18px_rgba(243,244,0,0.6)] animate-bounce'
                            : 'bg-[#1a1f38] border border-[#10cfe6]/50 shadow-[0_0_12px_rgba(16,207,230,0.3)]'
                          : 'bg-[#1a1f38] border border-[#10cfe6]/20 shadow-inner'
                      }`}
                    >
                      <span
                        className={`font-headline text-2xl sm:text-3xl font-bold ${
                          isRevealed
                            ? isMissedAtEnd
                              ? 'text-[#ffb4ab]'
                              : isVictory
                              ? 'text-[#06070e]'
                              : 'text-[#10cfe6] drop-shadow-[0_0_8px_rgba(16,207,230,0.8)]'
                            : 'text-transparent'
                        }`}
                      >
                        {isRevealed ? char : '_'}
                      </span>
                      <div
                        className={`w-8 h-1 rounded-full mt-1 ${
                          isRevealed
                            ? isMissedAtEnd
                              ? 'bg-[#bd1b6d]'
                              : isVictory
                              ? 'bg-[#06070e]'
                              : 'bg-[#10cfe6]'
                            : 'bg-[#10cfe6]/40'
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-2 text-[#8d95b5] font-mono-arcade text-xs">
                <span className="flex items-center gap-1 text-[#3ee07a] font-bold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {correctLetters.length} Letters Identified
                </span>
                <span className="text-[#525975]">|</span>
                <span className="flex items-center gap-1 text-[#ffb4ab] font-bold">
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  {missesCount} Errors [{missedLetters.join(', ') || 'NONE'}]
                </span>
              </div>
            </div>

            {/* Tactile Virtual Keyboard Module */}
            <div className="bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <span className="font-headline text-xs text-[#8d95b5] uppercase tracking-wider font-bold">
                  HARDWARE KEYCAP MATRIX
                </span>
                <span className="font-headline text-xs text-[#10cfe6]">
                  TOUCH / PHYSICAL KEYS
                </span>
              </div>

              {/* QWERTY Arcade Touch Buttons Grid */}
              <div className="flex flex-col gap-2 items-center w-full">
                {KEYBOARD_ROWS.map((row, rIdx) => (
                  <div key={rIdx} className="flex justify-center gap-1.5 sm:gap-2 w-full">
                    {row.map((char) => {
                      const isGuessed = guessedLetters.includes(char);
                      const isCorrect = isGuessed && lettersInWord.includes(char);
                      const isMiss = isGuessed && !lettersInWord.includes(char);

                      return (
                        <button
                          key={char}
                          disabled={isGuessed || isGameOver || isVictory}
                          onClick={() => handleGuess(char)}
                          className={`w-8 sm:w-10 h-11 rounded-lg font-headline text-base sm:text-lg font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isCorrect
                              ? 'bg-[#3ee07a] text-[#06070e] shadow-[0_0_12px_rgba(62,224,122,0.8)] cursor-not-allowed'
                              : isMiss
                              ? 'bg-[#bd1b6d]/30 text-[#ffb4ab] line-through border border-[#bd1b6d]/50 cursor-not-allowed'
                              : 'bg-[#1a1f38] text-white hover:bg-[#272937] hover:text-[#10cfe6] hover:border-[#10cfe6] border border-[#10cfe6]/20 active:translate-y-1 shadow-[0_3px_0_#070913]'
                          }`}
                        >
                          {char}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Bottom Switches */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1a1f38]">
                <button
                  onClick={handleNewWord}
                  className="px-3 py-1.5 bg-[#1a1f38] hover:bg-[#272937] rounded-lg text-[#8d95b5] hover:text-white font-headline text-[10px] uppercase flex items-center gap-1.5 transition-all border border-[#10cfe6]/20"
                >
                  <span className="material-symbols-outlined text-[15px]">refresh</span>
                  RE-ROLL CIPHER
                </button>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3ee07a]"></span>
                  <span className="font-headline text-[10px] text-[#3ee07a] uppercase font-bold">
                    AUDIO FEEDBACK ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Comms & Professor Fastolfe's Hints (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1">
                <span className="font-headline text-xs text-[#3ee07a] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[#3ee07a] text-[15px]">sensors</span>
                  COGNITIVE MENTOR UPLINK
                </span>
                <span className="px-2 py-0.5 rounded bg-[#3ee07a]/20 text-[#3ee07a] font-headline text-[10px] font-bold">
                  LIVE
                </span>
              </div>

              {/* Professor Fastolfe Hologram Tile */}
              <div className="flex items-center gap-3 bg-[#1a1f38] p-3 rounded-lg border border-[#3ee07a]/30">
                <div className="relative w-14 h-14 rounded-lg bg-[#06070e] flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_12px_rgba(62,224,122,0.3)] border border-[#3ee07a]/40">
                  <img
                    src={CHARACTER_ASSETS.fastolfe.avatar}
                    alt="Professor Han Fastolfe Hologram Mentor"
                    className="h-14 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(62,224,122,0.5)]"
                  />
                  <div className="absolute inset-0 bg-[#3ee07a]/10 pointer-events-none"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-sm text-white font-bold leading-tight">
                    PROF. FASTOLFE
                  </span>
                  <span className="font-headline text-[10px] text-[#10cfe6]">
                    LINGUISTIC ADVISOR
                  </span>
                  <span className="font-mono-arcade text-[11px] text-[#8d95b5] mt-0.5 italic">
                    {isVictory ? '"Stellar triumph, Alex!"' : isGameOver ? '"Don\'t give up, pilot!"' : '"Focus on stellar roots!"'}
                  </span>
                </div>
              </div>

              {/* Dual Hint System Modules */}
              <div className="flex flex-col gap-2 mt-1">
                {/* Hint 1: Etymological Clue */}
                <div className="bg-[#1a1f38] border border-[#f3f400]/30 p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-[10px] text-[#f3f400] font-bold uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                      HINT #1 // ETYMOLOGICAL CLUE
                    </span>
                    <span className="font-headline text-[9px] text-[#3ee07a] font-bold">UNLOCKED</span>
                  </div>
                  <p className="font-mono-arcade text-xs text-[#f1f2fa] leading-snug">
                    “{currentWordItem.hint1}”
                  </p>
                </div>

                {/* Hint 2: Friendlier Cosmic Clue */}
                <div className="bg-[#1a1f38] border border-[#10cfe6]/30 p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-[10px] text-[#10cfe6] font-bold uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                      HINT #2 // COSMIC CONTEXT
                    </span>
                    {showHint2 ? (
                      <span className="font-headline text-[9px] text-[#3ee07a] font-bold">ACTIVE</span>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playKeyClick();
                          setShowHint2(true);
                        }}
                        className="font-headline text-[9px] text-[#f3f400] underline font-bold uppercase cursor-pointer"
                      >
                        REVEAL CLUE
                      </button>
                    )}
                  </div>
                  {showHint2 ? (
                    <p className="font-mono-arcade text-xs text-[#f1f2fa] leading-snug">
                      “{currentWordItem.hint2}”
                    </p>
                  ) : (
                    <p className="font-mono-arcade text-xs text-[#525975] italic">
                      [Encrypted auxiliary context available on pilot demand]
                    </p>
                  )}
                </div>
              </div>

              {/* Tactical Control Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#1a1f38]">
                <button
                  onClick={() => setShowTipsModal(true)}
                  className="w-full py-2 bg-[#1a1f38] hover:bg-[#272937] text-[#10cfe6] font-headline text-xs font-bold rounded-lg uppercase flex items-center justify-center gap-1.5 transition-all border border-[#10cfe6]/30 shadow-[0_2px_0_#070913] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  INSTRUCTIONS & TIPS
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleNewWord}
                    className="py-2 bg-[#1a1f38] hover:bg-[#272937] text-white font-headline text-xs font-bold rounded-lg uppercase flex items-center justify-center gap-1 transition-all border border-white/20 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    NEW WORD
                  </button>
                  <button
                    disabled={isGameOver || isVictory}
                    onClick={handleResign}
                    className="py-2 bg-[#1a1f38] hover:bg-[#93000a] text-[#ffb4ab] font-headline text-xs font-bold rounded-lg uppercase flex items-center justify-center gap-1 transition-all border border-[#bd1b6d]/40 disabled:opacity-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">flag</span>
                    RESIGN
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Battle Telemetry Info */}
            <div className="bg-[#12162a]/90 border border-[#10cfe6]/20 rounded-xl p-3 shadow-md flex flex-col gap-1.5">
              <div className="flex justify-between font-headline text-xs">
                <span className="text-[#8d95b5]">DIFFICULTY MULTIPLIER</span>
                <span className="text-[#f3f400] font-bold">1.5X SCORE</span>
              </div>
              <div className="flex justify-between font-headline text-xs">
                <span className="text-[#8d95b5]">CONSECUTIVE WINS</span>
                <span className="text-[#3ee07a] font-bold">{player.streak} MISSIONS</span>
              </div>
            </div>
          </div>
        </div>

        {/* POST-ROUND LEXICON & REWARD SECTION: Shown when game completes (Victory or Loss) */}
        {(isVictory || isGameOver) && (
          <div className="w-full bg-[#12162a]/95 border-2 border-[#10cfe6] rounded-xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Victory or Loss Banner Header */}
            <div
              className={`w-full p-0.5 rounded-lg ${
                isVictory
                  ? 'bg-gradient-to-r from-[#f3f400] via-[#10cfe6] to-[#3ee07a]'
                  : 'bg-gradient-to-r from-[#bd1b6d] via-[#93000a] to-[#ffb4ab]'
              }`}
            >
              <div className="w-full bg-[#06070e] py-3 px-5 rounded-[6px] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[28px] ${
                      isVictory ? 'text-[#f3f400] animate-bounce' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {isVictory ? 'celebration' : 'warning'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline text-base sm:text-lg text-white font-bold tracking-wide">
                      {isVictory
                        ? 'WORD DECRYPTED // 100 POINTS SAVED!'
                        : 'CONTAINMENT DESTABILIZED // ATTEMPTS EXHAUSTED'}
                    </span>
                    <span
                      className={`font-headline text-[10px] uppercase tracking-widest font-bold ${
                        isVictory ? 'text-[#3ee07a]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {isVictory
                        ? `ARTSY REVIVAL SAFEGUARD STABILIZED // TOTAL COMBAT SCORE: ${player.score} PTS`
                        : `THE SECRET CIPHER WAS: ${targetWord}`}
                    </span>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-4 py-1 rounded font-headline text-sm font-bold uppercase ${
                      isVictory ? 'bg-[#3ee07a]/20 text-[#3ee07a]' : 'bg-[#93000a]/50 text-[#ffb4ab]'
                    }`}
                  >
                    {isVictory ? 'VICTORY' : 'GAME OVER'}
                  </span>
                </div>
              </div>
            </div>

            {/* Split: Merriam-Webster Dossier & Artsy's Unlocked Artwork */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Merriam-Webster Verified Dossier (Strict Section 8 Compliance) */}
              <div className="lg:col-span-8 flex flex-col gap-3 bg-[#1a1f38] border border-[#10cfe6]/30 p-5 rounded-xl shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#12162a]">
                  <div className="flex items-center gap-3">
                    {/* Merriam-Webster official logo strictly 50x50px */}
                    <img
                      src={CHARACTER_ASSETS.mwLogo}
                      alt="Merriam-Webster Official Logo Mark"
                      className="w-[50px] h-[50px] object-contain rounded-full shadow-md bg-white p-0.5 shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="font-headline text-[10px] text-[#10cfe6] tracking-wider uppercase font-bold">
                        LEXICON VERIFICATION SOURCE
                      </span>
                      <span className="font-headline text-sm sm:text-base text-white font-bold">
                        Merriam-Webster's Collegiate® Dictionary with Audio
                      </span>
                    </div>
                  </div>

                  {/* Pronunciation Audio Button */}
                  <button
                    onClick={handlePronounce}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all shadow-md cursor-pointer ${
                      isPronouncing
                        ? 'bg-[#3ee07a] text-[#06070e] scale-95'
                        : 'bg-[#10cfe6] text-[#06070e] hover:shadow-[0_0_16px_rgba(16,207,230,0.6)]'
                    }`}
                    title="Play Merriam-Webster studio pronunciation audio"
                  >
                    <img
                      src={CHARACTER_ASSETS.audioIcon}
                      alt="Audio Pronunciation Icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{currentWordItem.phonetics}</span>
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>
                  </button>
                </div>

                {/* Structured Lexicon Attributes */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-headline text-2xl text-[#f3f400] font-bold tracking-wider lowercase">
                      {currentWordItem.word}
                    </span>
                    <span className="font-mono-arcade text-sm text-[#10cfe6] italic">
                      {currentWordItem.partOfSpeech}
                    </span>
                    <span className="font-headline text-[10px] text-[#525975] uppercase tracking-wider ml-auto">
                      REF: {currentWordItem.refCode}
                    </span>
                  </div>

                  {/* Definition */}
                  <div className="bg-[#0b0d1a]/80 border border-[#10cfe6]/10 p-3 rounded-lg flex flex-col gap-1">
                    <span className="font-headline text-[10px] text-[#8d95b5] uppercase font-bold">
                      PRIMARY DEFINITION:
                    </span>
                    <p className="font-mono-arcade text-sm text-[#f1f2fa] leading-relaxed">
                      {currentWordItem.definition}
                    </p>
                  </div>

                  {/* Example Sentence */}
                  <div className="flex items-center gap-2 text-[#cac8ab] font-mono-arcade text-xs italic pt-1">
                    <span className="material-symbols-outlined text-[#3ee07a] text-[16px]">format_quote</span>
                    <span>“{currentWordItem.example}”</span>
                  </div>
                </div>
              </div>

              {/* Artsy's Artwork Gallery Frame (on victory) or Game Over Frame (on loss) */}
              <div className="lg:col-span-4 flex flex-col items-center gap-2 bg-[#1a1f38] border border-[#ff8c00]/30 p-5 rounded-xl shadow-xl text-center">
                <div className="w-full flex items-center justify-between pb-1">
                  <span className="font-headline text-[10px] text-[#ff8c00] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">palette</span>
                    {isVictory ? 'GALLERY REWARD UNLOCKED' : 'SYSTEM OFFLINE'}
                  </span>
                  <span className="font-headline text-[10px] text-[#f3f400] font-bold">
                    {currentWordItem.painting.id}
                  </span>
                </div>

                {isVictory ? (
                  <div className="relative w-full h-44 rounded-lg overflow-hidden group shadow-[0_0_16px_rgba(255,140,0,0.3)] bg-[#06070e] flex items-center justify-center border border-[#ff8c00]/40">
                    <img
                      src={currentWordItem.painting.imageUrl}
                      alt={currentWordItem.painting.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06070e]/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2 text-left">
                      <span className="font-headline text-xs text-white font-bold block truncate">
                        {currentWordItem.painting.title}
                      </span>
                      <span className="font-mono-arcade text-[10px] text-[#10cfe6]">
                        {currentWordItem.painting.artist}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-44 rounded-lg overflow-hidden bg-[#06070e] flex flex-col items-center justify-center border border-[#bd1b6d]/40 p-4">
                    <span className="material-symbols-outlined text-4xl text-[#bd1b6d] animate-pulse">
                      error
                    </span>
                    <span className="font-headline text-sm font-bold text-white uppercase mt-2">
                      GAME OVER
                    </span>
                    <span className="font-mono-arcade text-[11px] text-[#8d95b5] mt-1 text-center">
                      Artsy remains in stasis. Try another mission!
                    </span>
                  </div>
                )}

                <p className="font-mono-arcade text-xs text-[#8d95b5] mt-1">
                  {isVictory
                    ? `Artsy's Painting ${currentWordItem.painting.id} unlocked to permanent flight archives.`
                    : 'The cipher was not deciphered before all 6 power cells depleted.'}
                </p>

                {/* Quick Action Controls */}
                <div className="w-full grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={handleNewWord}
                    className="py-2.5 px-3 bg-[#f3f400] hover:bg-white text-[#06070e] font-headline text-xs font-bold rounded-lg uppercase shadow-[0_3px_0_#999a00] active:translate-y-1 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    PLAY AGAIN
                  </button>
                  <button
                    onClick={() => onNavigate('hall-of-fame')}
                    className="py-2.5 px-3 bg-[#12162a] hover:bg-[#272937] text-[#10cfe6] font-headline text-xs font-bold rounded-lg uppercase border border-[#10cfe6]/30 active:translate-y-1 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">leaderboard</span>
                    FAME HALL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <InstructionsModal isOpen={showTipsModal} onClose={() => setShowTipsModal(false)} />
      <CreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
    </div>
  );
};
