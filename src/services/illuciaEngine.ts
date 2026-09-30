import { LexiconProtocol } from '../types';

export const DICTIONARY_WORDS: string[] = [
  'STELLAR', 'NEBULA', 'ECLIPSE', 'ASTRONAUT', 'PENDULUM', 'VOYAGER', 'GALAXY',
  'CYBERNETIC', 'SOLARIA', 'ORBITAL', 'GRAVITY', 'COSMOS', 'QUASAR', 'SPECTRAL',
  'HORIZON', 'PULSAR', 'AURORA', 'MATRIX', 'CORONA', 'PLANET', 'SATELLITE',
  'COMET', 'METEOR', 'TELESCOPE', 'INTERSTELLAR', 'ZENITH', 'SOLAR', 'LUNAR',
  'PHOTON', 'QUANTUM', 'VACUUM', 'FUSION', 'ASTEROID', 'CRATER', 'CLUSTER',
  'APOGEE', 'PERIGEE', 'PARALLAX', 'SYNTHETIC', 'CHRONO', 'ANTENNA', 'TRANSMIT',
  'BEACON', 'DEEP', 'CYPHER', 'RADAR', 'CIRCUIT', 'SENSOR', 'STASIS', 'ROCKET',
  'SHIELD', 'SPHERE', 'SYSTEM', 'VECTOR', 'VELOCITY', 'ENERGY', 'PLASMA', 'ENGINE',
  'REGULAR', 'SPELLAR', 'DWELLER', 'STEALER', 'SCALER', 'SHELLER', 'SMELLER',
  'CAPSULE', 'MODULE', 'COMMANDER', 'PILOT', 'EXPLORER', 'DISCOVERY', 'JOURNEY'
];

export const LEXICON_COUNTS: Record<LexiconProtocol, number> = {
  APPRENTICE: 4000,
  SCHOLAR: 8500,
  MASTER: 11200
};

export interface FrequencyBar {
  letter: string;
  percent: number;
  count: number;
}

export function filterCandidates(
  wordLength: number,
  revealedSlots: (string | null)[],
  missedLetters: string[]
): string[] {
  return DICTIONARY_WORDS.filter((word) => {
    if (word.length !== wordLength) return false;

    // Check revealed letter positions
    for (let i = 0; i < wordLength; i++) {
      const rev = revealedSlots[i];
      if (rev && word[i] !== rev) {
        return false;
      }
      if (!rev && revealedSlots.includes(word[i])) {
        // If letter is not revealed here, word can't have a letter that's already completely revealed elsewhere
        // unless it's a multiple occurrence that was revealed
      }
    }

    // Check missed letters
    for (const missed of missedLetters) {
      if (word.includes(missed)) {
        return false;
      }
    }

    return true;
  });
}

export function calculateLetterFrequencies(
  candidates: string[],
  alreadyGuessed: string[]
): FrequencyBar[] {
  const counts: Record<string, number> = {};
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  alphabet.forEach((letter) => {
    if (!alreadyGuessed.includes(letter)) {
      counts[letter] = 0;
    }
  });

  const total = candidates.length || 1;

  candidates.forEach((w) => {
    const lettersInWord = new Set(w.split(''));
    lettersInWord.forEach((char) => {
      if (counts[char] !== undefined) {
        counts[char] += 1;
      }
    });
  });

  // Convert to FrequencyBar array
  const bars: FrequencyBar[] = Object.keys(counts)
    .filter((k) => counts[k] > 0 || !alreadyGuessed.includes(k))
    .map((letter) => {
      const c = counts[letter] || 0;
      const pct = Math.round((c / total) * 100);
      return {
        letter,
        percent: Math.max(pct, candidates.length > 0 ? (c > 0 ? Math.max(pct, 5) : 0) : 0),
        count: c
      };
    })
    .sort((a, b) => b.percent - a.percent);

  // Fallback if candidates are few or empty
  if (bars.length === 0 || bars.every((b) => b.count === 0)) {
    const fallbackLetters = ['E', 'A', 'T', 'O', 'I', 'N', 'S', 'R', 'L', 'D']
      .filter((l) => !alreadyGuessed.includes(l));
    return fallbackLetters.slice(0, 8).map((letter, idx) => ({
      letter,
      percent: Math.max(10, 60 - idx * 7),
      count: 10 - idx
    }));
  }

  return bars.slice(0, 8);
}

export function getIlluciaNextHypothesis(
  wordLength: number,
  revealedSlots: (string | null)[],
  missedLetters: string[],
  protocol: LexiconProtocol = 'MASTER'
): {
  letter: string;
  percent: number;
  totalCandidates: number;
  speech: string;
  frequencies: FrequencyBar[];
} {
  const allGuessed = [
    ...revealedSlots.filter((l): l is string => Boolean(l)),
    ...missedLetters
  ];

  let candidates = filterCandidates(wordLength, revealedSlots, missedLetters);
  if (candidates.length === 0) {
    // Graceful fallback candidates
    candidates = DICTIONARY_WORDS.filter((w) => w.length === wordLength);
  }

  const basePoolSize = LEXICON_COUNTS[protocol];
  // Calculate scaled simulated candidate count
  const reductionRatio = candidates.length / Math.max(DICTIONARY_WORDS.filter(w => w.length === wordLength).length, 1);
  const simulatedCandidateCount = Math.max(1, Math.round(basePoolSize * reductionRatio));

  const frequencies = calculateLetterFrequencies(candidates, allGuessed);
  const best = frequencies[0] || { letter: 'E', percent: 66, count: 1 };

  let speech = '';
  if (allGuessed.length === 0) {
    speech = `Based on lexical density in ${wordLength}-letter English words, my primary hypothesis is letter ${best.letter} (appears in ${best.percent}% of candidate branches). Is there an ${best.letter} in your word?`;
  } else if (simulatedCandidateCount <= 3) {
    speech = `I have narrowed the entire space down to just ${simulatedCandidateCount} candidate branches! Is there an ${best.letter}? Let’s see if you can stump me, Commander!`;
  } else {
    speech = `Examining consonant and vowel dispersion... My probability peak points straight to letter ${best.letter} (${best.percent}% prevalence in the remaining ${simulatedCandidateCount.toLocaleString()} candidates). How about ${best.letter}?`;
  }

  return {
    letter: best.letter,
    percent: best.percent,
    totalCandidates: simulatedCandidateCount,
    speech,
    frequencies
  };
}

export function getIlluciaHitReaction(revealedSlotIndex: number, remainingCandidates: number): string {
  return `Spot #${revealedSlotIndex + 1}! Brilliant. That single hit instantly prunes unmatching words from my memory tree. Active dictionary narrowed down to ${remainingCandidates.toLocaleString()} possibilities. Proceeding!`;
}

export function getIlluciaMissReaction(banterReply: string): string {
  if (banterReply.includes('smart')) {
    return `"That wasn't so smart ;)"? Just testing your perimeter! Disconnecting 1 shield capacitor. I still have energy to burn!`;
  }
  if (banterReply.includes('wrong')) {
    return `Heh, don't get cocky, Commander! Even quantum deep-learning cores test false branches. Purging all words with that letter from synthesis matrix.`;
  }
  return `Zero aboard? Noted. Re-routing computational heuristics to adjacent phonetic clusters!`;
}
