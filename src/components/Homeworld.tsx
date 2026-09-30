import React from 'react';
import { PageId, PlayerProfile } from '../types';
import { CHARACTER_ASSETS } from '../data/words';
import { sound } from '../services/sound';

interface Props {
  onNavigate: (page: PageId) => void;
  player: PlayerProfile;
  onOpenAuth: () => void;
}

export const Homeworld: React.FC<Props> = ({ onNavigate, player, onOpenAuth }) => {
  return (
    <div className="flex flex-col w-full relative">
      {/* Dynamic Atmospheric Hyperspace Canvas Backdrop */}
      <div className="absolute inset-0 -top-20 pointer-events-none overflow-hidden z-0">
        <div
          className="w-full h-[1400px] bg-cover bg-center opacity-30 mix-blend-screen scale-105 transform translate-y-[-40px]"
          style={{ backgroundImage: `url('${CHARACTER_ASSETS.backgrounds.homeworld}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070e]/40 via-[#0b0d1a]/80 to-[#0b0d1a]"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0b0d1a] to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 flex flex-col gap-10">
        {/* SECTION 1: HERO MISSION TRANSMISSION BRIEFING */}
        <section className="relative w-full flex flex-col gap-4">
          {/* Guest Points Alert Bar */}
          <div className="w-full bg-[#1a1f38]/90 backdrop-blur-md rounded-xl p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-xl border border-[#10cfe6]/20">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f3f400] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f3f400]"></span>
              </span>
              <span className="font-headline text-xs uppercase tracking-wider text-[#f3f400] font-bold">
                Priority Comm-Link // Unregistered Beacon
              </span>
              <span className="hidden md:inline font-mono-arcade text-xs text-[#cac8ab]">
                {player.isLoggedIn
                  ? `Signed in as ${player.callsign}. Each successful rescue archives +100 points to your flight log!`
                  : 'Guests: Sign in to archive your flight log and earn +100 points per successful rescue!'}
              </span>
            </div>
            {!player.isLoggedIn && (
              <button
                onClick={onOpenAuth}
                className="bg-[#e9ea00] hover:bg-white text-[#06070e] px-4 py-1.5 rounded-lg font-headline text-xs uppercase tracking-wider font-bold transition-all hover:scale-105 active:translate-y-0.5 shadow-md"
              >
                CONNECT PILOT ID
              </button>
            )}
          </div>

          {/* Main Holo-Transceiver Marquee HUD */}
          <div className="relative bg-[#12162a]/95 backdrop-blur-xl rounded-xl p-6 lg:p-10 overflow-hidden shadow-2xl border border-[#10cfe6]/30">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#10cfe6]/10 rounded-br-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#bd1b6d]/10 rounded-tl-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Professor Comms Video Pod */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative w-64 max-w-full flex flex-col items-center">
                  {/* Scanning Hologram Beam Frame */}
                  <div className="relative w-56 h-64 bg-[#272937]/90 rounded-2xl flex items-end justify-center p-2 overflow-hidden shadow-inner border border-[#10cfe6]/40">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(62,224,122,0.22),transparent_70%)]"></div>
                    <div className="absolute top-3 left-3 bg-[#06070e]/80 px-2 py-0.5 rounded-lg flex items-center gap-1.5 z-20 border border-[#3ee07a]/40">
                      <span className="w-2 h-2 rounded-full bg-[#3ee07a] animate-pulse"></span>
                      <span className="font-headline text-[9px] text-[#3ee07a] uppercase tracking-widest font-bold">
                        SIGNAL: AURORA-7
                      </span>
                    </div>

                    <img
                      src={CHARACTER_ASSETS.fastolfe.hero}
                      alt="Professor Han Fastolfe Transmission"
                      className="relative z-10 w-44 h-auto object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12162a] via-transparent to-transparent z-15"></div>
                  </div>

                  {/* Pod Base Terminal Pedestal */}
                  <div className="w-48 h-5 bg-[#1a1f38] rounded-b-xl shadow-lg flex items-center justify-center gap-2 -mt-1 border border-t-0 border-[#10cfe6]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3ee07a]"></span>
                    <span className="font-headline text-[9px] text-[#8d95b5] tracking-widest uppercase">
                      FREQ: 1420.405 MHz
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10cfe6]"></span>
                  </div>

                  <div className="mt-2 text-center">
                    <span className="font-headline text-base text-[#f1f2fa] tracking-wide block font-bold">
                      PROF. HAN FASTOLFE
                    </span>
                    <span className="font-headline text-[10px] text-[#3ee07a] uppercase tracking-widest font-bold">
                      MIT Linguistic Core Commander
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Dramatic Arcade Title & Emergency Transmission */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#bd1b6d]/20 border border-[#bd1b6d]/40 text-[#ffb4ab] font-headline text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[14px]">warning</span> URGENT SOS TRANSMISSION
                  </span>
                  <span className="font-headline text-[10px] text-[#525975] uppercase tracking-wider">
                    STANAG TELEGRAM ID: #HLX-8840
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-headline text-xs text-[#10cfe6] uppercase tracking-widest font-bold">
                    OPERATION STASIS BREAK
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline text-white tracking-tight font-bold uppercase leading-none mt-1">
                    MISSION: <span className="text-[#f3f400] drop-shadow-[0_0_20px_rgba(243,244,0,0.5)]">RESCUE ARTSY</span>
                  </h1>
                </div>

                {/* Dialogue Readout Card */}
                <div className="relative bg-[#06070e]/80 border border-[#10cfe6]/20 rounded-xl p-4 shadow-inner">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f3f400] rounded-l-xl"></div>
                  <p className="font-mono-arcade text-sm sm:text-base text-[#e1e1f4] leading-relaxed italic pl-2">
                    “Commander {player.callsign}, Professor Han Fastolfe urgently seeks your assistance. My dear friend Artsy has mysteriously shut down in sector Deep-8. Only one thing can awaken Artsy from his deep cyber-slumber — a deciphered secret word. Discover it and breathe life back into Artsy. But beware! You have a limited number of attempts before containment fails.”
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[#8d95b5] font-mono-arcade text-xs">
                    <span className="font-headline text-[10px] text-[#f3f400] uppercase font-bold">
                      &gt;&gt; TRANSMISSION CIPHER VERIFIED
                    </span>
                    <span className="font-headline text-[10px] text-[#10cfe6]">
                      RESERVE POWER CELLS: 6 MAX
                    </span>
                  </div>
                </div>

                {/* Mission Action Terminal Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    onClick={() => {
                      sound.playKeyClick();
                      onNavigate('play-hangman');
                    }}
                    className="group relative inline-flex items-center gap-3 bg-[#f3f400] hover:bg-white text-[#06070e] px-6 py-3.5 rounded-xl font-headline text-sm sm:text-base font-bold uppercase tracking-wider transition-all duration-150 shadow-[0_5px_0_#999a00] hover:shadow-[0_0_30px_rgba(243,244,0,0.65)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">
                      rocket_launch
                    </span>
                    <span>LAUNCH HANGMAN RESCUE</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06070e] animate-ping ml-1"></span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playKeyClick();
                      onNavigate('play-vs-ai');
                    }}
                    className="group relative inline-flex items-center gap-3 bg-[#1a1f38] hover:bg-[#272937] text-[#10cfe6] hover:text-white px-6 py-3.5 rounded-xl font-headline text-sm sm:text-base font-bold uppercase tracking-wider border border-[#10cfe6]/30 transition-all duration-150 shadow-[0_5px_0_#070913] hover:shadow-[0_0_24px_rgba(16,207,230,0.4)] hover:-translate-y-0.5 active:translate-y-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[24px] text-[#a54ed7] group-hover:rotate-12 transition-transform">
                      smart_toy
                    </span>
                    <span>CHALLENGE ILLUCIA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THREE CHARACTER DOSSIER CARDS */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="font-headline text-xs text-[#10cfe6] tracking-widest uppercase font-bold">
                PERSONNEL ARCHIVES
              </span>
              <h2 className="font-headline text-xl sm:text-2xl text-white uppercase font-bold tracking-tight">
                MISSION CREW & OPPONENT DOSSIERS
              </h2>
            </div>
            <div className="font-mono-arcade text-xs text-[#8d95b5] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#f3f400]"></span>
              BIOMETRIC FEED SYNCHRONIZED
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CARD 1: ARTSY */}
            <div className="relative bg-[#12162a] border border-[#ff8c00]/30 rounded-xl p-5 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_0_24px_rgba(255,140,0,0.25)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff8c00]/10 rounded-bl-full pointer-events-none"></div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#ff8c00]/20 text-[#ff8c00] font-headline text-[10px] uppercase px-2 py-0.5 rounded font-bold">
                    DESIGNATION: SOLARIA-X
                  </span>
                  <span className="font-headline text-[10px] text-[#525975]">ID: #ART-001</span>
                </div>

                <div className="relative w-full h-52 bg-[#272937] rounded-xl overflow-hidden flex items-center justify-center p-3 shadow-inner group border border-[#ff8c00]/20">
                  <img
                    src={CHARACTER_ASSETS.artsy.dossier}
                    alt="Artsy Robot in Stasis"
                    className="h-44 w-auto object-contain z-10 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 inset-x-2 z-20 bg-[#06070e]/90 backdrop-blur-md rounded-lg py-1 px-3 flex items-center justify-between border border-[#bd1b6d]/40">
                    <span className="font-headline text-[10px] text-[#ffb4ab] uppercase font-bold animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#bd1b6d]"></span>STANDBY // BATTERY 0%
                    </span>
                    <span className="font-headline text-[10px] text-[#10cfe6]">STASIS LOCK</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-headline text-lg text-[#f1f2fa] font-bold">ARTSY</h3>
                  <p className="font-headline text-xs text-[#ff8c00] uppercase tracking-wider font-bold">
                    The Silent Cosmic Artist
                  </p>
                  <p className="font-mono-arcade text-xs text-[#cac8ab] mt-2 leading-relaxed">
                    Cannot speak; communicates strictly through vibrant galactic painting. Currently shut down in emergency cryo-stasis. Each correct letter input re-energizes his circuits until a brilliant painting is revealed upon full revival.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 bg-[#272937]/60 rounded-lg p-2.5 flex items-center justify-between border border-[#ff8c00]/10">
                <span className="font-headline text-[10px] text-[#525975] uppercase">SPECIES PROTOCOL</span>
                <span className="font-headline text-[10px] text-white font-bold">CYBER-CANVAS SYNTH</span>
              </div>
            </div>

            {/* CARD 2: PROFESSOR HAN FASTOLFE */}
            <div className="relative bg-[#12162a] border border-[#3ee07a]/30 rounded-xl p-5 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_0_24px_rgba(62,224,122,0.25)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#3ee07a]/10 rounded-bl-full pointer-events-none"></div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#3ee07a]/20 text-[#3ee07a] font-headline text-[10px] uppercase px-2 py-0.5 rounded font-bold">
                    DESIGNATION: AURORA-L
                  </span>
                  <span className="font-headline text-[10px] text-[#525975]">ID: #HAN-942</span>
                </div>

                <div className="relative w-full h-52 bg-[#272937] rounded-xl overflow-hidden flex items-center justify-center p-3 shadow-inner group border border-[#3ee07a]/20">
                  <img
                    src={CHARACTER_ASSETS.fastolfe.card}
                    alt="Professor Han Fastolfe"
                    className="h-44 w-auto object-contain z-10 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 inset-x-2 z-20 bg-[#06070e]/90 backdrop-blur-md rounded-lg py-1 px-3 flex items-center justify-between border border-[#3ee07a]/40">
                    <span className="font-headline text-[10px] text-[#3ee07a] uppercase font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ee07a]"></span>MISSION ADVISOR
                    </span>
                    <span className="font-headline text-[10px] text-[#10cfe6]">HINT MASTER</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-headline text-lg text-[#f1f2fa] font-bold">PROF. HAN FASTOLFE</h3>
                  <p className="font-headline text-xs text-[#3ee07a] uppercase tracking-wider font-bold">
                    Robot Linguist from Aurora
                  </p>
                  <p className="font-mono-arcade text-xs text-[#cac8ab] mt-2 leading-relaxed">
                    Chair of Linguistics at Interstellar MIT and Artsy's steadfast companion. Fastolfe provides contextual word telemetry, letter frequency probabilities, and etymological clues to rescue his comrade.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 bg-[#272937]/60 rounded-lg p-2.5 flex items-center justify-between border border-[#3ee07a]/10">
                <span className="font-headline text-[10px] text-[#525975] uppercase">FIELD TELEMETRY</span>
                <span className="font-headline text-[10px] text-[#3ee07a] font-bold">COMPUTATIONAL SEMANTICS</span>
              </div>
            </div>

            {/* CARD 3: ILLUCIA */}
            <div className="relative bg-[#12162a] border border-[#a54ed7]/30 rounded-xl p-5 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_0_24px_rgba(165,78,215,0.25)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#a54ed7]/15 rounded-bl-full pointer-events-none"></div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#a54ed7]/20 text-[#a54ed7] font-headline text-[10px] uppercase px-2 py-0.5 rounded font-bold">
                    DESIGNATION: PROTO-AI
                  </span>
                  <span className="font-headline text-[10px] text-[#525975]">ID: #ILU-X7</span>
                </div>

                <div className="relative w-full h-52 bg-[#272937] rounded-xl overflow-hidden flex items-center justify-center p-3 shadow-inner group border border-[#a54ed7]/20">
                  <img
                    src={CHARACTER_ASSETS.illucia.dossier}
                    alt="Illucia AI Rival"
                    className="h-44 w-auto object-contain z-10 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 inset-x-2 z-20 bg-[#06070e]/90 backdrop-blur-md rounded-lg py-1 px-3 flex items-center justify-between border border-[#a54ed7]/40">
                    <span className="font-headline text-[10px] text-[#a54ed7] uppercase font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a54ed7]"></span>NEURAL OPPONENT
                    </span>
                    <span className="font-headline text-[10px] text-[#10cfe6]">11,200 WORDS</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-headline text-lg text-[#f1f2fa] font-bold">ILLUCIA</h3>
                  <p className="font-headline text-xs text-[#a54ed7] uppercase tracking-wider font-bold">
                    Fastolfe's Prodigy Daughter
                  </p>
                  <p className="font-mono-arcade text-xs text-[#cac8ab] mt-2 leading-relaxed">
                    Nerdy, supersmart, confident, and delightfully cheeky. She challenges incoming commanders in an inverted guessing duel: can you stump her neural net before she deduces your secret vocabulary matrix?
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 bg-[#272937]/60 rounded-lg p-2.5 flex items-center justify-between border border-[#a54ed7]/10">
                <span className="font-headline text-[10px] text-[#525975] uppercase">COGNITIVE ENGINE</span>
                <span className="font-headline text-[10px] text-[#a54ed7] font-bold">REVERSE DUEL MATRIX</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: GAMEPLAY PROTOCOLS */}
        <section className="flex flex-col gap-4">
          <div>
            <span className="font-headline text-xs text-[#f3f400] tracking-widest uppercase font-bold">
              MISSION MANUAL // SPEC 2.4
            </span>
            <h2 className="font-headline text-xl sm:text-2xl text-white uppercase font-bold tracking-tight">
              ENGAGEMENT PROTOCOLS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1f38] border border-[#f3f400]/20 rounded-xl p-5 flex flex-col gap-2 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#f3f400]/15 flex items-center justify-center text-[#f3f400]">
                <span className="material-symbols-outlined text-[28px]">password</span>
              </div>
              <span className="font-headline text-[10px] text-[#f3f400] uppercase tracking-wider font-bold">
                PROTOCOL 01
              </span>
              <h3 className="font-headline text-base text-[#f1f2fa] font-bold">
                Crack the Secret Word
              </h3>
              <p className="font-mono-arcade text-xs text-[#cac8ab] leading-relaxed">
                Construct the ancient cybernetic activation code one letter at a time. Each successful discovery re-aligns Artsy’s optical sensory filaments before containment destabilizes.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1.5 font-mono-arcade text-xs text-[#8d95b5]">
                <span className="material-symbols-outlined text-[16px] text-[#3ee07a]">check_circle</span>
                Keyboard or Virtual Switch-Pad
              </div>
            </div>

            <div className="bg-[#1a1f38] border border-[#10cfe6]/20 rounded-xl p-5 flex flex-col gap-2 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#10cfe6]/15 flex items-center justify-center text-[#10cfe6]">
                <span className="material-symbols-outlined text-[28px]">shield</span>
              </div>
              <span className="font-headline text-[10px] text-[#10cfe6] uppercase tracking-wider font-bold">
                PROTOCOL 02
              </span>
              <h3 className="font-headline text-base text-[#f1f2fa] font-bold">
                No Gallows, Pure Tech
              </h3>
              <p className="font-mono-arcade text-xs text-[#cac8ab] leading-relaxed">
                Zero macabre gallows in deep space. You defend Artsy’s core containment unit monitored across six distinct glowing cyber power cells. Protect every spark.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1.5 font-mono-arcade text-xs text-[#8d95b5]">
                <span className="material-symbols-outlined text-[16px] text-[#10cfe6]">battery_charging_full</span>
                6 Plasma Life Cells Active
              </div>
            </div>

            <div className="bg-[#1a1f38] border border-[#a54ed7]/20 rounded-xl p-5 flex flex-col gap-2 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#a54ed7]/15 flex items-center justify-center text-[#a54ed7]">
                <span className="material-symbols-outlined text-[28px]">menu_book</span>
              </div>
              <span className="font-headline text-[10px] text-[#a54ed7] uppercase tracking-wider font-bold">
                PROTOCOL 03
              </span>
              <h3 className="font-headline text-base text-[#f1f2fa] font-bold">
                Merriam-Webster Lexicon
              </h3>
              <p className="font-mono-arcade text-xs text-[#cac8ab] leading-relaxed">
                Broaden your stellar vocabulary. Round conclusions unlock collegiate definitions, phonetics, parts of speech, and studio voice pronunciation logs directly from the lexicon.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1.5 font-mono-arcade text-xs text-[#8d95b5]">
                <span className="material-symbols-outlined text-[16px] text-[#a54ed7]">verified</span>
                Collegiate Definition Engine
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: QUICK ARCADE LAUNCH CONSOLE */}
        <section className="bg-[#06070e]/95 border border-[#10cfe6]/30 rounded-2xl p-6 lg:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1a1f38] flex items-center justify-center text-[#f3f400] shadow-inner border border-[#f3f400]/30">
                <span className="material-symbols-outlined text-[32px] animate-pulse">sports_esports</span>
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3ee07a] animate-ping"></span>
                  <span className="font-headline text-xs text-[#3ee07a] uppercase tracking-widest font-bold">
                    FREE PLAY COCKPIT READY
                  </span>
                </div>
                <h2 className="font-headline text-xl sm:text-2xl text-white uppercase font-bold tracking-tight">
                  ARCADE FLIGHT LAUNCHER
                </h2>
              </div>
            </div>

            <div className="bg-[#12162a] border border-[#f3f400]/30 px-6 py-2 rounded-xl flex items-center gap-4 shadow-md">
              <div className="text-right">
                <span className="font-headline text-[10px] text-[#525975] uppercase tracking-wider block">
                  CURRENT RECORD
                </span>
                <span className="font-headline text-lg text-[#f3f400] font-bold tracking-wider">
                  1,800 PTS
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#f3f400]/20 flex items-center justify-center text-[#f3f400]">
                <span className="material-symbols-outlined text-[20px]">military_tech</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#12162a]/80 border border-[#10cfe6]/20 rounded-xl p-4 lg:p-6">
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-[#1a1f38]/60 rounded-xl border border-[#10cfe6]/10">
              <div className="w-32 h-3 bg-[#06070e] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] mb-2 relative flex items-center justify-center">
                <div className="w-8 h-1 bg-[#f3f400]/50 rounded-full animate-pulse"></div>
              </div>
              <span className="font-headline text-[10px] text-[#8d95b5] uppercase tracking-widest text-center">
                INSERT COIN TO INITIALIZE
              </span>
              <span className="font-headline text-base text-[#f3f400] tracking-widest uppercase font-bold mt-1">
                FREE PLAY ACTIVE
              </span>
              <span className="font-mono-arcade text-xs text-[#525975] mt-1">
                CREDITS: ∞ // ALL SENSORS NOMINAL
              </span>
            </div>

            <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-4 w-full">
              <button
                onClick={() => {
                  sound.playKeyClick();
                  onNavigate('play-hangman');
                }}
                className="w-full flex-1 group bg-[#f3f400] hover:bg-white text-[#06070e] p-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-[0_5px_0_#999a00] hover:shadow-[0_0_25px_rgba(243,244,0,0.6)] transition-all hover:-translate-y-0.5 active:translate-y-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">play_circle</span>
                  <span className="font-headline text-base uppercase font-bold tracking-wider">
                    STANDARD MODE
                  </span>
                </div>
                <span className="font-headline text-[10px] text-[#06070e]/80 font-bold uppercase tracking-widest">
                  Rescuing Artsy with Fastolfe Hints
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playKeyClick();
                  onNavigate('play-vs-ai');
                }}
                className="w-full flex-1 group bg-[#1a1f38] hover:bg-[#272937] text-[#10cfe6] hover:text-white p-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-[0_5px_0_#070913] border border-[#10cfe6]/30 hover:shadow-[0_0_25px_rgba(16,207,230,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px] text-[#a54ed7]">neurology</span>
                  <span className="font-headline text-base uppercase font-bold tracking-wider">
                    VS ILLUCIA AI
                  </span>
                </div>
                <span className="font-headline text-[10px] text-[#8d95b5] font-bold uppercase tracking-widest">
                  Reverse Deduction Word Duel
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[#525975] font-mono-arcade text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3ee07a]"></span>
              <span>LEXICON DATABASE: 45,000+ STEM & ARTS TERMS</span>
            </div>
            <div>
              <span>AUDIO ENGINE: READY</span> • <span>STASIS TIMER: STANDBY</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
