import { LeaderboardEntry } from '../types';
import { playerService } from './player';

export type ArchiveSimState = 'live' | 'empty' | 'error';

export function getLeaderboardEntries(simState: ArchiveSimState = 'live'): LeaderboardEntry[] {
  if (simState === 'empty') {
    return [];
  }
  if (simState === 'error') {
    throw new Error('Telemetry uplink from lunar sector DEEP-8 interrupted by solar flare.');
  }

  const profile = playerService.getProfile();

  // Top list
  const entries: LeaderboardEntry[] = [
    {
      rank: 1,
      callsign: 'CYBER_VANGUARD',
      subtext: 'SECTOR LEGEND // PROTOCOL PRIME',
      rescues: 18,
      words: 18,
      streak: 7,
      score: 1800,
      badge: 'CHAMPION'
    },
    {
      rank: 2,
      callsign: profile.callsign.toUpperCase(),
      subtext: profile.isLoggedIn ? 'ACTIVE PILOT // CURRENT RUN' : 'GUEST RECON // UNREGISTERED',
      rescues: profile.rescues,
      words: profile.rescues,
      streak: profile.streak,
      score: profile.score,
      badge: profile.isLoggedIn ? 'ACTIVE PILOT' : 'GUEST',
      isCurrentUser: true,
      isTied: profile.score === 100
    },
    {
      rank: 2,
      callsign: 'NEO_SOLARIA',
      subtext: 'CYGNUS STATION DISPATCH',
      rescues: 1,
      words: 1,
      streak: 2,
      score: 100,
      badge: 'ELITE RECRUIT',
      isTied: true
    },
    {
      rank: 4,
      callsign: 'STAR_GLIDER_9',
      subtext: 'DEEP EXPLORER RIG',
      rescues: 1,
      words: 1,
      streak: 1,
      score: 100,
      badge: 'SOLARIA VANGUARD'
    },
    {
      rank: 5,
      callsign: 'QUANTUM_KID',
      subtext: 'TRAINING POD #04',
      rescues: 0,
      words: 0,
      streak: 0,
      score: 50,
      badge: 'TRAINEE'
    }
  ];

  // Sort by score descending
  return entries.sort((a, b) => b.score - a.score);
}
