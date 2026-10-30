/**
 * Challenges, Streaks & Badges Service
 * Manages 7-day & 30-day challenges, invite links, progress tracking,
 * and unlockable achievement badges.
 */

export const INITIAL_CHALLENGES = [
  {
    id: 'c_7_discipline',
    title: '7-Day Iron Discipline',
    durationDays: 7,
    type: 'workouts',
    target: 5,
    description: 'Crush 5 intense workout sessions across 7 days.',
    icon: 'fa-dumbbell',
    badgeId: 'iron-will',
    badgeName: 'Iron Will',
    participantsCount: 428,
    isJoined: true,
    progress: 3,
    inviteCode: 'IRON7-FORGE'
  },
  {
    id: 'c_7_hydration',
    title: '7-Day Hydration Titan',
    durationDays: 7,
    type: 'water',
    target: 7,
    description: 'Hit 100% of your daily water intake goal for 7 consecutive days.',
    icon: 'fa-droplet',
    badgeId: 'hydration-master',
    badgeName: 'Hydration Titan',
    participantsCount: 612,
    isJoined: true,
    progress: 5,
    inviteCode: 'HYDRO7-TITAN'
  },
  {
    id: 'c_30_hypertrophy',
    title: '30-Day Hypertrophy Forge',
    durationDays: 30,
    type: 'workouts',
    target: 20,
    description: 'Log 20 high-volume workouts in 30 days to pack on dense muscle mass.',
    icon: 'fa-fire',
    badgeId: 'unstoppable-30',
    badgeName: 'Forge Master',
    participantsCount: 1240,
    isJoined: false,
    progress: 8,
    inviteCode: 'FORGE30-ELITE'
  },
  {
    id: 'c_30_macros',
    title: '30-Day Caloric Precision',
    durationDays: 30,
    type: 'nutrition',
    target: 25,
    description: 'Hit within +/- 10% of your daily calorie targets for 25 days.',
    icon: 'fa-apple-whole',
    badgeId: 'macro-master',
    badgeName: 'Macro Architect',
    participantsCount: 890,
    isJoined: false,
    progress: 12,
    inviteCode: 'MACRO30-DISCIPLINE'
  }
];

export const ALL_BADGES = [
  { id: 'iron-will', name: 'Iron Will', icon: 'fa-shield-halved', color: '#00f2fe', desc: 'Completed a 7-day training challenge' },
  { id: 'hydration-master', name: 'Hydration Titan', icon: 'fa-droplet', color: '#38bdf8', desc: 'Maintained strict daily hydration' },
  { id: 'pr-breaker', name: 'PR Breaker', icon: 'fa-bolt', color: '#f59e0b', desc: 'Shattered a personal record' },
  { id: 'century-club', name: 'Century Club', icon: 'fa-medal', color: '#e07a5f', desc: 'Logged 100 completed sets' },
  { id: 'unstoppable-30', name: 'Forge Master', icon: 'fa-trophy', color: '#10b981', desc: 'Completed a 30-day elite challenge' }
];

class ChallengeService {
  constructor() {
    this.challenges = this.load('ff_challenges', INITIAL_CHALLENGES);
    this.userBadges = this.load('ff_user_badges', ['iron-will', 'pr-breaker']);
  }

  load(key, fallback) {
    try {
      const d = localStorage.getItem(key);
      return d ? JSON.parse(d) : fallback;
    } catch {
      return fallback;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  getChallenges() {
    return this.challenges;
  }

  joinChallenge(id) {
    const c = this.challenges.find(x => x.id === id);
    if (c) {
      c.isJoined = true;
      c.participantsCount += 1;
      this.save('ff_challenges', this.challenges);
      return c;
    }
    return null;
  }

  incrementProgress(challengeId, amount = 1) {
    const c = this.challenges.find(x => x.id === challengeId);
    if (c && c.isJoined) {
      c.progress = Math.min(c.target, c.progress + amount);
      if (c.progress >= c.target && !this.userBadges.includes(c.badgeId)) {
        this.unlockBadge(c.badgeId);
      }
      this.save('ff_challenges', this.challenges);
      return c;
    }
    return null;
  }

  unlockBadge(badgeId) {
    if (!this.userBadges.includes(badgeId)) {
      this.userBadges.push(badgeId);
      this.save('ff_user_badges', this.userBadges);
      return true;
    }
    return false;
  }

  getUserBadges() {
    return ALL_BADGES.map(b => ({
      ...b,
      unlocked: this.userBadges.includes(b.id)
    }));
  }

  generateInviteLink(challenge) {
    return `https://forgefuel.app/challenge?code=${challenge.inviteCode}&ref=athlete`;
  }
}

export const challengeService = new ChallengeService();
