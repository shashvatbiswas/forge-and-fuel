/**
 * Health Wearables Hub & Spotify Workout Matcher Service
 * Integrates Apple Health, Google Fit, Garmin, and Fitbit sync abstractions
 * along with BPM-matched Spotify workout audio playlists.
 */

export const WEARABLE_PROVIDERS = [
  { id: 'apple-health', name: 'Apple HealthKit', icon: 'fa-apple-whole', color: '#ff2d55', status: 'connected' },
  { id: 'google-fit', name: 'Google Fit / Health Connect', icon: 'fa-heart-pulse', color: '#4285f4', status: 'connected' },
  { id: 'garmin', name: 'Garmin Connect', icon: 'fa-gauge-high', color: '#007cc3', status: 'available' },
  { id: 'fitbit', name: 'Fitbit / Pixel Watch', icon: 'fa-clock', color: '#00b0b9', status: 'available' }
];

export const SPOTIFY_PLAYLISTS = [
  {
    id: 'heavy-strength',
    title: 'Iron Phonk & Industrial Drive',
    bpmRange: '145 – 165 BPM',
    intensity: 'Max Effort / Powerlifting',
    description: 'High-adrenaline distortion, aggressive basslines, and heavy rhythm designed for 1RM attempts.',
    tags: ['Heavy Lifting', 'Phonk', 'Aggressive'],
    spotifyUri: 'spotify:playlist:37i9dQZF1DX76t638V6482',
    webUrl: 'https://open.spotify.com/genre/workout'
  },
  {
    id: 'hiit-metabolic',
    title: 'Cyberpunk Electro Sprint',
    bpmRange: '160 – 175 BPM',
    intensity: 'High Intensity Intervals (HIIT)',
    description: 'Relentless synthesized 4-on-the-floor tempo calibrated to keep heart rate above 80% max.',
    tags: ['HIIT', 'Electro', 'Tabata'],
    spotifyUri: 'spotify:playlist:37i9dQZF1DXdLEN7aqioXM',
    webUrl: 'https://open.spotify.com/genre/workout'
  },
  {
    id: 'hypertrophy-flow',
    title: 'Deep House & Synthwave Pump',
    bpmRange: '124 – 130 BPM',
    intensity: 'Hypertrophy / Volume Circuit',
    description: 'Hypnotic rhythmic pulses and melodic synth waves for focused mind-muscle connection.',
    tags: ['Hypertrophy', 'Synthwave', 'Deep House'],
    spotifyUri: 'spotify:playlist:37i9dQZF1DX8tZskqVlaGQ',
    webUrl: 'https://open.spotify.com/genre/workout'
  },
  {
    id: 'mobility-cool',
    title: 'Mindful Lo-Fi & Parasympathetic Rest',
    bpmRange: '70 – 90 BPM',
    intensity: 'Active Recovery & Mobility',
    description: 'Warm vinyl crackle and mellow piano chords to lower cortisol and accelerate parasympathetic recovery.',
    tags: ['Cool Down', 'Mobility', 'Lo-Fi'],
    spotifyUri: 'spotify:playlist:37i9dQZF1DXdxcBWuJkbcy',
    webUrl: 'https://open.spotify.com/genre/chill'
  }
];

class IntegrationsService {
  /**
   * Fetches latest synced biometric data from connected wearables.
   */
  getWearableMetrics() {
    try {
      const stored = localStorage.getItem('ff_wearable_metrics');
      if (stored) return JSON.parse(stored);
    } catch {}

    return {
      lastSyncTime: '12 minutes ago',
      activeCaloriesBurned: 580,
      restingHeartRateBpm: 56,
      dailySteps: 9420,
      sleepHours: 7.8,
      sleepQualityScore: 88,
      readinessStrainRatio: 1.4
    };
  }

  /**
   * Simulates real-time biometric synchronization with wearable APIs.
   */
  syncWearable(providerId) {
    const freshMetrics = {
      lastSyncTime: 'Just now',
      activeCaloriesBurned: 620 + Math.floor(Math.random() * 80),
      restingHeartRateBpm: 54 + Math.floor(Math.random() * 4),
      dailySteps: 9800 + Math.floor(Math.random() * 600),
      sleepHours: 7.9,
      sleepQualityScore: 90,
      readinessStrainRatio: 1.5,
      provider: providerId
    };

    try {
      localStorage.setItem('ff_wearable_metrics', JSON.stringify(freshMetrics));
    } catch {}

    return freshMetrics;
  }

  /**
   * Suggests Spotify playlist based on current workout intensity/category.
   */
  getSuggestedPlaylistForWorkout(category = 'chest') {
    const cat = (category || '').toLowerCase();
    if (cat.includes('cardio') || cat.includes('hiit')) {
      return SPOTIFY_PLAYLISTS[1]; // HIIT
    }
    if (cat.includes('legs') || cat.includes('back')) {
      return SPOTIFY_PLAYLISTS[0]; // Heavy Strength
    }
    if (cat.includes('mobility') || cat.includes('stretch')) {
      return SPOTIFY_PLAYLISTS[3]; // Mobility
    }
    return SPOTIFY_PLAYLISTS[2]; // Hypertrophy
  }
}

export const integrationsService = new IntegrationsService();

