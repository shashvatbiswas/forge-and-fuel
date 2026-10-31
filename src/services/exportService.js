/**
 * Export & Data Portability Service
 * Handles CSV exports for workouts and nutrition, RFC 5545 iCalendar (.ics) generation,
 * Google Calendar links, and printable summary exports.
 */

class ExportService {
  /**
   * Converts workout history logs to CSV format.
   */
  generateWorkoutsCsv(logs = []) {
    const headers = ['Date', 'Workout Title', 'Duration (Mins)', 'Volume (kg)', 'Exercises', 'PRs Achieved'];
    const rows = logs.map(l => {
      const date = l.date || new Date().toISOString().slice(0, 10);
      const title = `"${(l.workoutTitle || 'Workout').replace(/"/g, '""')}"`;
      const duration = Math.round((l.durationSeconds || 0) / 60);
      const volume = l.totalVolumeKg || 0;
      const exercises = `"${(l.completedSets ? [...new Set(l.completedSets.map(s => s.exerciseId))].join('; ') : '').replace(/"/g, '""')}"`;
      const prs = `"${(l.prsAchieved || []).join('; ').replace(/"/g, '""')}"`;
      return [date, title, duration, volume, exercises, prs].join(',');
    });

    return [headers.join(','), ...rows].join('\r\n');
  }

  /**
   * Converts nutrition logs to CSV format.
   */
  generateNutritionCsv(meals = []) {
    const headers = ['Date', 'Meal Slot', 'Food Name', 'Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fats (g)'];
    const rows = meals.map(m => {
      const date = m.date || new Date().toISOString().slice(0, 10);
      const slot = `"${(m.mealType || m.type || 'Meal').replace(/"/g, '""')}"`;
      const name = `"${(m.name || 'Food').replace(/"/g, '""')}"`;
      const cals = m.calories || 0;
      const p = m.protein || 0;
      const c = m.carbs || 0;
      const f = m.fats || 0;
      return [date, slot, name, cals, p, c, f].join(',');
    });

    return [headers.join(','), ...rows].join('\r\n');
  }

  /**
   * Generates standard RFC 5545 .ics iCalendar file content.
   */
  generateIcsContent({ title = 'FORGE & FUEL Workout Session', description = 'Scheduled workout session.', startDate = new Date(), durationMinutes = 60 } = {}) {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const pad = n => String(n).padStart(2, '0');
    const formatIcsDate = d =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const dtStamp = formatIcsDate(new Date());
    const dtStart = formatIcsDate(start);
    const dtEnd = formatIcsDate(end);
    const uid = `forge-fuel-${Date.now()}@forgeandfuel.app`;

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FORGE & FUEL MATRIX//Fitness Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${title.replace(/[\r\n]/g, ' ')}`,
      `DESCRIPTION:${description.replace(/[\r\n]/g, ' ')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  /**
   * Builds direct Google Calendar schedule link.
   */
  generateGoogleCalendarUrl({ title = 'FORGE & FUEL Workout', description = 'Resistance training session', startDate = new Date(), durationMinutes = 60 } = {}) {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const pad = n => String(n).padStart(2, '0');
    const formatGDate = d =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const dates = `${formatGDate(start)}/${formatGDate(end)}`;
    const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    return `${base}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${dates}`;
  }

  /**
   * Triggers file download in the browser.
   */
  downloadFile(filename, content, mimeType = 'text/plain') {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();

