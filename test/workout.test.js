import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { workoutService } from '../src/services/workoutService.js';

describe('Workout Service & PR Detection', () => {
  test('calculateEstimated1RM uses Epley formula correctly', () => {
    // 100kg for 10 reps: 100 * (1 + 10/30) = 100 * 1.3333 = 133.3
    const est1RM = workoutService.calculateEstimated1RM(100, 10);
    assert.equal(est1RM, 133.3);

    // 1 rep max equals the weight lifted
    const singleRep = workoutService.calculateEstimated1RM(140, 1);
    assert.equal(singleRep, 140);
  });

  test('Calculates zero for non-positive values', () => {
    assert.equal(workoutService.calculateEstimated1RM(0, 10), 0);
    assert.equal(workoutService.calculateEstimated1RM(100, 0), 0);
  });

  test('Default starter routines exist and have valid circuits', () => {
    const workouts = workoutService.getAllWorkouts();
    assert.ok(workouts.length >= 3);
    assert.ok(workouts[0].circuits.length > 0);
    assert.ok(workouts[0].circuits[0].exercises.length > 0);
  });
});
