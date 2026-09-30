import React, { useState, useEffect } from 'react';
import { PageId, PlayerProfile } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Homeworld } from './components/Homeworld';
import { HangmanCockpit } from './components/HangmanCockpit';
import { PlayVsAi } from './components/PlayVsAi';
import { IlluciaObservatory } from './components/IlluciaObservatory';
import { HallOfFame } from './components/HallOfFame';
import { AuthModal } from './components/AuthModal';
import { CreditsModal } from './components/CreditsModal';
import { playerService } from './services/player';
import { sound } from './services/sound';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('homeworld');
  const [player, setPlayer] = useState<PlayerProfile>(playerService.getProfile());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  useEffect(() => {
    const unsubscribe = playerService.subscribe((updated) => {
      setPlayer(updated);
    });
    return unsubscribe;
  }, []);

  const handleNavigate = (page: PageId) => {
    sound.playKeyClick();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playHitSound();
    }
  };

  const handleLogout = () => {
    sound.playKeyClick();
    playerService.logout();
  };

  return (
    <div className="bg-[#0b0d1a] min-h-screen flex flex-col font-mono-arcade text-[#e1e1f4] relative scanlines selection:bg-[#f3f400] selection:text-[#06070e]">
      {/* Top Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        player={player}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Viewport Content */}
      <main className="w-full pt-18 sm:pt-20 flex-1 relative z-10 flex flex-col pb-16 xl:pb-0">
        {currentPage === 'homeworld' && (
          <Homeworld
            onNavigate={handleNavigate}
            player={player}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentPage === 'play-hangman' && (
          <HangmanCockpit
            onNavigate={handleNavigate}
            player={player}
          />
        )}

        {currentPage === 'play-vs-ai' && (
          <PlayVsAi
            onNavigate={handleNavigate}
            player={player}
          />
        )}

        {currentPage === 'illucia' && (
          <IlluciaObservatory
            onNavigate={handleNavigate}
            player={player}
          />
        )}

        {currentPage === 'hall-of-fame' && (
          <HallOfFame
            onNavigate={handleNavigate}
            player={player}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Cockpit Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCredits={() => setIsCreditsOpen(true)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <CreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
      />
    </div>
  );
}
