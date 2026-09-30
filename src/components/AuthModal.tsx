import React, { useState } from 'react';
import { CHARACTER_ASSETS } from '../data/words';
import { playerService } from '../services/player';
import { sound } from '../services/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [callsign, setCallsign] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = callsign.trim();
    if (!clean) {
      setError('Please enter your Pilot Callsign.');
      return;
    }
    if (password.length < 4) {
      setError('Please enter your Security Cipher Key.');
      return;
    }

    sound.playHitSound();
    playerService.login(clean);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = callsign.trim();
    const validRegex = /^[A-Za-z0-9_]{3,20}$/;

    if (!validRegex.test(clean)) {
      setError('Callsign must be 3-20 alphanumeric characters (A-Z, 0-9, _).');
      return;
    }
    if (password.length < 15) {
      setError('Security cipher must be at least 15 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Security cipher confirmation does not match.');
      return;
    }

    sound.playHitSound();
    playerService.register(clean);
    onClose();
  };

  const handleGuestContinue = () => {
    sound.playKeyClick();
    onClose();
  };

  const isCallsignValid = /^[A-Za-z0-9_]{3,20}$/.test(callsign.trim());
  const passLength = password.length;
  const passPercentage = Math.min(100, Math.round((passLength / 15) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-[#06070e]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12162a] border border-[#10cfe6]/40 max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 text-[#e1e1f4] my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#1a1f38] hover:bg-[#272937] flex items-center justify-center text-[#8d95b5] hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Transmission from Prof. Fastolfe */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1f38] border border-[#3ee07a]/30">
          <div className="relative shrink-0 w-12 h-14 bg-[#06070e] rounded-lg p-1 flex items-center justify-center overflow-hidden border border-[#3ee07a]/30">
            <img
              src={CHARACTER_ASSETS.fastolfe.avatar}
              alt="Prof. Fastolfe"
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#3ee07a]"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-[10px] text-[#3ee07a] uppercase font-bold tracking-wider">
              TRANSMISSION // FASTOLFE.AI
            </span>
            <p className="font-mono-arcade text-xs text-[#cac8ab] leading-snug mt-0.5">
              “Greetings Cadet! Authenticate your pilot callsign to synchronize rescued vocabulary ciphers and preserve your bounty.”
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-[#1a1f38] pb-4">
          <div className="flex flex-col">
            <span className="font-headline text-[10px] uppercase text-[#10cfe6] tracking-widest">
              TERMINAL COCKPIT ACCESS // NODE 04
            </span>
            <h2 className="font-headline text-lg sm:text-xl text-white font-bold tracking-wide">
              {mode === 'login' ? 'PILOT AUTHENTICATION' : 'CADET REGISTRATION'}
            </h2>
          </div>

          <div className="inline-flex p-1 bg-[#06070e] rounded-lg gap-1 border border-[#10cfe6]/20">
            <button
              onClick={() => {
                sound.playKeyClick();
                setMode('login');
                setError(null);
              }}
              className={`px-3 py-1 rounded font-headline text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#f3f400] text-[#06070e] shadow-md'
                  : 'text-[#8d95b5] hover:text-white'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => {
                sound.playKeyClick();
                setMode('signup');
                setError(null);
              }}
              className={`px-3 py-1 rounded font-headline text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#f3f400] text-[#06070e] shadow-md'
                  : 'text-[#8d95b5] hover:text-white'
              }`}
            >
              CREATE CALLSIGN
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-[#93000a]/40 border border-[#bd1b6d] rounded-lg text-xs font-mono-arcade text-[#ffb4ab] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* FORM VIEW: LOGIN */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-headline text-xs uppercase text-[#f1f2fa] flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#10cfe6]">badge</span>
                  PILOT CALLSIGN
                </span>
                <span className="text-[10px] text-[#525975]">A-Z, 0-9, _</span>
              </label>
              <input
                type="text"
                placeholder="e.g. COMMANDER_ALEX"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full h-11 bg-[#06070e] text-white px-3.5 rounded-lg border border-[#10cfe6]/30 font-mono-arcade text-xs placeholder:text-[#525975] focus:outline-none focus:border-[#f3f400] focus:shadow-[0_0_10px_rgba(243,244,0,0.3)] transition-all uppercase"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-headline text-xs uppercase text-[#f1f2fa] flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#f3f400]">key</span>
                  SECURITY CIPHER KEY
                </span>
                <span className="text-[10px] text-[#525975]">15-128 CHARACTERS</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter deep-space secret phrase..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 bg-[#06070e] text-white pl-3.5 pr-10 rounded-lg border border-[#10cfe6]/30 font-mono-arcade text-xs placeholder:text-[#525975] focus:outline-none focus:border-[#f3f400] focus:shadow-[0_0_10px_rgba(243,244,0,0.3)] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d95b5] hover:text-[#10cfe6] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-2 bg-[#f3f400] hover:bg-white text-[#06070e] font-headline text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_4px_0_#999a00] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              <span>AUTHENTICATE PILOT</span>
            </button>
          </form>
        ) : (
          /* FORM VIEW: SIGNUP */
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-headline text-xs uppercase text-[#f1f2fa] flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#10cfe6]">badge</span>
                  NEW CADET CALLSIGN
                </label>
                <span
                  className={`font-headline text-[10px] ${
                    isCallsignValid ? 'text-[#3ee07a]' : 'text-[#8d95b5]'
                  }`}
                >
                  {callsign.length}/20 CHARS
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. CYBER_NOVA"
                value={callsign}
                maxLength={20}
                onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                className="w-full h-11 bg-[#06070e] text-white px-3.5 rounded-lg border border-[#10cfe6]/30 font-mono-arcade text-xs placeholder:text-[#525975] focus:outline-none focus:border-[#f3f400] transition-all uppercase"
                required
              />
              <span className="font-mono-arcade text-[10px] text-[#525975]">
                * Publicly displayed across the Solaria Hall of Fame ledger.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-headline text-xs uppercase text-[#f1f2fa] flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#f3f400]">lock</span>
                  SECURITY CIPHER PHRASE
                </label>
                <span
                  className={`font-headline text-[10px] ${
                    passLength >= 15 ? 'text-[#3ee07a]' : 'text-[#bd1b6d]'
                  }`}
                >
                  {passLength} / 15 MIN
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Must be 15 to 128 characters long..."
                  value={password}
                  maxLength={128}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 bg-[#06070e] text-white pl-3.5 pr-10 rounded-lg border border-[#10cfe6]/30 font-mono-arcade text-xs placeholder:text-[#525975] focus:outline-none focus:border-[#f3f400] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d95b5] hover:text-[#10cfe6] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Strength Progress Bar */}
              <div className="w-full bg-[#06070e] h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-300 ${
                    passLength >= 15 ? 'bg-[#3ee07a]' : 'bg-[#bd1b6d]'
                  }`}
                  style={{ width: `${passPercentage}%` }}
                ></div>
              </div>

              {/* Critical Password Recovery Notice */}
              <div className="bg-[#06070e] rounded-lg p-2.5 flex items-start gap-2 border border-[#bd1b6d]/40 mt-1">
                <span className="material-symbols-outlined text-[#bd1b6d] text-[18px] shrink-0 mt-0.5">
                  warning
                </span>
                <p className="font-mono-arcade text-[11px] text-[#cac8ab] leading-snug">
                  <strong className="text-[#ffb4ab]">Notice:</strong> Password recovery is <strong>not available yet</strong> in the deep-space archive. Please store your security cipher securely!
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-headline text-xs uppercase text-[#f1f2fa] flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[16px] text-[#10cfe6]">verified</span>
                CONFIRM SECURITY CIPHER
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter security phrase to verify..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 bg-[#06070e] text-white px-3.5 rounded-lg border border-[#10cfe6]/30 font-mono-arcade text-xs placeholder:text-[#525975] focus:outline-none focus:border-[#f3f400] transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-2 bg-[#3ee07a] hover:bg-white text-[#06070e] font-headline text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_4px_0_#289450] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">app_registration</span>
              <span>REGISTER NEW CALLSIGN</span>
            </button>
          </form>
        )}

        {/* Guest Bypass Option */}
        <div className="bg-[#06070e]/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#10cfe6]/10">
          <div className="flex flex-col text-left">
            <span className="font-headline text-xs text-white uppercase font-bold">
              ANONYMOUS RECON FLIGHT
            </span>
            <span className="font-mono-arcade text-[10px] text-[#525975]">
              Test vocabulary ciphers without cloud profile sync
            </span>
          </div>
          <button
            onClick={handleGuestContinue}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1a1f38] hover:bg-[#272937] text-[#10cfe6] font-headline text-xs uppercase tracking-wider transition-all border border-[#10cfe6]/30 cursor-pointer"
          >
            CONTINUE AS GUEST
          </button>
        </div>
      </div>
    </div>
  );
};
