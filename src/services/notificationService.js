/**
 * Web Notifications & Reminder Service
 * Handles browser push/system notifications with permission management
 * and in-app toast fallbacks.
 */

class NotificationService {
  constructor() {
    this.hasPermission = typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  }

  async requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      this.hasPermission = result === 'granted';
      return this.hasPermission;
    } catch {
      return false;
    }
  }

  notify(title, options = {}) {
    if (this.hasPermission && 'Notification' in window) {
      try {
        new Notification(title, {
          icon: '/assets/hero_athlete_red.png',
          badge: '/assets/hero_athlete_red.png',
          silent: false,
          ...options
        });
        return true;
      } catch {
        // Fallback below
      }
    }

    // In-app fallback
    if (typeof window !== 'undefined' && window.app && window.app.showToast) {
      window.app.showToast(`${title}: ${options.body || ''}`);
    }
    return false;
  }

  scheduleWaterReminder(minutes = 60) {
    if (typeof window === 'undefined') return null;
    return setTimeout(() => {
      this.notify('Hydration Check 💧', {
        body: "Time for a sip! Keep your body primed and muscles hydrated.",
        tag: 'water-reminder'
      });
    }, minutes * 60 * 1000);
  }
}

export const notificationService = new NotificationService();
