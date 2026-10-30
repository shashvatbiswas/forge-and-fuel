import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { analyticsService } from '../src/services/analyticsService.js';
import { challengeService } from '../src/services/challengeService.js';

describe('Analytics & Consistency Score Formula', () => {
  test('Perfect adherence yields 100 consistency score and S-Tier', () => {
    const result = analyticsService.calculateConsistencyScore({
      workoutsCompleted: 4,
      targetWorkouts: 4, // 40 pts
      daysWithinCalorieGoal: 7, // 30 pts
      avgWaterIntake: 2600,
      waterGoal: 2600, // 20 pts
      streakDays: 7 // 10 pts
    });

    assert.equal(result.totalScore, 100);
    assert.equal(result.tier, 'S-Tier Unstoppable');
    assert.equal(result.breakdown.training.score, 40);
    assert.equal(result.breakdown.nutrition.score, 30);
    assert.equal(result.breakdown.hydration.score, 20);
    assert.equal(result.breakdown.momentum.score, 10);
  });

  test('Zero workouts and zero adherence gives 0 score', () => {
    const result = analyticsService.calculateConsistencyScore({
      workoutsCompleted: 0,
      targetWorkouts: 4,
      daysWithinCalorieGoal: 0,
      avgWaterIntake: 0,
      waterGoal: 2500,
      streakDays: 0
    });

    assert.equal(result.totalScore, 0);
    assert.equal(result.tier, 'Building Habit');
  });

  test('Partial adherence calculates weighted components correctly', () => {
    // 2/4 workouts = 20 pts
    // 3.5/7 days nutrition = 15 pts
    // 1300/2600 water = 10 pts
    // 0 streak = 0 pts
    // Total = 45 -> C-Tier Developing
    const result = analyticsService.calculateConsistencyScore({
      workoutsCompleted: 2,
      targetWorkouts: 4,
      daysWithinCalorieGoal: 3.5,
      avgWaterIntake: 1300,
      waterGoal: 2600,
      streakDays: 0
    });

    assert.equal(result.totalScore, 45);
    assert.equal(result.tier, 'C-Tier Developing');
  });

  test('Activity Heatmap returns 84 days matrix with valid levels (0 to 4)', () => {
    const days = analyticsService.generateActivityHeatmap(
      [{ timestamp: Date.now(), totalVolumeKg: 1000 }],
      [{ id: 1, reps: 10, weight: 80 }]
    );

    assert.equal(days.length, 84);
    assert.ok(days[days.length - 1].count > 0);
    assert.ok(days[days.length - 1].level >= 1);
  });
});

describe('Challenges & Badges', () => {
  test('Initial challenges list has 7-day and 30-day items', () => {
    const challenges = challengeService.getChallenges();
    assert.ok(challenges.length >= 4);
    assert.ok(challenges.some(c => c.durationDays === 7));
    assert.ok(challenges.some(c => c.durationDays === 30));
  });

  test('Generates valid invite link with inviteCode', () => {
    const challenges = challengeService.getChallenges();
    const link = challengeService.generateInviteLink(challenges[0]);
    assert.ok(link.includes(challenges[0].inviteCode));
  });
});
