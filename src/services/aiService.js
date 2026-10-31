/**
 * AI Features Service
 * Provides:
 * 1. Natural-Language Workout Logging (Regex NLP parser converting free text to structured sets/reps)
 * 2. AI Coach Chat Engine (Evidence-based training, biomechanics, exercise swaps & medical disclaimers)
 * 3. Smart Habits & Recovery Advisor (Fatigue index, muscle readiness, and schedule optimization)
 */

export const MEDICAL_DISCLAIMER =
  '⚠️ MEDICAL & SAFETY DISCLAIMER: FORGE AI provides general sports science education and biomechanical suggestions for healthy adults. It does not replace medical advice, physical therapy, or orthopedic evaluation. If experiencing sharp pain, cease movement immediately and consult a physician.';

// Curated exercise aliases for fuzzy NLP matching
const EXERCISE_ALIASES = [
  { id: 'barbell-bench-press', name: 'Barbell Flat Bench Press', aliases: ['bench', 'bench press', 'flat bench', 'flat barbell bench', 'bp'] },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', aliases: ['incline bench', 'incline db press', 'incline dumbbell', 'incline press'] },
  { id: 'barbell-deadlift', name: 'Conventional Barbell Deadlift', aliases: ['deadlift', 'dl', 'deadlifts', 'barbell deadlift'] },
  { id: 'pull-ups', name: 'Bodyweight Pull-Ups', aliases: ['pullup', 'pull-up', 'pullups', 'pull ups', 'chin up', 'chin-ups', 'chins'] },
  { id: 'barbell-back-squat', name: 'Barbell High Bar Back Squat', aliases: ['squat', 'squats', 'back squat', 'barbell squat', 'bb squat'] },
  { id: 'romanian-deadlift', name: 'Dumbbell Romanian Deadlift (RDL)', aliases: ['rdl', 'romanian deadlift', 'db rdl', 'stiff leg deadlift'] },
  { id: 'overhead-press', name: 'Standing Overhead Barbell Press (OHP)', aliases: ['ohp', 'overhead press', 'military press', 'shoulder press'] },
  { id: 'barbell-row', name: 'Bent-Over Barbell Row', aliases: ['barbell row', 'bent over row', 'bb row', 'pendlay row', 'row'] },
  { id: 'dumbbell-bicep-curl', name: 'Incline Dumbbell Bicep Curl', aliases: ['curl', 'curls', 'bicep curls', 'bicep curl', 'db curls'] },
  { id: 'triceps-pushdown', name: 'Cable Triceps Rope Pushdown', aliases: ['tricep pushdown', 'rope pushdown', 'tricep extension', 'pushdowns'] },
  { id: 'hanging-leg-raise', name: 'Hanging Knee & Leg Raise', aliases: ['leg raises', 'hanging leg raise', 'knee raise', 'abs'] }
];

