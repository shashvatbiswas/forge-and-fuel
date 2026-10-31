import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { aiService, MEDICAL_DISCLAIMER } from '../src/services/aiService.js';

describe('AI Service & NLP Workout Parser', () => {
  test('Parses standard sets and reps with weight format', () => {
    const res = aiService.parseWorkoutInput('3 sets of 10 bench at 80kg');
    assert.equal(res.success, true);
    assert.equal(res.parsed.length, 1);

    const item = res.parsed[0];
    assert.equal(item.exerciseId, 'barbell-bench-press');
    assert.equal(item.sets, 3);
    assert.equal(item.reps, 10);
    assert.equal(item.weightKg, 80);
    assert.equal(item.volumeKg, 2400);
  });

  test('Parses compact NxN format ("squat 100kg 5x5")', () => {
    const res = aiService.parseWorkoutInput('squat 100kg 5x5');
    assert.equal(res.success, true);
    assert.equal(res.parsed.length, 1);

    const item = res.parsed[0];
    assert.equal(item.exerciseId, 'barbell-back-squat');
    assert.equal(item.sets, 5);
    assert.equal(item.reps, 5);
    assert.equal(item.weightKg, 100);
    assert.equal(item.volumeKg, 2500);
  });

  test('Parses multi-line workout log into multiple structured exercises', () => {
    const multiLine = `
      deadlift 140kg for 4 sets of 6 reps
      incline db press 4 sets 12 reps 30kg
      pullups 3 sets 10 reps bodyweight
    `;
    const res = aiService.parseWorkoutInput(multiLine);
    assert.equal(res.success, true);
    assert.equal(res.parsed.length, 3);

    assert.equal(res.parsed[0].exerciseId, 'barbell-deadlift');
    assert.equal(res.parsed[0].sets, 4);
    assert.equal(res.parsed[0].reps, 6);
    assert.equal(res.parsed[0].weightKg, 140);

    assert.equal(res.parsed[1].exerciseId, 'incline-dumbbell-press');
    assert.equal(res.parsed[1].sets, 4);
    assert.equal(res.parsed[1].reps, 12);
    assert.equal(res.parsed[1].weightKg, 30);

    assert.equal(res.parsed[2].exerciseId, 'pull-ups');
    assert.equal(res.parsed[2].isBodyweight, true);
    assert.equal(res.parsed[2].sets, 3);
    assert.equal(res.parsed[2].reps, 10);
  });

  test('Converts imperial pounds (lbs) to kg accurately', () => {
    const res = aiService.parseWorkoutInput('bench press 3 sets 8 reps 200 lbs');
    assert.equal(res.success, true);
    const item = res.parsed[0];
    // 200 lbs * 0.453592 = ~90.7 kg
    assert.ok(item.weightKg >= 90 && item.weightKg <= 91);
  });

  test('Handles empty or invalid input safely', () => {
    const emptyRes = aiService.parseWorkoutInput('');
    assert.equal(emptyRes.parsed.length, 0);

    const nonStringRes = aiService.parseWorkoutInput(null);
    assert.equal(nonStringRes.parsed.length, 0);
  });
});

describe('AI Coach & Evidence-Based Knowledge Base', () => {
  test('Provides biomechanical shoulder safety tips and disclaimer', () => {
    const advice = aiService.askAiCoach('My shoulder hurts during bench press, what swap can I do?');
    assert.ok(advice.reply.includes('Shoulder Protection'));
    assert.ok(advice.reply.includes('Floor Press') || advice.reply.includes('Neutral-Grip'));
    assert.equal(advice.disclaimer, MEDICAL_DISCLAIMER);
  });

  test('Provides squat knee tracking recommendations', () => {
    const advice = aiService.askAiCoach('knee pain during deep squat');
    assert.ok(advice.reply.includes('Knee Health'));
    assert.ok(advice.reply.includes('Box Squats') || advice.reply.includes('Goblet Squats'));
    assert.ok(advice.disclaimer.includes('MEDICAL & SAFETY DISCLAIMER'));
  });

  test('Gives pull-up progression ladder for beginners', () => {
    const advice = aiService.askAiCoach('cannot do a pullup progression');
    assert.ok(advice.reply.includes('Pull-Up Progression Ladder'));
    assert.ok(advice.reply.includes('Lat Pulldowns') || advice.reply.includes('Scapular Pulls'));
  });
});

describe('Smart Habits & Recovery Advisor', () => {
  test('Calculates fatigue index and muscle readiness map', () => {
    const mockLogs = [
      { date: new Date().toISOString(), workoutTitle: 'Alpha Push Hypertrophy', totalVolumeKg: 8500 },
      { date: new Date().toISOString(), workoutTitle: 'Heavy Back & Pull', totalVolumeKg: 7800 }
    ];

    const recovery = aiService.analyzeRecoveryAndSchedule({
      workoutLogs: mockLogs,
      userGoal: 'hypertrophy',
      targetDaysPerWeek: 4
    });

    assert.ok(recovery.fatigueIndex > 0);
    assert.ok(recovery.optimalTimeWindow.includes('4:00 PM'));
    assert.ok(recovery.muscleReadiness.Chest < 90); // chest was worked
    assert.ok(recovery.suggestedFocus.length > 0);
  });
});

