export type PageId = 'homeworld' | 'play-hangman' | 'play-vs-ai' | 'illucia' | 'hall-of-fame' | 'login';

export interface WordItem {
  word: string;
  category: string;
  definition: string;
  partOfSpeech: string;
  phonetics: string;
  example: string;
  exampleSource: string;
  refCode: string;
  hint1: string; // Etymological clue / harder synonym
  hint2: string; // Cosmic context / friendlier clue
  painting: {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
    description: string;
  };
}

export interface PlayerProfile {
  callsign: string;
  isLoggedIn: boolean;
  score: number;
  rescues: number;
  streak: number;
  rank: number;
  rankTitle: string;
}

export interface LeaderboardEntry {
  rank: number;
  callsign: string;
  subtext: string;
  rescues: number;
  words: number;
  streak: number;
  score: number;
  badge: string;
  isCurrentUser?: boolean;
  isTied?: boolean;
}

export type LexiconProtocol = 'APPRENTICE' | 'SCHOLAR' | 'MASTER';

export interface DuelTurn {
  id: string;
  roundNumber: number;
  letter: string;
  frequencyPercent: number;
  rationale: string;
  candidatesCount: number;
  status: 'PENDING' | 'HIT' | 'MISS';
  hitSlots?: number[]; // 0-indexed slots
  playerReply?: string;
  illuciaCounter?: string;
  timestamp: string;
}
