/**
 * Social & Community Service
 * Manages buddies, cheer interactions, community activity feed,
 * gym/office teams, leaderboards, and comments & kudos moderation.
 */

export const INITIAL_BUDDIES = [
  {
    id: 'b1',
    name: 'Sarah Connor',
    handle: '@sarah_lifts',
    avatar: 'SC',
    streakDays: 14,
    lastActivity: 'Finished Alpha Push Hypertrophy (8,420kg volume)',
    activityTime: '2 hours ago',
    cheersCount: 28,
    isCheered: false
  },
  {
    id: 'b2',
    name: 'Marcus Vance',
    handle: '@stoic_iron',
    avatar: 'MV',
    streakDays: 9,
    lastActivity: 'Set new PR: Deadlift 160kg × 5 reps 🔥',
    activityTime: '4 hours ago',
    cheersCount: 45,
    isCheered: true
  },
  {
    id: 'b3',
    name: 'Elena Rostova',
    handle: '@elena_crossfit',
    avatar: 'ER',
    streakDays: 22,
    lastActivity: 'Logged 7-Day Hydration Titan milestone 💧',
    activityTime: 'Yesterday',
    cheersCount: 64,
    isCheered: false
  }
];

export const INITIAL_TEAMS = [
  {
    id: 't1',
    name: 'Iron Forge Gym Elite',
    code: 'FORGE-88',
    description: 'Strength athletes and powerlifters pushing the limits of human potential.',
    membersCount: 42,
    weeklyVolumeKg: 184500,
    leaderboardRank: 1,
    isMember: true,
    feed: [
      { id: 'tf1', author: 'Marcus Vance', text: '160kg deadlift 5x5 done today. Keep grinding team!', time: '1h ago', kudos: 14 },
      { id: 'tf2', author: 'Coach David', text: 'Weekly volume target crushed by 12%! Hydrate well tonight.', time: '5h ago', kudos: 29 }
    ]
  },
  {
    id: 't2',
    name: 'Downtown Sunrise Bootcamp',
    code: 'SUNRISE-12',
    description: 'Early morning HIIT, metabolic circuits, and relentless discipline.',
    membersCount: 28,
    weeklyVolumeKg: 92400,
    leaderboardRank: 2,
    isMember: false,
    feed: [
      { id: 'tf3', author: 'Elena Rostova', text: '6am circuit was lethal today. Who is in tomorrow?', time: '3h ago', kudos: 18 }
    ]
  },
  {
    id: 't3',
    name: 'Silicon Valley Tech Lifters',
    code: 'TECHLIFT-01',
    description: 'Engineers, designers, and founders balancing keyboard craft with heavy iron.',
    membersCount: 35,
    weeklyVolumeKg: 84000,
    leaderboardRank: 3,
    isMember: false,
    feed: []
  }
];

export const INITIAL_FEED_ITEMS = [
  {
    id: 'post_1',
    author: 'Sarah Connor',
    authorAvatar: 'SC',
    time: '2 hours ago',
    workoutTitle: 'Alpha Push Hypertrophy',
    volumeKg: 8420,
    setsCount: 16,
    durationMins: 54,
    prs: ['Bench Press 85kg × 8'],
    kudosCount: 24,
    hasKudoed: false,
    comments: [
      { id: 'c1', authorName: 'Marcus Vance', text: 'Insane volume Sarah, that bench is flying!', time: '1h ago', isOwn: false, reported: false }
    ]
  },
  {
    id: 'post_2',
    author: 'Marcus Vance',
    authorAvatar: 'MV',
    time: '4 hours ago',
    workoutTitle: 'Posterior Chain Anchor & Deadlifts',
    volumeKg: 11200,
    setsCount: 18,
    durationMins: 62,
    prs: ['Conventional Deadlift 160kg × 5'],
    kudosCount: 42,
    hasKudoed: true,
    comments: [
      { id: 'c2', authorName: 'Elena Rostova', text: 'Clean form, beast mode activated 🚀', time: '3h ago', isOwn: false, reported: false }
    ]
  }
];

