import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { exportService } from '../src/services/exportService.js';
import { integrationsService, SPOTIFY_PLAYLISTS, WEARABLE_PROVIDERS } from '../src/services/integrationsService.js';

describe('Export & Data Portability Service', () => {
  test('generateWorkoutsCsv generates valid CSV headers and rows', () => {
    const mockLogs = [
      {
        date: '2026-10-30',
        workoutTitle: 'Alpha Push Hypertrophy',
        durationSeconds: 3120,
        totalVolumeKg: 8420,
        completedSets: [{ exerciseId: 'barbell-bench-press' }],
        prsAchieved: ['Bench Press 85kg']
      }
    ];

    const csv = exportService.generateWorkoutsCsv(mockLogs);
    assert.ok(csv.includes('Date,Workout Title,Duration (Mins),Volume (kg),Exercises,PRs Achieved'));
    assert.ok(csv.includes('Alpha Push Hypertrophy'));
    assert.ok(csv.includes('8420'));
    assert.ok(csv.includes('52')); // 3120s / 60
  });

  test('generateNutritionCsv generates valid macro CSV output', () => {
    const mockMeals = [
      { date: '2026-10-30', mealType: 'Breakfast', name: 'Oatmeal & Whey', calories: 450, protein: 40, carbs: 55, fats: 8 }
    ];

    const csv = exportService.generateNutritionCsv(mockMeals);
    assert.ok(csv.includes('Date,Meal Slot,Food Name,Calories (kcal),Protein (g),Carbs (g),Fats (g)'));
    assert.ok(csv.includes('Oatmeal & Whey'));
    assert.ok(csv.includes('450,40,55,8'));
  });

  test('generateIcsContent produces compliant RFC 5545 iCalendar data', () => {
    const ics = exportService.generateIcsContent({
      title: 'Heavy Deadlift Session',
      description: 'Back & Hamstring workout',
      durationMinutes: 75
    });

    assert.ok(ics.includes('BEGIN:VCALENDAR'));
    assert.ok(ics.includes('VERSION:2.0'));
    assert.ok(ics.includes('BEGIN:VEVENT'));
    assert.ok(ics.includes('SUMMARY:Heavy Deadlift Session'));
    assert.ok(ics.includes('END:VEVENT'));
    assert.ok(ics.includes('END:VCALENDAR'));
  });

  test('generateGoogleCalendarUrl creates valid query parameter string', () => {
    const url = exportService.generateGoogleCalendarUrl({
      title: 'Iron Back Workout',
      description: 'Lat pulldowns and rows',
      durationMinutes: 60
    });

    assert.ok(url.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE'));
    assert.ok(url.includes('text=Iron%20Back%20Workout'));
    assert.ok(url.includes('details=Lat%20pulldowns%20and%20rows'));
  });
});

describe('Health Wearables & Spotify Matcher', () => {
  test('Integrations service returns initial biometric metrics', () => {
    const metrics = integrationsService.getWearableMetrics();
    assert.ok(metrics.activeCaloriesBurned > 0);
    assert.ok(metrics.restingHeartRateBpm > 0);
    assert.ok(metrics.dailySteps > 0);
  });

  test('Syncs wearable provider and returns updated metrics', () => {
    const fresh = integrationsService.syncWearable('apple-health');
    assert.equal(fresh.provider, 'apple-health');
    assert.equal(fresh.lastSyncTime, 'Just now');
  });

  test('Spotify matcher suggests playlist based on intensity', () => {
    const heavy = integrationsService.getSuggestedPlaylistForWorkout('legs');
    assert.ok(heavy.title.includes('Phonk'));

    const hiit = integrationsService.getSuggestedPlaylistForWorkout('cardio');
    assert.ok(hiit.title.includes('Cyberpunk'));

    const mobility = integrationsService.getSuggestedPlaylistForWorkout('mobility');
    assert.ok(mobility.title.includes('Lo-Fi'));
  });
});

