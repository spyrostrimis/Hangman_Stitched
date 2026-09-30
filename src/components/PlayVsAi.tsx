import React, { useState } from 'react';
import { PageId, PlayerProfile, LexiconProtocol, DuelTurn } from '../types';
import { CHARACTER_ASSETS } from '../data/words';
import { sound } from '../services/sound';
import {
  filterCandidates,
  calculateLetterFrequencies,
  getIlluciaNextHypothesis,
  getIlluciaHitReaction,
  getIlluciaMissReaction,
  LEXICON_COUNTS
} from '../services/illuciaEngine';
import { CreditsModal } from './CreditsModal';

interface Props {
  onNavigate: (page: PageId) => void;
  player: PlayerProfile;
}

export const PlayVsAi: React.FC<Props> = ({ onNavigate, player }) => {
  const [protocol, setProtocol] = useState<LexiconProtocol>('MASTER');
  const [secretWord, setSecretWord] = useState('STELLAR');
  const [isWordConfirmed, setIsWordConfirmed] = useState(true);
  const [customWordInput, setCustomWordInput] = useState('');
  const [revealedSlots, setRevealedSlots] = useState<(string | null)[]>(new Array(7).fill(null));
  const [missedLetters, setMissedLetters] = useState<string[]>([]);
  const [shieldsRemaining, setShieldsRemaining] = useState(6);
  const [turns, setTurns] = useState<DuelTurn[]>([
    {
      id: 'turn-1',
      roundNumber: 1,
      letter: 'E',
      frequencyPercent: 66,
      rationale:
        'Based on lexical density in 7-letter English words, my primary hypothesis is letter E (appears in 66% of candidate branches). Is there an E in your word?',
      candidatesCount: 4096,
      status: 'PENDING',
      timestamp: '08:42:19'
    }
  ]);
  const [selectedHitSlots, setSelectedHitSlots] = useState<number[]>([]);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const wordLength = secretWord.length;
  const isDuelOver =
    shieldsRemaining <= 0 ||
    revealedSlots.every((slot) => slot !== null);

  const isPilotVictory = shieldsRemaining <= 0;
  const isIlluciaVictory = revealedSlots.every((slot) => slot !== null);

  const currentTurn = turns[turns.length - 1];

  const handleConfirmHit = () => {
    if (!currentTurn || currentTurn.status !== 'PENDING') return;
    if (selectedHitSlots.length === 0) return;

    sound.playHitSound();

    const letter = currentTurn.letter;
    const newRevealed = [...revealedSlots];
    selectedHitSlots.forEach((slotIdx) => {
      newRevealed[slotIdx] = letter;
    });
    setRevealedSlots(newRevealed);

    const candidates = filterCandidates(wordLength, newRevealed, missedLetters);
    const reductionRatio = candidates.length / 50;
    const remainingEstimated = Math.max(
      1,
      Math.round(LEXICON_COUNTS[protocol] * reductionRatio)
    );

    const hitReaction = getIlluciaHitReaction(selectedHitSlots[0], remainingEstimated);

    // Update current turn
    const updatedTurns = [...turns];
    updatedTurns[updatedTurns.length - 1] = {
      ...currentTurn,
      status: 'HIT',
      hitSlots: [...selectedHitSlots],
      illuciaCounter: hitReaction
    };

    // If word is completely revealed, end duel
    if (newRevealed.every((s) => s !== null)) {
      setTurns(updatedTurns);
      sound.playGameOver();
      return;
    }

    // Otherwise, generate Illucia's next hypothesis
    const next = getIlluciaNextHypothesis(wordLength, newRevealed, missedLetters, protocol);
    updatedTurns.push({
      id: `turn-${updatedTurns.length + 1}`,
      roundNumber: updatedTurns.length + 1,
      letter: next.letter,
      frequencyPercent: next.percent,
      rationale: next.speech,
      candidatesCount: next.totalCandidates,
      status: 'PENDING',
      timestamp: '08:43:04'
    });

    setTurns(updatedTurns);
    setSelectedHitSlots([]);
  };

  const handleMiss = (banter: string) => {
    if (!currentTurn || currentTurn.status !== 'PENDING') return;

    sound.playMissSound();
    const newMisses = [...missedLetters, currentTurn.letter];
    setMissedLetters(newMisses);
    const newShields = Math.max(0, shieldsRemaining - 1);
    setShieldsRemaining(newShields);

    const missReaction = getIlluciaMissReaction(banter);

    const updatedTurns = [...turns];
    updatedTurns[updatedTurns.length - 1] = {
      ...currentTurn,
      status: 'MISS',
      playerReply: banter,
      illuciaCounter: missReaction
    };

    if (newShields <= 0) {
      setTurns(updatedTurns);
      sound.playVictoryFanfare();
      return;
    }

    // Generate next hypothesis
    const next = getIlluciaNextHypothesis(wordLength, revealedSlots, newMisses, protocol);
    updatedTurns.push({
      id: `turn-${updatedTurns.length + 1}`,
      roundNumber: updatedTurns.length + 1,
      letter: next.letter,
      frequencyPercent: next.percent,
      rationale: next.speech,
      candidatesCount: next.totalCandidates,
      status: 'PENDING',
      timestamp: '08:43:40'
    });

    setTurns(updatedTurns);
    setSelectedHitSlots([]);
  };

  const handleResetDuel = (newProtocol: LexiconProtocol = protocol, newWord: string = 'STELLAR') => {
    sound.playKeyClick();
    setProtocol(newProtocol);
    setSecretWord(newWord.toUpperCase());
    setRevealedSlots(new Array(newWord.length).fill(null));
    setMissedLetters([]);
    setShieldsRemaining(6);
    setSelectedHitSlots([]);

    const next = getIlluciaNextHypothesis(newWord.length, new Array(newWord.length).fill(null), [], newProtocol);
    setTurns([
      {
        id: 'turn-1',
        roundNumber: 1,
        letter: next.letter,
        frequencyPercent: next.percent,
        rationale: next.speech,
        candidatesCount: next.totalCandidates,
        status: 'PENDING',
        timestamp: '08:42:19'
      }
    ]);
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Background with Cosmic Drift */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${CHARACTER_ASSETS.backgrounds.observatory}')` }}
      ></div>
      <div className="fixed inset-0 crt-overlay z-[1]"></div>

      {/* STICKY TELEMETRY HUD BAR */}
      <div className="sticky top-18 z-40 w-full bg-[#12162a]/95 backdrop-blur-md shadow-2xl py-3 px-4 sm:px-6 lg:px-8 border-b border-[#10cfe6]/30">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Character Telemetry & Shield Capacitors */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-lg bg-[#1a1f38] overflow-hidden shadow-md shrink-0 border border-[#a54ed7]/40 illucia-hologram">
              <img
                src={CHARACTER_ASSETS.illucia.avatar}
                alt="Illucia AI avatar"
                className="w-full h-full object-contain p-0.5"
              />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#a54ed7] animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline text-sm text-[#a54ed7] font-bold tracking-wider">
                  ILLUCIA // CORE-v9
                </span>
                <span className="font-headline text-[9px] px-1.5 py-0.5 rounded bg-[#1a1f38] text-[#10cfe6] tracking-widest uppercase border border-[#10cfe6]/20 font-bold">
                  LEXICAL NEURAL NET
                </span>
              </div>

              {/* 6 Energy Shield Capacitors */}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-headline text-[10px] text-[#8d95b5] mr-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#3ee07a]">shield</span>
                  SHIELDS:
                </span>
                {Array.from({ length: 6 }).map((_, idx) => {
                  const isOnline = idx < shieldsRemaining;
                  return (
                    <div
                      key={idx}
                      className={`w-5 h-2.5 rounded-sm transition-all ${
                        isOnline
                          ? 'bg-[#3ee07a] shadow-[0_0_8px_#3ee07a]'
                          : 'bg-[#bd1b6d]/30 border border-[#bd1b6d]/60 opacity-60'
                      }`}
                      title={`Shield Cell ${idx + 1}: ${isOnline ? 'Online' : 'Depleted'}`}
                    ></div>
                  );
                })}
                <span className="font-headline text-[10px] text-[#8d95b5] ml-1.5 font-bold">
                  {shieldsRemaining}/6 CELLS
                </span>
              </div>
            </div>
          </div>

          {/* Center: Candidates & Protocol */}
          <div className="hidden md:flex items-center gap-6 bg-[#06070e]/80 px-4 py-1.5 rounded-lg border border-[#10cfe6]/20">
            <div className="flex flex-col text-center">
              <span className="font-headline text-[9px] text-[#525975] uppercase tracking-wider flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10cfe6] animate-pulse"></span> Active Lexical Space
              </span>
              <span className="font-headline text-sm text-[#10cfe6] font-bold tracking-tight">
                {currentTurn ? currentTurn.candidatesCount.toLocaleString() : '1,842'}{' '}
                <span className="font-mono-arcade text-[10px] text-[#8d95b5] font-normal">candidates</span>
              </span>
            </div>
            <div className="w-px h-6 bg-[#1a1f38]"></div>
            <div className="flex flex-col text-center">
              <span className="font-headline text-[9px] text-[#525975] uppercase tracking-wider">Protocol</span>
              <span className="font-headline text-xs text-[#f3f400] font-bold tracking-wider">
                ★ {protocol} ({protocol === 'MASTER' ? '11.2K' : protocol === 'SCHOLAR' ? '8.5K' : '4.0K'})
              </span>
            </div>
          </div>

          {/* Right: Pilot Vault Peek */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#10cfe6] animate-pulse">visibility</span>
                <span className="font-headline text-[9px] text-[#8d95b5] uppercase">PILOT VAULT (HIDDEN FROM AI):</span>
              </div>
              <div className="font-headline text-xs tracking-widest text-white font-bold bg-[#06070e] px-2.5 py-0.5 rounded border border-[#10cfe6]/30">
                [ {secretWord.split('').join(' ')} ]
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-center justify-center px-2 py-0.5 bg-[#1a1f38] rounded border border-[#f3f400]/20">
              <span className="font-headline text-[9px] text-[#f3f400] font-bold uppercase tracking-wider">0 HOF PTS</span>
              <span className="font-mono-arcade text-[8px] text-[#525975]">Duel Challenge</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONVERSATION TELEMETRY THREAD */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Notice Header */}
        <div className="w-full bg-[#1a1f38] rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#10cfe6]/20">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#10cfe6] text-[28px] animate-pulse">lock</span>
            <div>
              <h2 className="font-headline text-sm sm:text-base text-white font-bold tracking-wider uppercase">
                AI CONVERSATION DUEL PROTOCOL
              </h2>
              <p className="font-mono-arcade text-xs text-[#8d95b5] leading-snug">
                Illucia has zero access to your memory banks. She calculates letter probabilities mathematically through dictionary frequency elimination.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreditsModal(true)}
            className="shrink-0 font-headline text-[10px] px-3 py-1.5 rounded bg-[#12162a] text-[#10cfe6] hover:bg-[#272937] transition-all uppercase tracking-wider border border-[#10cfe6]/30 cursor-pointer"
          >
            Lexicon Licences →
          </button>
        </div>

        {/* SECTION 1: SETUP PHASE */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#525975] font-headline text-[10px] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#a54ed7] animate-ping"></span>
            <span>01 // INITIALIZATION TELEMETRY</span>
            <span className="flex-1 h-px bg-[#1a1f38]"></span>
            <span>SYS TIME: 08:42:19</span>
          </div>

          {/* Illucia Speech Bubble 1 */}
          <div className="flex items-start gap-3 max-w-2xl">
            <div className="w-11 h-11 rounded-xl bg-[#1a1f38] overflow-hidden shadow-lg shrink-0 border border-[#a54ed7]/40 illucia-hologram">
              <img
                src={CHARACTER_ASSETS.illucia.avatar}
                alt="Illucia AI"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-xs text-[#a54ed7] font-bold tracking-wide">ILLUCIA</span>
                <span className="font-mono-arcade text-[10px] text-[#525975]">TRANSMISSION RECEIVED</span>
              </div>
              <div className="bg-[#12162a] p-4 rounded-2xl rounded-tl-sm shadow-xl text-[#e1e1f4] font-mono-arcade text-xs sm:text-sm leading-relaxed border border-[#10cfe6]/20">
                Greetings, Commander {player.callsign}! I have primed my neural nodes with up to 11,200 curated dictionary entries. Ready for a reverse duel? Choose my active vocabulary protocol before sealing your cipher!
              </div>
            </div>
          </div>

          {/* Setup Controls Card */}
          <div className="ml-14 bg-[#12162a] p-4 sm:p-5 rounded-xl shadow-2xl flex flex-col gap-4 border border-[#10cfe6]/20">
            <div>
              <span className="font-headline text-[10px] text-[#10cfe6] uppercase tracking-widest block mb-2 font-bold">
                SELECT AI LEXICON PROTOCOL
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setProtocol('APPRENTICE')}
                  className={`p-2.5 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                    protocol === 'APPRENTICE'
                      ? 'bg-[#a54ed7]/20 border border-[#a54ed7] text-white shadow-[0_0_12px_rgba(165,78,215,0.4)]'
                      : 'bg-[#1a1f38] text-[#8d95b5] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="font-headline text-xs font-bold">APPRENTICE</span>
                  <span className="font-mono-arcade text-[10px] text-[#525975]">4,000 words</span>
                </button>
                <button
                  onClick={() => setProtocol('SCHOLAR')}
                  className={`p-2.5 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                    protocol === 'SCHOLAR'
                      ? 'bg-[#a54ed7]/20 border border-[#a54ed7] text-white shadow-[0_0_12px_rgba(165,78,215,0.4)]'
                      : 'bg-[#1a1f38] text-[#8d95b5] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="font-headline text-xs font-bold">SCHOLAR</span>
                  <span className="font-mono-arcade text-[10px] text-[#525975]">8,500 words</span>
                </button>
                <button
                  onClick={() => setProtocol('MASTER')}
                  className={`p-2.5 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                    protocol === 'MASTER'
                      ? 'bg-[#a54ed7]/30 border-2 border-[#a54ed7] text-white shadow-[0_0_16px_rgba(165,78,215,0.5)]'
                      : 'bg-[#1a1f38] text-[#8d95b5] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="font-headline text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#f3f400]">star</span>
                    MASTER
                  </span>
                  <span className="font-mono-arcade text-[10px] text-[#a54ed7]">11,200 words</span>
                </button>
              </div>
            </div>

            {/* Secret Word confirmation */}
            <div className="pt-3 border-t border-[#1a1f38] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-headline text-xs text-[#f3f400] uppercase tracking-wider font-bold">
                  Secret Word Confirmed (Pilot Viewport Only)
                </span>
                <span className="font-headline text-[10px] text-[#3ee07a] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ee07a] animate-ping"></span>
                  Encrypted {wordLength}-Letter Word
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 py-1">
                {secretWord.split('').map((char, i) => (
                  <div
                    key={i}
                    className="w-10 h-12 bg-[#06070e] text-white font-headline text-lg font-bold flex items-center justify-center rounded shadow-inner border border-[#10cfe6]/30"
                  >
                    {char}
                  </div>
                ))}
              </div>

              {/* Custom Word Input */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Or enter custom word (3-12 letters)..."
                  value={customWordInput}
                  onChange={(e) => setCustomWordInput(e.target.value.toUpperCase())}
                  className="bg-[#06070e] border border-[#10cfe6]/25 rounded px-3 py-1.5 text-xs font-mono-arcade text-white placeholder:text-[#525975] flex-1 uppercase"
                  maxLength={12}
                />
                <button
                  onClick={() => {
                    const clean = customWordInput.trim().toUpperCase();
                    if (/^[A-Z]{3,12}$/.test(clean)) {
                      handleResetDuel(protocol, clean);
                      setCustomWordInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-[#1a1f38] hover:bg-[#272937] text-[#10cfe6] font-headline text-xs uppercase font-bold rounded border border-[#10cfe6]/30 cursor-pointer"
                >
                  SET WORD
                </button>
              </div>
              <span className="font-mono-arcade text-[10px] text-[#525975]">
                Note: Illucia only receives notification that length = {wordLength}. Character positions remain strictly masked.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONVERSATION TURNS DOCK */}
        {turns.map((turn, tIdx) => {
          const isCurrentPending = turn.status === 'PENDING';
          return (
            <div key={turn.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#525975] font-headline text-[10px] uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#10cfe6] animate-pulse"></span>
                <span>
                  0{tIdx + 2} // TURN 0{turn.roundNumber} - HYPOTHESIS & VERIFICATION
                </span>
                <span className="flex-1 h-px bg-[#1a1f38]"></span>
                <span>CANDIDATES: {turn.candidatesCount.toLocaleString()}</span>
              </div>

              {/* Illucia Letter Guess Bubble */}
              <div className="flex items-start gap-3 max-w-2xl">
                <div className="w-11 h-11 rounded-xl bg-[#1a1f38] overflow-hidden shadow-lg shrink-0 border border-[#a54ed7]/40 illucia-hologram">
                  <img
                    src={CHARACTER_ASSETS.illucia.avatar}
                    alt="Illucia AI"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-xs text-[#a54ed7] font-bold">ILLUCIA</span>
                    <span className="font-headline text-[9px] text-[#3ee07a] flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ee07a]"></span> CALC COMPLETE
                    </span>
                  </div>
                  <div className="bg-[#12162a] p-4 rounded-2xl rounded-tl-sm shadow-xl text-[#e1e1f4] font-mono-arcade text-xs sm:text-sm leading-relaxed flex flex-col gap-2 border border-[#10cfe6]/20">
                    <p>{turn.rationale}</p>
                    <div className="p-2 rounded bg-[#1a1f38] text-xs text-[#8d95b5] flex items-center justify-between border border-[#10cfe6]/10">
                      <span className="flex items-center gap-1 font-mono-arcade">
                        <span className="material-symbols-outlined text-[14px] text-[#10cfe6]">analytics</span>
                        Letter frequency bias: {turn.frequencyPercent}%
                      </span>
                      <span className="text-[#10cfe6] font-headline text-[10px] font-bold tracking-wider">
                        CONFIDENCE: 92.1%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Player Interaction Console for this turn */}
              {isCurrentPending && !isDuelOver && (
                <div className="ml-14 bg-[#1a1f38] p-4 sm:p-5 rounded-xl shadow-xl flex flex-col gap-4 border border-[#10cfe6]/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f3f400] animate-ping"></span>
                      <span className="font-headline text-xs text-white uppercase tracking-wider font-bold">
                        Player Action: Resolve Letter '{turn.letter}'
                      </span>
                    </div>
                    <span className="font-mono-arcade text-[11px] text-[#8d95b5]">
                      Tap slot(s) where '{turn.letter}' appears, or choose a miss response
                    </span>
                  </div>

                  {/* Slot selector */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 bg-[#06070e] rounded-lg p-3 border border-[#10cfe6]/20">
                    {Array.from({ length: wordLength }).map((_, slotIdx) => {
                      const isAlreadySolved = revealedSlots[slotIdx] !== null;
                      const isSelected = selectedHitSlots.includes(slotIdx);

                      return (
                        <button
                          key={slotIdx}
                          disabled={isAlreadySolved}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedHitSlots((prev) => prev.filter((s) => s !== slotIdx));
                            } else {
                              setSelectedHitSlots((prev) => [...prev, slotIdx]);
                            }
                          }}
                          className={`w-10 h-14 sm:w-12 sm:h-16 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isAlreadySolved
                              ? 'bg-[#3ee07a]/20 border border-[#3ee07a] text-[#3ee07a] font-bold'
                              : isSelected
                              ? 'bg-[#f3f400] text-[#06070e] font-bold shadow-[0_0_14px_rgba(243,244,0,0.8)] scale-105'
                              : 'bg-[#1a1f38] hover:bg-[#272937] text-white border border-[#10cfe6]/30 active:scale-95'
                          }`}
                        >
                          <span className="font-headline text-[9px] text-[#8d95b5]">#{slotIdx + 1}</span>
                          <span className="font-headline text-lg sm:text-xl font-bold">
                            {isAlreadySolved
                              ? revealedSlots[slotIdx]
                              : isSelected
                              ? turn.letter
                              : '_'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions: Confirm Hit vs Miss Banter Options */}
                  <div className="flex flex-col gap-3">
                    <button
                      disabled={selectedHitSlots.length === 0}
                      onClick={handleConfirmHit}
                      className="w-full py-3 rounded-lg bg-[#3ee07a] hover:bg-white text-[#06070e] font-headline text-xs font-bold uppercase tracking-wider shadow-[0_3px_0_#289450] active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      CONFIRM HIT ON {selectedHitSlots.length} SLOT(S)
                    </button>

                    <div className="flex flex-col gap-1.5 pt-1 border-t border-[#12162a]">
                      <span className="font-headline text-[10px] text-[#8d95b5] uppercase tracking-wider">
                        Or Miss: Choose banter reply (-1 Illucia Shield):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => handleMiss('Oops, wrong!')}
                          className="px-3 py-2 rounded bg-[#12162a] hover:bg-[#272937] text-white font-mono-arcade text-xs border border-[#10cfe6]/20 transition-all cursor-pointer"
                        >
                          "Oops, wrong!"
                        </button>
                        <button
                          onClick={() => handleMiss("That wasn't so smart ;)")}
                          className="px-3 py-2 rounded bg-[#bd1b6d]/20 hover:bg-[#bd1b6d]/40 text-[#ffb4ab] font-mono-arcade text-xs border border-[#bd1b6d]/40 transition-all font-bold cursor-pointer"
                        >
                          "That wasn't so smart ;)"
                        </button>
                        <button
                          onClick={() => handleMiss("Nope, zero aboard.")}
                          className="px-3 py-2 rounded bg-[#12162a] hover:bg-[#272937] text-white font-mono-arcade text-xs border border-[#10cfe6]/20 transition-all cursor-pointer"
                        >
                          "Nope, zero aboard."
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolved Hit Summary Card */}
              {turn.status === 'HIT' && (
                <div className="ml-14 bg-[#12162a] p-4 rounded-xl shadow-md border border-[#3ee07a]/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-xs text-[#3ee07a] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      HIT CONFIRMED! (Letter '{turn.letter}' in slot(s) {(turn.hitSlots || []).map((s) => `#${s + 1}`).join(', ')})
                    </span>
                    <span className="font-headline text-[10px] text-[#10cfe6]">
                      OCCURRENCES: {turn.hitSlots?.length || 1}
                    </span>
                  </div>
                  {turn.illuciaCounter && (
                    <p className="font-mono-arcade text-xs text-[#cac8ab] italic pl-2 border-l-2 border-[#a54ed7]">
                      {turn.illuciaCounter}
                    </p>
                  )}
                </div>
              )}

              {/* Resolved Miss Summary Card */}
              {turn.status === 'MISS' && (
                <div className="ml-14 bg-[#12162a] p-4 rounded-xl shadow-md border border-[#bd1b6d]/40 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-xs text-[#ffb4ab] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      MISS LOGGED! ({turn.playerReply || 'Incorrect'})
                    </span>
                    <span className="font-headline text-[10px] text-[#bd1b6d] font-bold">
                      -1 SHIELD CELL
                    </span>
                  </div>
                  {turn.illuciaCounter && (
                    <p className="font-mono-arcade text-xs text-[#cac8ab] italic pl-2 border-l-2 border-[#bd1b6d]">
                      {turn.illuciaCounter}
                    </p>
                  )}
                </div>
              )}

              {/* Board State Row after this turn */}
              <div className="ml-14 bg-[#06070e] p-3 rounded-lg border border-[#10cfe6]/20 flex items-center justify-between">
                <span className="font-headline text-[10px] text-[#8d95b5] uppercase">
                  TRANSMITTED BOARD STATE:
                </span>
                <span className="font-mono-arcade text-sm text-[#10cfe6] tracking-widest font-bold">
                  [ {revealedSlots.map((s) => (s ? s : '_')).join(' ')} ]
                </span>
              </div>
            </div>
          );
        })}

        {/* SECTION 3: DUEL OUTCOME RESOLUTION */}
        {isDuelOver && (
          <div className="bg-[#12162a] border-2 border-[#10cfe6] p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95 duration-200">
            <span
              className={`material-symbols-outlined text-5xl ${
                isPilotVictory ? 'text-[#f3f400] animate-bounce' : 'text-[#a54ed7]'
              }`}
            >
              {isPilotVictory ? 'trophy' : 'smart_toy'}
            </span>

            <div className="flex flex-col">
              <span className="font-headline text-xs uppercase tracking-widest text-[#10cfe6] font-bold">
                DUEL CONCLUSION
              </span>
              <h3 className="font-headline text-2xl text-white font-bold uppercase mt-1">
                {isPilotVictory ? 'PILOT VICTORY! YOU STUMPED ILLUCIA!' : 'ILLUCIA CRACKED YOUR CIPHER!'}
              </h3>
              <p className="font-mono-arcade text-xs text-[#8d95b5] max-w-lg mt-2 leading-relaxed">
                {isPilotVictory
                  ? `Incredible decryption defenses, Commander! Illucia exhausted all 6 of her neural shield capacitors. You successfully protected your secret cipher (${secretWord}).`
                  : `Illucia isolated your secret word (${secretWord}) through statistical frequency deduction before exhausting her shield capacitors.`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-2">
              <button
                onClick={() => handleResetDuel(protocol, secretWord)}
                className="py-3 px-4 bg-[#f3f400] hover:bg-white text-[#06070e] font-headline text-xs font-bold uppercase rounded-lg shadow-[0_3px_0_#999a00] active:translate-y-1 transition-all cursor-pointer"
              >
                RESET & PLAY AGAIN
              </button>
              <button
                onClick={() => handleResetDuel('SCHOLAR', secretWord)}
                className="py-3 px-4 bg-[#1a1f38] hover:bg-[#272937] text-[#10cfe6] font-headline text-xs font-bold uppercase rounded-lg border border-[#10cfe6]/30 active:translate-y-1 transition-all cursor-pointer"
              >
                SWITCH TO SCHOLAR
              </button>
              <button
                onClick={() => handleResetDuel('MASTER', secretWord)}
                className="py-3 px-4 bg-[#1a1f38] hover:bg-[#272937] text-[#a54ed7] font-headline text-xs font-bold uppercase rounded-lg border border-[#a54ed7]/40 active:translate-y-1 transition-all cursor-pointer"
              >
                RETRY AT MASTER
              </button>
            </div>
          </div>
        )}

        {/* Footer Attribution Citation */}
        <div className="pt-4 border-t border-[#1a1f38] flex flex-col sm:flex-row items-center justify-between text-xs text-[#525975] font-mono-arcade gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#8d95b5]">menu_book</span>
            <span>Lexicon engine powered by curated Merriam-Webster frequency models.</span>
          </div>
          <button
            onClick={() => setShowCreditsModal(true)}
            className="text-[#10cfe6] hover:text-[#f3f400] transition-colors underline uppercase font-headline text-[10px] font-bold"
          >
            Review Lexicon Licences & Credits →
          </button>
        </div>
      </div>

      <CreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
    </div>
  );
};
