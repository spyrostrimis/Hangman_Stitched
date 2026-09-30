import React from 'react';
import { PageId, PlayerProfile } from '../types';
import { CHARACTER_ASSETS } from '../data/words';
import { sound } from '../services/sound';

interface Props {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  player: PlayerProfile;
  onLogout: () => void;
  onOpenAuth: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<Props> = ({
  currentPage,
  onNavigate,
  player,
  onLogout,
  onOpenAuth,
  isMuted,
  onToggleMute
}) => {
  return (
    <>
      {/* Desktop / Tablet Header */}
      <header className="fixed top-0 w-full z-50 bg-[#06070e]/90 backdrop-blur-xl border-b border-[#10cfe6]/25">
        <div className="h-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand wordmark */}
          <div 
            onClick={() => onNavigate('homeworld')}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
          >
            <img
              src={CHARACTER_ASSETS.logo}
              alt="Hangman Rescue Mission Badge Logo"
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-white text-base sm:text-lg tracking-wider font-bold leading-none font-display drop-shadow-[0_0_10px_rgba(243,244,0,0.35)] group-hover:text-[#f3f400] transition-colors">
                HANGMAN: RESCUE MISSION
              </span>
              <span className="font-headline text-[10px] text-[#10cfe6] tracking-widest uppercase mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ee07a] animate-ping"></span>
                COCKPIT V3.4 // SECTOR DEEP-8
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-[#12162a] rounded-xl border border-[#10cfe6]/30 glow-box-cyan">
            <button
              onClick={() => onNavigate('homeworld')}
              className={`px-4 py-2 uppercase font-headline text-xs font-bold rounded-lg transition-all ${
                currentPage === 'homeworld'
                  ? 'bg-[#e9ea00] text-[#06070e] shadow-[0_0_14px_rgba(243,244,0,0.5)]'
                  : 'text-[#8d95b5] hover:text-white hover:bg-[#1a1f38]'
              }`}
            >
              HOMEWORLD
            </button>
            <button
              onClick={() => onNavigate('play-hangman')}
              className={`px-4 py-2 uppercase font-headline text-xs font-bold rounded-lg transition-all ${
                currentPage === 'play-hangman'
                  ? 'bg-[#e9ea00] text-[#06070e] shadow-[0_0_14px_rgba(243,244,0,0.5)]'
                  : 'text-[#8d95b5] hover:text-white hover:bg-[#1a1f38]'
              }`}
            >
              PLAY HANGMAN
            </button>
            <button
              onClick={() => onNavigate('play-vs-ai')}
              className={`px-4 py-2 uppercase font-headline text-xs font-bold rounded-lg transition-all ${
                currentPage === 'play-vs-ai'
                  ? 'bg-[#e9ea00] text-[#06070e] shadow-[0_0_14px_rgba(243,244,0,0.5)]'
                  : 'text-[#8d95b5] hover:text-white hover:bg-[#1a1f38]'
              }`}
            >
              PLAY VS AI
            </button>
            <button
              onClick={() => onNavigate('illucia')}
              className={`px-4 py-2 uppercase font-headline text-xs font-bold rounded-lg transition-all ${
                currentPage === 'illucia'
                  ? 'bg-[#e9ea00] text-[#06070e] shadow-[0_0_14px_rgba(243,244,0,0.5)]'
                  : 'text-[#8d95b5] hover:text-white hover:bg-[#1a1f38]'
              }`}
            >
              ILLUCIA
            </button>
            <button
              onClick={() => onNavigate('hall-of-fame')}
              className={`px-4 py-2 uppercase font-headline text-xs font-bold rounded-lg transition-all ${
                currentPage === 'hall-of-fame'
                  ? 'bg-[#e9ea00] text-[#06070e] shadow-[0_0_14px_rgba(243,244,0,0.5)]'
                  : 'text-[#8d95b5] hover:text-white hover:bg-[#1a1f38]'
              }`}
            >
              HALL OF FAME
            </button>
          </nav>

          {/* Zone 3: Pilot Credentials & Sound */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-[#1a1f38] text-[#8d95b5] hover:text-white'
                  : 'bg-[#1a1f38] text-[#3ee07a] shadow-[0_0_10px_rgba(62,224,122,0.3)]'
              }`}
              title={isMuted ? 'Sound Muted (Click to enable)' : 'Sound Online (Click to mute)'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>

            {/* Pilot Status Card */}
            {player.isLoggedIn ? (
              <div 
                onClick={() => onNavigate('hall-of-fame')}
                className="hidden md:flex items-center gap-2.5 bg-[#1a1f38] px-3.5 py-1.5 rounded-xl border border-[#10cfe6]/30 hover:border-[#10cfe6] transition-colors cursor-pointer"
              >
                <div className="flex flex-col text-right">
                  <span className="font-headline text-xs text-[#f1f2fa] uppercase tracking-wide font-bold">
                    {player.callsign}
                  </span>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-headline text-[10px] text-[#f3f400] font-bold">
                      {player.score} PTS
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#525975]"></span>
                    <span className="font-headline text-[10px] text-[#10cfe6]">
                      RANK 0{player.rank}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#06070e] font-bold shadow-md">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#e9ea00] text-[#06070e] font-headline text-xs font-bold rounded-lg shadow-[0_0_12px_rgba(243,244,0,0.4)] hover:brightness-110 active:translate-y-0.5 transition-all uppercase"
              >
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                <span>SIGN IN</span>
              </button>
            )}

            {/* Logout or Quick Auth */}
            {player.isLoggedIn ? (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-[#1a1f38] border border-[#bd1b6d]/50 hover:border-[#bd1b6d] text-[#ffb4ab] font-headline text-xs rounded-lg transition-all hover:bg-[#93000a] hover:text-white uppercase tracking-wider"
              >
                LOGOUT
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="md:hidden px-3 py-1.5 bg-[#e9ea00] text-[#06070e] font-headline text-xs font-bold rounded-lg uppercase"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation Dock (strictly touch-friendly) */}
      <nav className="xl:hidden fixed bottom-0 w-full z-50 bg-[#12162a]/95 backdrop-blur-xl border-t border-[#10cfe6]/30 shadow-[0_-2px_12px_rgba(16,207,230,0.15)] pb-safe">
        <div className="h-16 px-1 flex items-center justify-around">
          <button
            onClick={() => onNavigate('homeworld')}
            className={`flex flex-col items-center justify-center min-w-[54px] h-12 transition-all ${
              currentPage === 'homeworld'
                ? 'text-[#f3f400] drop-shadow-[0_0_8px_rgba(243,244,0,0.7)]'
                : 'text-[#8d95b5] hover:text-[#10cfe6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            <span className="font-headline text-[9px] tracking-tight uppercase mt-0.5">HOME</span>
          </button>

          <button
            onClick={() => onNavigate('play-hangman')}
            className={`flex flex-col items-center justify-center min-w-[54px] h-12 transition-all ${
              currentPage === 'play-hangman'
                ? 'text-[#f3f400] drop-shadow-[0_0_8px_rgba(243,244,0,0.7)]'
                : 'text-[#8d95b5] hover:text-[#10cfe6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">videogame_asset</span>
            <span className="font-headline text-[9px] tracking-tight uppercase mt-0.5">HANGMAN</span>
          </button>

          <button
            onClick={() => onNavigate('play-vs-ai')}
            className={`flex flex-col items-center justify-center min-w-[54px] h-12 transition-all ${
              currentPage === 'play-vs-ai'
                ? 'text-[#f3f400] drop-shadow-[0_0_8px_rgba(243,244,0,0.7)]'
                : 'text-[#8d95b5] hover:text-[#10cfe6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            <span className="font-headline text-[9px] tracking-tight uppercase mt-0.5">VS AI</span>
          </button>

          <button
            onClick={() => onNavigate('illucia')}
            className={`flex flex-col items-center justify-center min-w-[54px] h-12 transition-all ${
              currentPage === 'illucia'
                ? 'text-[#f3f400] drop-shadow-[0_0_8px_rgba(243,244,0,0.7)]'
                : 'text-[#8d95b5] hover:text-[#10cfe6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">psychology</span>
            <span className="font-headline text-[9px] tracking-tight uppercase mt-0.5">ILLUCIA</span>
          </button>

          <button
            onClick={() => onNavigate('hall-of-fame')}
            className={`flex flex-col items-center justify-center min-w-[54px] h-12 transition-all ${
              currentPage === 'hall-of-fame'
                ? 'text-[#f3f400] drop-shadow-[0_0_8px_rgba(243,244,0,0.7)]'
                : 'text-[#8d95b5] hover:text-[#10cfe6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">military_tech</span>
            <span className="font-headline text-[9px] tracking-tight uppercase mt-0.5">FAME</span>
          </button>
        </div>
      </nav>
    </>
  );
};