// Evidence-based AI knowledge base for instant coaching queries
const COACH_KNOWLEDGE_BASE = [
  {
    keywords: ['shoulder', 'pain', 'bench', 'impingement', 'hurts'],
    title: 'Shoulder Protection During Pressing',
    response: `When pressing causes anterior shoulder discomfort:
1. **Tuck your elbows**: Reduce humeral flare from 90° down to 45°–70° relative to your torso.
2. **Scapular retraction**: Pin shoulder blades hard into the bench padding ("pack into back pockets") before unracking.
3. **Recommended Regression/Swap**: Switch temporarily to **Neutral-Grip Dumbbell Floor Press** or **Swiss/Football Bar Press** to relieve rotator cuff strain.`,
    category: 'biomechanics'
  },
  {
    keywords: ['squat', 'knee', 'knees', 'depth', 'pain'],
    title: 'Squat Biomechanics & Knee Health',
    response: `To optimize knee tracking during squats:
1. **Push knees along toe line**: Ensure knees do not cave inward (valgus collapse) out of the hole.
2. **Tripod foot contact**: Distribute pressure evenly across heel, 1st metatarsal (big toe root), and 5th metatarsal (pinky toe root).
3. **Recommended Regression/Swap**: Substitute with **Box Squats** (enforces posterior hip hinge) or **Goblet Squats with elevated heels** to build deep ankle dorsiflexion safely.`,
    category: 'biomechanics'
  },
  {
    keywords: ['pullup', 'pull-up', 'cannot', 'weak', 'progression', 'swap'],
    title: 'Pull-Up Progression Ladder',
    response: `To achieve your first full dead-hang pull-up or increase volume:
1. **Scapular Pulls**: 3 sets of 8 reps holding top depression for 2 seconds.
2. **Negative Eccentrics**: Jump to top and take a strict 4–5 second descent.
3. **Recommended Swap**: Use heavy **Neutral-Grip Lat Pulldowns** and **Inverted Bodyweight Ring Rows** until horizontal/vertical pulling strength matches body mass.`,
    category: 'progression'
  },
  {
    keywords: ['sore', 'doms', 'recovery', 'stiff', 'tired', 'fatigue'],
    title: 'Managing DOMS & Neurological Fatigue',
    response: `Delayed Onset Muscle Soreness (DOMS) reflects microscopic myofibrillar repair:
1. **Hydration & Electrolytes**: Maintain baseline 35ml/kg water intake + sodium/potassium.
2. **Active Recovery**: 20–30 mins low-intensity zone 1 walking or light cycling increases lymphatic drainage and muscular blood flow without extra systemic load.
3. **Protein Target**: Consume 1.6–2.2g of protein per kg of body mass distributed over 3–5 meals.`,
    category: 'recovery'
  },
  {
    keywords: ['bulk', 'cut', 'calories', 'deficit', 'surplus', 'fat loss'],
    title: 'Energy Balance & Periodization',
    response: `To balance muscle preservation and body composition:
- **Fat Loss Cut**: Target a conservative 20% caloric deficit (~400–500 kcal below TDEE) while keeping protein high (2.0–2.4g/kg) to preserve lean tissue.
- **Lean Hypertrophy Bulk**: Target a 10%–15% caloric surplus (~250–350 kcal above TDEE). Aim for 0.25–0.5% body weight gain per week to minimize adipose storage.`,
    category: 'nutrition'
  }
];

class AiService {
  /**
   * Parses free-form text into structured workout logs.
   * Examples:
   *   "3 sets of 10 bench at 80kg"
   *   "squat 100kg 5x5"
   *   "deadlift 140kg for 4 sets of 6 reps"
   *   "pullups 3 sets 12 reps bodyweight"
   */
  parseWorkoutInput(input) {
    if (!input || typeof input !== 'string') {
      return { parsed: [], error: 'Input must be a non-empty string' };
    }

    const lines = input
      .split(/\n|;|\band\b/i)
      .map(l => l.trim())
      .filter(Boolean);

    const parsedResults = [];

    for (const rawLine of lines) {
      const match = this._parseSingleWorkoutLine(rawLine);
      if (match) {
        parsedResults.push(match);
      }
    }

    return {
      rawInput: input,
      parsed: parsedResults,
      count: parsedResults.length,
      success: parsedResults.length > 0
    };
  }