class SocialService {
  constructor() {
    this.buddies = this.load('ff_buddies', INITIAL_BUDDIES);
    this.teams = this.load('ff_teams', INITIAL_TEAMS);
    this.feed = this.load('ff_social_feed', INITIAL_FEED_ITEMS);
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

  // ── Buddies ────────────────────────────────────────────────────────────────
  getBuddies() {
    return this.buddies;
  }

  addBuddy(handleOrName) {
    const clean = handleOrName.trim();
    if (!clean) return null;
    const handle = clean.startsWith('@') ? clean : `@${clean.toLowerCase().replace(/\s+/g, '_')}`;
    const name = clean.replace(/^@/, '').replace(/_/g, ' ');

    const newBuddy = {
      id: `b_${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      handle,
      avatar: name.slice(0, 2).toUpperCase(),
      streakDays: 1,
      lastActivity: 'Joined FORGE & FUEL community',
      activityTime: 'Just now',
      cheersCount: 0,
      isCheered: false
    };

    this.buddies.unshift(newBuddy);
    this.save('ff_buddies', this.buddies);
    return newBuddy;
  }

  sendCheer(buddyId) {
    const b = this.buddies.find(x => x.id === buddyId);
    if (b) {
      b.cheersCount += 1;
      b.isCheered = true;
      this.save('ff_buddies', this.buddies);
      return b;
    }
    return null;
  }

  // ── Teams & Leaderboards ───────────────────────────────────────────────────
  getTeams() {
    return this.teams;
  }

  createTeam({ name, description, code }) {
    const newTeam = {
      id: `t_${Date.now()}`,
      name: name.trim(),
      code: (code || name.replace(/\s+/g, '').slice(0, 6)).toUpperCase(),
      description: description.trim() || 'Fitness team united in discipline.',
      membersCount: 1,
      weeklyVolumeKg: 0,
      leaderboardRank: this.teams.length + 1,
      isMember: true,
      feed: []
    };
    this.teams.push(newTeam);
    this.save('ff_teams', this.teams);
    return newTeam;
  }

  joinTeamByCode(code) {
    const cleanCode = code.trim().toUpperCase();
    const t = this.teams.find(x => x.code === cleanCode);
    if (t) {
      if (!t.isMember) {
        t.isMember = true;
        t.membersCount += 1;
        this.save('ff_teams', this.teams);
      }
      return t;
    }
    return null;
  }

  getLeaderboard() {
    return [...this.teams].sort((a, b) => (b.weeklyVolumeKg || 0) - (a.weeklyVolumeKg || 0));
  }

  // ── Feed, Kudos & Comments ─────────────────────────────────────────────────
  getFeed() {
    return this.feed;
  }

  toggleKudos(postId) {
    const post = this.feed.find(p => p.id === postId);
    if (post) {
      if (post.hasKudoed) {
        post.kudosCount -= 1;
        post.hasKudoed = false;
      } else {
        post.kudosCount += 1;
        post.hasKudoed = true;
      }
      this.save('ff_social_feed', this.feed);
      return post;
    }
    return null;
  }

  addComment(postId, authorName, text) {
    const post = this.feed.find(p => p.id === postId);
    if (!post || !text.trim()) return null;

    const newComment = {
      id: `com_${Date.now()}`,
      authorName: authorName || 'Athlete',
      text: text.trim(),
      time: 'Just now',
      isOwn: true,
      reported: false
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    this.save('ff_social_feed', this.feed);
    return newComment;
  }

  deleteComment(postId, commentId) {
    const post = this.feed.find(p => p.id === postId);
    if (post && post.comments) {
      post.comments = post.comments.filter(c => c.id !== commentId);
      this.save('ff_social_feed', this.feed);
      return true;
    }
    return false;
  }

  reportComment(postId, commentId) {
    const post = this.feed.find(p => p.id === postId);
    if (post && post.comments) {
      const c = post.comments.find(x => x.id === commentId);
      if (c) {
        c.reported = true;
        this.save('ff_social_feed', this.feed);
        return true;
      }
    }
    return false;
  }
}

export const socialService = new SocialService();
