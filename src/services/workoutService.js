/**
 * Workout & Circuit Service
 * Handles custom workout routines, circuits, interval timers, PR detection,
 * and guided workout state machine.
 */

import { exercisesData } from '../data/workoutData.js';
import { audioCueService } from './audioService.js';

export const STARTER_ROUTINES = [
  {
    id: 'starter_push_strength',
    title: 'Alpha Push Hypertrophy',
    category: 'strength',
    difficulty: 'Intermediate',
    description: 'Heavy compound chest, shoulders, and triceps builder.',
    circuits: [
      {
        id: 'c1',
        name: 'Primary Chest Compound',
        restBetweenSets: 90,
        exercises: [
          { exerciseId: 'barbell-bench-press', sets: 4, reps: 8, weight: 80, duration: 0 }
        ]
      },
      {
        id: 'c2',
        name: 'Upper Chest & Shoulders Superset',
        restBetweenSets: 60,
        exercises: [
          { exerciseId: 'incline-dumbbell-press', sets: 3, reps: 10, weight: 26, duration: 0 },
          { exerciseId: 'standing-overhead-press', sets: 3, reps: 10, weight: 45, duration: 0 }
        ]
      },
      {
        id: 'c3',
        name: 'Triceps Burnout',
        restBetweenSets: 45,
        exercises: [
          { exerciseId: 'dips-chest-triceps', sets: 3, reps: 12, weight: 0, duration: 0 }
        ]
      }
    ]
  },
  {
    id: 'starter_pull_core',
    title: 'Iron Back & Core Destroyer',
    category: 'hypertrophy',
    difficulty: 'Intermediate',
    description: 'Lat width, mid-back density, and rotational core stability.',
    circuits: [
      {
        id: 'c1',
        name: 'Posterior Chain Anchor',
        restBetweenSets: 120,
        exercises: [
          { exerciseId: 'barbell-deadlift', sets: 4, reps: 6, weight: 120, duration: 0 }
        ]
      },
      {
        id: 'c2',
        name: 'Vertical Pull & Row Circuit',
        restBetweenSets: 60,
        exercises: [
          { exerciseId: 'pull-ups', sets: 3, reps: 10, weight: 0, duration: 0 },
          { exerciseId: 'barbell-bent-over-row', sets: 3, reps: 10, weight: 70, duration: 0 }
        ]
      },
      {
        id: 'c3',
        name: 'Core Compression',
        restBetweenSets: 45,
        exercises: [
          { exerciseId: 'hanging-leg-raise', sets: 3, reps: 15, weight: 0, duration: 0 }
        ]
      }
    ]
  },
  {
    id: 'starter_fullbody_hiit',
    title: 'Metabolic Matrix HIIT',
    category: 'cardio',
    difficulty: 'All Levels',
    description: 'High-intensity interval training circuit to incinerate calories and forge stamina.',
    circuits: [
      {
        id: 'c1',
        name: 'Metabolic Conditioning Circuit',
        restBetweenSets: 45,
        exercises: [
          { exerciseId: 'barbell-squat', sets: 4, reps: 15, weight: 60, duration: 0 },
          { exerciseId: 'push-ups', sets: 4, reps: 20, weight: 0, duration: 0 },
          { exerciseId: 'plank-hold', sets: 4, reps: 1, weight: 0, duration: 60 }
        ]
      }
    ]
  }
];

class WorkoutService {
  constructor() {
    this.workouts = this.load('ff_custom_workouts', STARTER_ROUTINES);
    this.logs = this.load('ff_workout_logs', []);
    this.personalRecords = this.load('ff_prs', {}); // { [exerciseId]: { weight, reps, estimated1RM, date } }
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  // ── Workout CRUD ─────────────────────────────────────────────────────────────
  getAllWorkouts() {
    return this.workouts;
  }

  getWorkoutById(id) {
    return this.workouts.find(w => w.id === id);
  }

  saveWorkout(workout) {
    const idx = this.workouts.findIndex(w => w.id === workout.id);
    if (idx >= 0) {
      this.workouts[idx] = workout;
    } else {
      this.workouts.unshift(workout);
    }
    this.save('ff_custom_workouts', this.workouts);
    return workout;
  }

  duplicateWorkout(id) {
    const original = this.getWorkoutById(id);
    if (!original) return null;
    const duplicated = {
      ...JSON.parse(JSON.stringify(original)),
      id: `w_${Date.now()}`,
      title: `${original.title} (Copy)`
    };
    this.workouts.unshift(duplicated);
    this.save('ff_custom_workouts', this.workouts);
    return duplicated;
  }

  deleteWorkout(id) {
    this.workouts = this.workouts.filter(w => w.id !== id);
    this.save('ff_custom_workouts', this.workouts);
  }

  // ── PR Detection ─────────────────────────────────────────────────────────────
  /**
   * Epley formula: 1RM = weight * (1 + reps / 30)
   */
  calculateEstimated1RM(weight, reps) {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    if (r <= 0 || w <= 0) return 0;
    if (r === 1) return w;
    return Math.round(w * (1 + r / 30) * 10) / 10;
  }

  checkAndRecordPR(exerciseId, weight, reps) {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    if (w <= 0 || r <= 0) return null;

    const est1RM = this.calculateEstimated1RM(w, r);
    const existing = this.personalRecords[exerciseId];

    if (!existing || est1RM > existing.estimated1RM) {
      const pr = {
        exerciseId,
        weight: w,
        reps: r,
        estimated1RM: est1RM,
        previous1RM: existing ? existing.estimated1RM : 0,
        date: new Date().toISOString()
      };
      this.personalRecords[exerciseId] = pr;
      this.save('ff_prs', this.personalRecords);
      return pr;
    }
    return null;
  }

  getPRForExercise(exerciseId) {
    return this.personalRecords[exerciseId] || null;
  }

  // ── Log Workout ──────────────────────────────────────────────────────────────
  logCompletedWorkout(workoutLog) {
    const enrichedLog = {
      id: `log_${Date.now()}`,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
      ...workoutLog
    };
    this.logs.unshift(enrichedLog);
    this.save('ff_workout_logs', this.logs);
    return enrichedLog;
  }

  getLogs() {
    return this.logs;
  }
}

export const workoutService = new WorkoutService();
