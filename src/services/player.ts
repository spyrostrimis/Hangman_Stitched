import { PlayerProfile } from '../types';

const STORAGE_KEY = 'hangman_rescue_player_profile';

const DEFAULT_PROFILE: PlayerProfile = {
  callsign: 'Commander Alex',
  isLoggedIn: true,
  score: 100,
  rescues: 1,
  streak: 3,
  rank: 2,
  rankTitle: 'Rank 04 // Master Decryptor'
};

export class PlayerService {
  private static instance: PlayerService;
  private profile: PlayerProfile;
  private listeners: Array<(profile: PlayerProfile) => void> = [];

  private constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.profile = JSON.parse(saved);
      } catch {
        this.profile = DEFAULT_PROFILE;
      }
    } else {
      this.profile = DEFAULT_PROFILE;
      this.save();
    }
  }

  public static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.profile));
  }

  public subscribe(listener: (profile: PlayerProfile) => void): () => void {
    this.listeners.push(listener);
    listener(this.profile);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getProfile(): PlayerProfile {
    return { ...this.profile };
  }

  public addRescueWin(points: number = 100) {
    this.profile.score += points;
    this.profile.rescues += 1;
    this.profile.streak += 1;
    if (this.profile.score >= 1800) {
      this.profile.rank = 1;
    } else {
      this.profile.rank = 2;
    }
    this.save();
  }

  public resetStreak() {
    this.profile.streak = 0;
    this.save();
  }

  public login(callsign: string) {
    this.profile.callsign = callsign;
    this.profile.isLoggedIn = true;
    this.save();
  }

  public logout() {
    this.profile.isLoggedIn = false;
    this.profile.callsign = 'Guest Pilot';
    this.save();
  }

  public register(callsign: string) {
    this.profile.callsign = callsign;
    this.profile.isLoggedIn = true;
    // Cadets retain their points and are now officially ranked
    this.save();
  }
}

export const playerService = PlayerService.getInstance();