  _parseSingleWorkoutLine(line) {
    const clean = line.toLowerCase().replace(/,/g, '');

    // 1. Identify exercise
    let detectedExercise = null;
    let exerciseName = 'Custom Exercise';
    let exerciseId = 'custom-exercise';

    for (const item of EXERCISE_ALIASES) {
      for (const alias of item.aliases) {
        const regex = new RegExp(`\\b${alias.replace(/[-]/g, '\\-')}\\b`, 'i');
        if (regex.test(clean)) {
          detectedExercise = item;
          exerciseName = item.name;
          exerciseId = item.id;
          break;
        }
      }
      if (detectedExercise) break;
    }

    // 2. Extract Sets and Reps
    // Patterns:
    // Pattern A: "5x5", "3 x 10", "4X12"
    // Pattern B: "3 sets of 10", "4 sets 12 reps", "3 set 10 rep"
    // Pattern C: "10 reps 3 sets"
    let sets = 3;
    let reps = 10;

    const patternNxN = clean.match(/(\d+)\s*[x×]\s*(\d+)/i);
    const patternSetsReps = clean.match(/(\d+)\s*(?:sets|set)\s*(?:of)?\s*(\d+)\s*(?:reps|rep)?/i);
    const patternRepsSets = clean.match(/(\d+)\s*(?:reps|rep)\s*(?:for|in)?\s*(\d+)\s*(?:sets|set)/i);

    if (patternNxN) {
      sets = parseInt(patternNxN[1], 10);
      reps = parseInt(patternNxN[2], 10);
    } else if (patternSetsReps) {
      sets = parseInt(patternSetsReps[1], 10);
      reps = parseInt(patternSetsReps[2], 10);
    } else if (patternRepsSets) {
      reps = parseInt(patternRepsSets[1], 10);
      sets = parseInt(patternRepsSets[2], 10);
    }

    // 3. Extract Weight (kg or lbs)
    // Patterns: "80kg", "80 kg", "175 lbs", "at 80", "@ 100", "100 kilos"
    let weightKg = 0;
    const isBodyweight = /\b(bodyweight|bw|body weight)\b/i.test(clean);

    if (!isBodyweight) {
      const patternWeight = clean.match(/(?:at|@|load|weight)?\s*(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilo|kilos|lbs|lb)?\b/i);
      const specificKgMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilo|kilos)/i);
      const specificLbsMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:lbs|lb)/i);

      if (specificKgMatch) {
        weightKg = parseFloat(specificKgMatch[1]);
      } else if (specificLbsMatch) {
        // Convert lbs to kg
        weightKg = Math.round(parseFloat(specificLbsMatch[1]) * 0.453592 * 10) / 10;
      } else if (patternWeight && !patternNxN) {
        // If it's a standalone number not caught by sets/reps
        const val = parseFloat(patternWeight[1]);
        if (val > 15) { // usually weights are > 15
          weightKg = val;
        }
      }
    }

    const calculatedVolumeKg = sets * reps * weightKg;

    return {
      rawLine: line,
      exerciseId,
      exerciseName,
      sets,
      reps,
      weightKg,
      isBodyweight,
      volumeKg: calculatedVolumeKg,
      confidence: detectedExercise ? 0.95 : 0.65
    };
  }

  /**
   * Interactive AI Coach advice engine
   */
  askAiCoach(query, userContext = {}) {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return {
        reply: "Hello Athlete! Ask me anything about form correction, exercise swaps, recovery strategies, or programming adjustments.",
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    const cleanQuery = query.toLowerCase();

    // Match against knowledge base
    let bestMatch = null;
    let highestScore = 0;

    for (const entry of COACH_KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (cleanQuery.includes(kw)) {
          score += 1;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry;
      }
    }

    let responseContent = '';
    if (bestMatch && highestScore > 0) {
      responseContent = `### 🎯 ${bestMatch.title}\n\n${bestMatch.response}`;
    } else {
      // General supportive coaching answer
      responseContent = `### 💡 Coach Advice\n\nFor **"${query.trim()}"**, remember the core principles of progressive overload:
1. **Consistency Over Ego**: Perfect eccentric control (2–3 second lowering) before increasing mechanical load.
2. **Recovery Window**: Muscles require 48 hours to rebuild glycogen stores and repair micro-tears.
3. **Action Step**: Track your sets, maintain adequate hydration (35ml/kg), and aim for 1–2 reps in reserve (RIR).`;
    }

    // Add personalization if user context is provided
    if (userContext.name) {
      responseContent = `**Hey ${userContext.name}, here is what sports science recommends:**\n\n` + responseContent;
    }

    return {
      query: query.trim(),
      reply: responseContent,
      disclaimer: MEDICAL_DISCLAIMER,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Smart Habits & Recovery Advisor
   * Calculates systemic fatigue index, muscle readiness map, and optimal workout windows.
   */
  analyzeRecoveryAndSchedule({ workoutLogs = [], userGoal = 'maintenance', targetDaysPerWeek = 4 } = {}) {
    // 1. Calculate weekly volume and fatigue
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const pastWeekLogs = workoutLogs.filter(w => new Date(w.date || now) >= sevenDaysAgo);
    const previousWeekLogs = workoutLogs.filter(w => {
      const d = new Date(w.date || now);
      return d >= fourteenDaysAgo && d < sevenDaysAgo;
    });

    const pastWeekVolume = pastWeekLogs.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
    const previousWeekVolume = previousWeekLogs.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0) || (pastWeekVolume || 10000);

    // Volume ratio: If volume spiked by >30%, fatigue is elevated
    const volumeRatio = pastWeekVolume / previousWeekVolume;
    let fatigueIndex = Math.min(100, Math.round(volumeRatio * 45 + pastWeekLogs.length * 8));
    if (fatigueIndex < 10) fatigueIndex = 25; // baseline

    // 2. Muscle Readiness Model (Chest, Back, Legs, Shoulders, Arms, Core)
    const muscleReadiness = {
      Chest: 90,
      Back: 85,
      Legs: 80,
      Shoulders: 95,
      Arms: 90,
      Core: 100
    };

    // If recent workouts exist, degrade readiness for targeted groups
    pastWeekLogs.forEach(w => {
      const title = (w.workoutTitle || '').toLowerCase();
      if (title.includes('push') || title.includes('chest')) {
        muscleReadiness.Chest = Math.max(30, muscleReadiness.Chest - 35);
        muscleReadiness.Shoulders = Math.max(40, muscleReadiness.Shoulders - 25);
      }
      if (title.includes('pull') || title.includes('back')) {
        muscleReadiness.Back = Math.max(30, muscleReadiness.Back - 35);
        muscleReadiness.Arms = Math.max(40, muscleReadiness.Arms - 25);
      }
      if (title.includes('leg') || title.includes('squat')) {
        muscleReadiness.Legs = Math.max(25, muscleReadiness.Legs - 45);
      }
    });

    // 3. Optimal Workout Window
    const optimalTimeWindow = '4:00 PM – 7:00 PM';
    const windowRationale =
      'Circadian rhythm sports science indicates peak core body temperature, maximal muscular contractility, and peak grip strength occur in late afternoon.';

    // 4. Action Recommendation
    let status = 'OPTIMAL_TRAIN';
    let recommendation = 'Your central nervous system and muscular readiness are in peak condition. Great day for progressive overload!';

    if (fatigueIndex >= 85) {
      status = 'DELOAD_RECOMMENDED';
      recommendation =
        'High systemic fatigue detected (>85%). Schedule an active recovery session (light walking, mobility drills) or reduce working volume by 40% today.';
    } else if (fatigueIndex >= 65) {
      status = 'MODERATE_FATIGUE';
      recommendation =
        'Moderate neuromuscular fatigue. Prioritize adequate post-workout protein, 8 hours of sleep, and warm up with thorough dynamic mobility.';
    }

    // Identify best recovered muscle group
    const bestReadyGroup = Object.entries(muscleReadiness).sort((a, b) => b[1] - a[1])[0];

    return {
      fatigueIndex,
      status,
      recommendation,
      optimalTimeWindow,
      windowRationale,
      muscleReadiness,
      suggestedFocus: `${bestReadyGroup[0]} (${bestReadyGroup[1]}% Readiness)`,
      weeklySessionsCount: pastWeekLogs.length,
      targetDaysPerWeek
    };
  }
}

export const aiService = new AiService();

