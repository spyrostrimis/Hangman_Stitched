import React, { useState } from 'react';
import { PageId, PlayerProfile, LeaderboardEntry } from '../types';
import { CHARACTER_ASSETS } from '../data/words';
import { getLeaderboardEntries, ArchiveSimState } from '../services/leaderboard';
import { sound } from '../services/sound';

interface Props {
  onNavigate: (page: PageId) => void;
  player: PlayerProfile;
  onOpenAuth: () => void;
}

export const HallOfFame: React.FC<Props> = ({ onNavigate, player, onOpenAuth }) => {
  const [simState, setSimState] = useState<ArchiveSimState>('live');

  let entries: LeaderboardEntry[] = [];
  let errorMsg = '';
  try {
    entries = getLeaderboardEntries(simState);
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Telemetry uplink failed.';
  }

  return (
    <div className="flex flex-col w-full relative">
      {/* ATMOSPHERIC MOON HERO BACKGROUND */}
      <div className="absolute -top-20 inset-x-0 h-[680px] pointer-events-none overflow-hidden z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-30 mix-blend-screen scale-105"
          style={{ backgroundImage: `url('${CHARACTER_ASSETS.backgrounds.lunar}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070e]/40 via-[#0b0d1a]/80 to-[#0b0d1a]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* RETRO ARCADE MARQUEE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#10cfe6]/15 text-[#10cfe6] font-headline text-[10px] uppercase tracking-widest border border-[#10cfe6]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ee07a] animate-pulse"></span>
                SECTOR 08 // LUNAR ARCHIVE V3.4
              </span>
              <span className="text-[#525975] text-xs">•</span>
              <span className="font-mono-arcade text-xs text-[#8d95b5]">CYCLE #4092-BETA</span>
            </div>
            <h1 className="text-white font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider drop-shadow-[0_0_12px_rgba(243,244,0,0.25)] font-bold">
              GALACTIC HALL OF FAME
            </h1>
            <p className="font-mono-arcade text-xs text-[#8d95b5] max-w-2xl leading-relaxed">
              Honoring elite interstellar commanders who cracked lexical ciphers, salvaged plasma cells, and revived Artsy across Solaria quadrants.
            </p>
          </div>

          {/* Marquee Telemetry Clock */}
          <div className="flex items-center gap-4 p-3 bg-[#12162a]/95 border border-[#10cfe6]/30 rounded-xl shadow-md">
            <div className="flex flex-col text-right">
              <span className="font-headline text-[10px] text-[#525975] uppercase tracking-widest">
                TRANSMISSION FREQ
              </span>
              <span className="font-mono-arcade text-xs text-[#3ee07a] font-bold">
                1420.405 MHz // STABLE
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#1a1f38] flex items-center justify-center text-[#10cfe6] shadow-sm border border-[#10cfe6]/20">
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
            </div>
          </div>
        </div>

        {/* PLAYER PERSONAL SUMMARY HERO CARD */}
        <div className="relative w-full rounded-xl overflow-hidden bg-[#1a1f38] border border-[#10cfe6]/30 shadow-xl">
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#f3f400]/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#10cfe6]/10 blur-3xl pointer-events-none"></div>

          <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Rank & Callsign */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative shrink-0 flex items-center justify-center w-20 h-20 rounded-xl bg-[#272937] border border-[#f3f400]/40 shadow-inner">
                <span className="material-symbols-outlined text-[#f3f400] text-4xl">workspace_premium</span>
                <span className="absolute -bottom-2 px-2 py-0.5 rounded bg-[#f3f400] text-[#06070e] font-headline text-[10px] font-bold tracking-widest shadow-sm">
                  RANK 0{player.rank}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-[10px] text-[#10cfe6] uppercase tracking-wider font-bold">
                    {player.isLoggedIn ? 'ACTIVE SIGNED-IN PILOT' : 'GUEST RECON PILOT'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10cfe6]"></span>
                  <span className="font-headline text-[10px] text-[#f3f400] uppercase font-bold">
                    {player.rank === 1 ? 'SECTOR CHAMPION' : 'TIED FOR PODIUM'}
                  </span>
                </div>
                <h2 className="font-headline text-xl sm:text-2xl text-white tracking-wide font-bold">
                  YOU ARE {player.rank === 1 ? '1ST' : '2ND'} WITH {player.score} POINTS.
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-mono-arcade text-xs text-[#8d95b5]">
                  <span>CALLSIGN: <strong className="text-white font-bold">{player.callsign.toUpperCase()}</strong></span>
                  <span>•</span>
                  <span>MEDAL: <strong className="text-[#3ee07a] font-bold">MASTER DECRYPTOR</strong></span>
                  <span>•</span>
                  <span>SECTOR: <strong className="text-white font-bold">DEEP-8 ORBIT</strong></span>
                </div>
              </div>
            </div>

            {/* Center / Stats Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#12162a] border border-[#10cfe6]/20 p-3 rounded-lg shadow-inner">
              <div className="flex flex-col px-3 py-1">
                <span className="font-headline text-[10px] text-[#525975] uppercase tracking-wider">TOTAL SCORE</span>
                <span className="font-headline text-lg sm:text-xl text-[#f3f400] font-bold">
                  {player.score} <span className="font-headline text-xs font-normal">PTS</span>
                </span>
              </div>
              <div className="flex flex-col px-3 py-1">
                <span className="font-headline text-[10px] text-[#525975] uppercase tracking-wider">RESCUES</span>
                <span className="font-headline text-lg sm:text-xl text-[#10cfe6] font-bold">
                  0{player.rescues} <span className="font-headline text-xs font-normal">SOLARIA</span>
                </span>
              </div>
              <div className="flex flex-col px-3 py-1 col-span-2 sm:col-span-1">
                <span className="font-headline text-[10px] text-[#525975] uppercase tracking-wider">STREAK</span>
                <span className="font-headline text-lg sm:text-xl text-[#3ee07a] font-bold">
                  {player.streak} <span className="font-headline text-xs font-normal">MISSIONS</span>
                </span>
              </div>
            </div>

            {/* Right: Action CTA */}
            <div className="shrink-0 flex items-center">
              <button
                onClick={() => {
                  sound.playKeyClick();
                  onNavigate('play-hangman');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#f3f400] hover:bg-white text-[#06070e] font-headline text-xs uppercase font-bold tracking-wider shadow-[0_4px_0_#999a00] hover:shadow-[0_0_20px_rgba(243,244,0,0.6)] active:translate-y-1 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                PLAY ANOTHER RESCUE MISSION
              </button>
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT 8-COL: THE ARCADE HIGH-SCORE CABINET TABLE */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f3f400]"></div>
                <h3 className="font-headline text-base sm:text-lg uppercase tracking-wider text-white font-bold">
                  PILOT LEADERBOARD // SOLARIA SECTOR
                </h3>
              </div>
              <span className="font-headline text-[10px] text-[#525975] uppercase tracking-widest hidden sm:inline">
                SORTED BY: CUMULATIVE SALVAGE PTS
              </span>
            </div>

            {/* The Table Cabinet */}
            <div className="w-full rounded-xl bg-[#12162a]/95 border border-[#10cfe6]/30 overflow-hidden shadow-xl">
              {simState === 'live' && entries.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a1f38] text-[#8d95b5] font-headline text-[10px] uppercase tracking-wider border-b border-[#12162a]">
                        <th className="py-3 px-4">RANK</th>
                        <th className="py-3 px-4">CALLSIGN / PILOT</th>
                        <th className="py-3 px-4 text-center">RESCUES</th>
                        <th className="py-3 px-4 text-center">WORDS</th>
                        <th className="py-3 px-4 text-center">STREAK</th>
                        <th className="py-3 px-4 text-right">SCORE</th>
                        <th className="py-3 px-4 text-right">BADGE</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono-arcade text-xs">
                      {entries.map((pilot, idx) => {
                        const isUserRow = pilot.isCurrentUser;
                        return (
                          <tr
                            key={idx}
                            className={`border-b border-[#1a1f38]/60 transition-colors ${
                              isUserRow
                                ? 'bg-[#1a1f38]/90 border-l-4 border-l-[#10cfe6] shadow-md'
                                : 'hover:bg-[#1a1f38]/40'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-headline font-bold">
                              <div className="inline-flex items-center gap-1.5">
                                <span
                                  className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                    pilot.rank === 1
                                      ? 'bg-[#f3f400] text-[#06070e]'
                                      : isUserRow
                                      ? 'bg-[#10cfe6] text-[#06070e]'
                                      : 'bg-[#272937] text-white'
                                  }`}
                                >
                                  #{pilot.rank}
                                </span>
                                {pilot.rank === 1 && (
                                  <span className="material-symbols-outlined text-[16px] text-[#f3f400]">
                                    military_tech
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                    isUserRow
                                      ? 'bg-[#10cfe6] text-[#06070e] shadow-[0_0_10px_rgba(16,207,230,0.6)]'
                                      : 'bg-[#1a1f38] text-[#8d95b5]'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    {isUserRow ? 'person' : 'satellite_alt'}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`font-headline text-xs sm:text-sm font-bold tracking-wide ${
                                        isUserRow
                                          ? 'text-[#10cfe6]'
                                          : pilot.rank === 1
                                          ? 'text-[#f3f400]'
                                          : 'text-white'
                                      }`}
                                    >
                                      {pilot.callsign}
                                    </span>
                                    {isUserRow && (
                                      <span className="px-1.5 py-0.2 rounded bg-[#f3f400] text-[#06070e] font-headline text-[9px] font-bold uppercase">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-headline text-[10px] text-[#8d95b5]">
                                    {pilot.subtext}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-center font-bold text-white">
                              {pilot.rescues < 10 ? `0${pilot.rescues}` : pilot.rescues}
                            </td>

                            <td className="py-3.5 px-4 text-center text-[#8d95b5]">
                              {pilot.words < 10 ? `0${pilot.words}` : pilot.words}
                            </td>

                            <td className="py-3.5 px-4 text-center text-[#3ee07a] font-bold">
                              {pilot.streak} 🔥
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <span
                                className={`font-headline text-sm sm:text-base font-bold ${
                                  pilot.rank === 1
                                    ? 'text-[#f3f400]'
                                    : isUserRow
                                    ? 'text-[#10cfe6]'
                                    : 'text-white'
                                }`}
                              >
                                {pilot.score.toLocaleString()}
                              </span>
                              <span className="font-headline text-[9px] text-[#525975] ml-1">PTS</span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded font-headline text-[10px] uppercase font-bold ${
                                  pilot.rank === 1
                                    ? 'bg-[#f3f400]/20 text-[#f3f400] border border-[#f3f400]/40'
                                    : isUserRow
                                    ? 'bg-[#10cfe6]/20 text-[#10cfe6] border border-[#10cfe6]/40'
                                    : 'bg-[#1a1f38] text-[#8d95b5]'
                                }`}
                              >
                                {pilot.badge}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* EMPTY STATE SIMULATION VIEW */}
              {simState === 'empty' && (
                <div className="p-8 flex flex-col items-center text-center gap-3 bg-[#0b0d1a]/80">
                  <span className="material-symbols-outlined text-4xl text-[#f3f400]">
                    hourglass_empty
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline text-base text-white uppercase font-bold">
                      NO SCORES RECORDED YET
                    </span>
                    <p className="font-mono-arcade text-xs text-[#8d95b5] max-w-sm mt-1">
                      No commanders have decrypted words in this solar cycle yet. Be the first to rescue Artsy!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sound.playKeyClick();
                      onNavigate('play-hangman');
                    }}
                    className="mt-2 px-5 py-2 rounded bg-[#f3f400] text-[#06070e] font-headline text-xs uppercase font-bold shadow-[0_2px_0_#999a00] cursor-pointer"
                  >
                    START FIRST RESCUE
                  </button>
                </div>
              )}

              {/* ERROR STATE SIMULATION VIEW */}
              {simState === 'error' && (
                <div className="p-8 flex flex-col items-center text-center gap-3 bg-[#0b0d1a]/80">
                  <span className="material-symbols-outlined text-4xl text-[#bd1b6d] animate-pulse">
                    wifi_off
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline text-base text-[#ffb4ab] uppercase font-bold">
                      TELEMETRY UPLINK LOST
                    </span>
                    <p className="font-mono-arcade text-xs text-[#8d95b5] max-w-sm mt-1">
                      {errorMsg}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sound.playKeyClick();
                      setSimState('live');
                    }}
                    className="mt-2 px-5 py-2 rounded bg-[#93000a] text-[#ffb4ab] font-headline text-xs uppercase font-bold border border-[#bd1b6d] cursor-pointer"
                  >
                    RETRY BEACON UPLINK
                  </button>
                </div>
              )}

              {/* Bottom Ledger Ticker */}
              <div className="px-4 py-2 bg-[#1a1f38] flex flex-col sm:flex-row items-center justify-between gap-1 text-[#8d95b5] font-headline text-[10px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10cfe6]"></span>
                  RECORDS REFRESHED: REALTIME BROADCAST
                </span>
                <span>SHOWING {entries.length} OF 1,420 REGISTERED MISSIONS</span>
              </div>
            </div>

            {/* ARCADE SCORING MATRIX BENTO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#12162a] border border-[#f3f400]/20 rounded-xl shadow-md flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#f3f400]">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  <span className="font-headline text-[10px] uppercase tracking-wider font-bold">
                    +100 PTS PER WORD
                  </span>
                </div>
                <p className="font-mono-arcade text-xs text-[#cac8ab] leading-relaxed">
                  Solve the hidden word before depleted life pods release Artsy into deep cosmic vacuum.
                </p>
              </div>

              <div className="p-4 bg-[#12162a] border border-[#10cfe6]/20 rounded-xl shadow-md flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#10cfe6]">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span className="font-headline text-[10px] uppercase tracking-wider font-bold">
                    STREAK MULTIPLIERS
                  </span>
                </div>
                <p className="font-mono-arcade text-xs text-[#cac8ab] leading-relaxed">
                  Every consecutive cipher cracked bolsters your rank multiplier up to 3.5x plasma yield.
                </p>
              </div>

              <div className="p-4 bg-[#12162a] border border-[#3ee07a]/20 rounded-xl shadow-md flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#3ee07a]">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span className="font-headline text-[10px] uppercase tracking-wider font-bold">
                    SOLARIA CITATION
                  </span>
                </div>
                <p className="font-mono-arcade text-xs text-[#cac8ab] leading-relaxed">
                  Flawless rounds (0 missed guesses) earn an enduring entry into Professor Han Fastolfe's Codex.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT 4-COL: CHARACTER TRANSMISSION, GUEST PROTOCOL & ARCHIVE TESTING CONTROLS */}
          <div className="xl:col-span-4 flex flex-col gap-5">
            {/* PROFESSOR FASTOLFE TRANSMISSION HUD */}
            <div className="p-4 bg-[#12162a] border border-[#3ee07a]/30 rounded-xl shadow-lg relative overflow-hidden flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-headline text-[10px] text-[#3ee07a] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#3ee07a] animate-ping"></span>
                  ARCHIVE COMMUNICATOR // LIVE
                </span>
                <span className="font-headline text-[10px] text-[#525975]">AURORA-7</span>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-14 h-14 rounded-lg bg-[#1a1f38] overflow-hidden shrink-0 shadow-md border border-[#3ee07a]/30">
                  <img
                    src={CHARACTER_ASSETS.fastolfe.avatar}
                    alt="Professor Han Fastolfe"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-xs text-white uppercase font-bold">
                    PROFESSOR HAN FASTOLFE
                  </span>
                  <span className="font-headline text-[9px] text-[#525975]">Chief Lexical Synthesizer</span>
                  <p className="font-mono-arcade text-xs text-[#cac8ab] mt-1 italic leading-relaxed">
                    "Remarkable work, Commander {player.callsign}! Your first Solaria cipher rescue has stabilized Artsy's oxygen supply. Climb to 1,800 to surpass the Cyber Vanguard!"
                  </p>
                </div>
              </div>
            </div>

            {/* GUEST CHALLENGE CALLOUT */}
            <div className="p-4 bg-[#1a1f38] border border-[#f3f400]/30 rounded-xl shadow-md flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#f3f400]">
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <span className="font-headline text-xs uppercase tracking-wider font-bold">
                  GUEST CHALLENGE PROTOCOL
                </span>
              </div>
              <p className="font-mono-arcade text-xs text-[#cac8ab] leading-relaxed">
                Playing in guest mode on an unregistered console? Register your personal Callsign to record permanent rescues and claim your 100 PTS bounty in the Hall of Fame.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 rounded-lg bg-[#10cfe6] hover:bg-white text-[#06070e] font-headline text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
                >
                  SIGN IN / REGISTER
                </button>
                <button
                  onClick={() => {
                    sound.playKeyClick();
                    onNavigate('homeworld');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#12162a] text-[#8d95b5] hover:text-white font-headline text-[10px] uppercase tracking-wider transition-colors border border-[#10cfe6]/20 cursor-pointer"
                >
                  VIEW MISSION HUD
                </button>
              </div>
            </div>

            {/* ARCHIVE TELEMETRY SIMULATOR / STATE CONTROLS (DESIGN REQUIREMENT #4) */}
            <div className="p-4 bg-[#12162a] border border-[#10cfe6]/30 rounded-xl shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline text-[10px] text-[#525975] uppercase tracking-wider">
                  ARCHIVE TELEMETRY TOGGLES
                </span>
                <span className="font-headline text-[10px] text-[#10cfe6] font-bold">DEV/TEST</span>
              </div>
              <p className="font-mono-arcade text-xs text-[#8d95b5]">
                Cycle simulated transmission states to preview telemetry responses:
              </p>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    sound.playKeyClick();
                    setSimState('live');
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg font-headline text-xs uppercase font-bold transition-all cursor-pointer ${
                    simState === 'live'
                      ? 'bg-[#1a1f38] text-[#3ee07a] border border-[#3ee07a]'
                      : 'bg-[#12162a] text-[#8d95b5] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3ee07a]"></span>
                    LIVE ARCHIVE (SYNCED)
                  </span>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                </button>

                <button
                  onClick={() => {
                    sound.playKeyClick();
                    setSimState('empty');
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg font-headline text-xs uppercase font-bold transition-all cursor-pointer ${
                    simState === 'empty'
                      ? 'bg-[#1a1f38] text-[#f3f400] border border-[#f3f400]'
                      : 'bg-[#12162a] text-[#8d95b5] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#525975]"></span>
                    EMPTY STATE SIMULATION
                  </span>
                  <span className="font-headline text-[9px] text-[#525975]">0 ENTRIES</span>
                </button>

                <button
                  onClick={() => {
                    sound.playKeyClick();
                    setSimState('error');
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg font-headline text-xs uppercase font-bold transition-all cursor-pointer ${
                    simState === 'error'
                      ? 'bg-[#1a1f38] text-[#ffb4ab] border border-[#bd1b6d]'
                      : 'bg-[#12162a] text-[#8d95b5] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#bd1b6d]"></span>
                    UPLINK FAILURE SIMULATION
                  </span>
                  <span className="font-headline text-[9px] text-[#bd1b6d]">LOST</span>
                </button>
              </div>
            </div>

            {/* CHARACTER CAMEO: ARTSY'S ARTWORK COMMENDATION */}
            <div className="p-4 bg-[#12162a] border border-[#ff8c00]/30 rounded-xl shadow-md flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-[#1a1f38] overflow-hidden shrink-0 shadow-inner border border-[#ff8c00]/30">
                <img
                  src={CHARACTER_ASSETS.artsy.dossier}
                  alt="Artsy Painting Commendation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[#ff8c00]">
                  <span className="material-symbols-outlined text-[16px]">palette</span>
                  <span className="font-headline text-[10px] uppercase font-bold tracking-wider">
                    ARTSY'S COMMENDATION
                  </span>
                </div>
                <p className="font-mono-arcade text-xs text-[#cac8ab] mt-0.5 leading-snug">
                  "Every cipher cracked paints another constellation in the Solaria sector!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: RECENT CIPHERS SALVAGED TICKER */}
        <div className="p-4 bg-[#12162a] border border-[#10cfe6]/30 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10cfe6] text-[20px]">graphic_eq</span>
            <span className="font-headline text-xs text-white uppercase tracking-wider font-bold">
              RECENT SALVAGED CIPHERS:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono-arcade text-xs">
            <span className="px-2 py-0.5 rounded bg-[#1a1f38] text-[#3ee07a] font-bold border border-[#3ee07a]/30">
              A S T R O N A U T
            </span>
            <span className="text-[#525975]">//</span>
            <span className="px-2 py-0.5 rounded bg-[#1a1f38] text-[#10cfe6] font-bold border border-[#10cfe6]/30">
              N E B U L A
            </span>
            <span className="text-[#525975]">//</span>
            <span className="px-2 py-0.5 rounded bg-[#1a1f38] text-[#f3f400] font-bold border border-[#f3f400]/30">
              P E N D U L U M
            </span>
            <span className="text-[#525975]">//</span>
            <span className="px-2 py-0.5 rounded bg-[#1a1f38] text-[#8d95b5]">
              C O S M O S
            </span>
          </div>
          <div className="flex items-center gap-1 font-headline text-[10px] text-[#525975]">
            <span>ENCRYPTION: 128-BIT LEXICON</span>
          </div>
        </div>
      </div>
    </div>
  );
};
