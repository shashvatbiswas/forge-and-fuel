/**
 * BMR, TDEE & BMI Calculator Utilities
 * Mifflin-St Jeor & Standard Quetelet Index
 */

// ── Unit Conversions ─────────────────────────────────────────────────────────
export function lbsToKg(lbs) {
  const val = parseFloat(lbs);
  return isNaN(val) ? 0 : Math.round((val * 0.45359237) * 10) / 10;
}

export function kgToLbs(kg) {
  const val = parseFloat(kg);
  return isNaN(val) ? 0 : Math.round((val * 2.20462262) * 10) / 10;
}

export function feetInchesToCm(feet, inches = 0) {
  const f = parseFloat(feet) || 0;
  const i = parseFloat(inches) || 0;
  return Math.round((f * 12 + i) * 2.54);
}

export function cmToFeetInches(cm) {
  const c = parseFloat(cm) || 0;
  const totalInches = c / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

// ── BMI Calculator ───────────────────────────────────────────────────────────
export function calculateBMI(weightKg, heightCm) {
  const w = parseFloat(weightKg);
  const hMeters = parseFloat(heightCm) / 100;
  if (!w || !hMeters || hMeters <= 0 || w <= 0) return 0;
  return Math.round((w / (hMeters * hMeters)) * 10) / 10;
}

export function getBMICategory(bmi) {
  const b = parseFloat(bmi);
  if (b < 18.5) {
    return { category: 'Underweight', color: '#38bdf8', advice: 'Focus on nutrient-dense caloric surplus to build lean mass.' };
  }
  if (b < 25.0) {
    return { category: 'Healthy Weight', color: '#10b981', advice: 'Optimal health range. Maintain consistency in training and nutrition.' };
  }
  if (b < 30.0) {
    return { category: 'Overweight', color: '#f59e0b', advice: 'A slight caloric deficit with progressive strength training is recommended.' };
  }
  return { category: 'Obesity Class', color: '#ef4444', advice: 'Prioritize sustainable cardio, clean diet, and structured resistance training.' };
}

// ── BMR & TDEE Calculations ──────────────────────────────────────────────────
export function calculateBMR({ gender = 'male', weight = 75, height = 175, age = 25 }) {
  const w = parseFloat(weight) || 75;
  const h = parseFloat(height) || 175;
  const a = parseFloat(age) || 25;

  if (gender === 'female') {
    return Math.round(10 * w + 6.25 * h - 5 * a - 161);
  }
  return Math.round(10 * w + 6.25 * h - 5 * a + 5);
}

export function calculateTDEE(bmr, activityLevel = 1.375) {
  return Math.round(bmr * parseFloat(activityLevel));
}

export function calculateMacroTargets(tdee, goal = 'maintenance', ratioType = 'balanced') {
  let targetCalories = tdee;

  if (goal === 'cut') {
    targetCalories = Math.round(tdee * 0.80);
  } else if (goal === 'bulk') {
    targetCalories = Math.round(tdee * 1.15);
  } else if (goal === 'recomp') {
    targetCalories = Math.round(tdee * 0.95);
  }

  let pPct = 0.30, cPct = 0.45, fPct = 0.25;

  if (ratioType === 'high-protein') {
    pPct = 0.40; cPct = 0.35; fPct = 0.25;
  } else if (ratioType === 'low-carb') {
    pPct = 0.35; cPct = 0.20; fPct = 0.45;
  } else if (ratioType === 'athletic') {
    pPct = 0.30; cPct = 0.50; fPct = 0.20;
  }

  const proteinGrams = Math.round((targetCalories * pPct) / 4);
  const carbsGrams = Math.round((targetCalories * cPct) / 4);
  const fatGrams = Math.round((targetCalories * fPct) / 9);

  return {
    calories: targetCalories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
    split: { proteinPct: pPct * 100, carbsPct: cPct * 100, fatPct: fPct * 100 }
  };
}

export function calculateWaterGoal(weight = 75) {
  return Math.round((parseFloat(weight) || 75) * 35);
}

/**
 * Animated Exercise Canvas Renderer for Form Visualizations (Crimson Theme)
 */
export function drawExerciseCanvas(canvas, type, stepFrame = 0) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  const primaryCrimson = '#e53827';
  const whiteGlow = '#ffffff';

  const t = (Math.sin(stepFrame * 0.05) + 1) / 2; // 0 to 1 loop

  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  if (type === 'bench-press') {
    // Bench
    ctx.strokeStyle = '#27272a';
    ctx.beginPath(); ctx.moveTo(40, 140); ctx.lineTo(260, 140); ctx.stroke();

    const bodyY = 130;
    ctx.strokeStyle = whiteGlow;
    ctx.beginPath(); ctx.moveTo(100, bodyY); ctx.lineTo(200, bodyY); ctx.stroke();

    ctx.fillStyle = primaryCrimson;
    ctx.beginPath(); ctx.arc(85, bodyY, 10, 0, Math.PI * 2); ctx.fill();

    const barY = 70 + t * 50;
    ctx.strokeStyle = primaryCrimson;
    ctx.beginPath();
    ctx.moveTo(150, bodyY);
    ctx.lineTo(130 + t * 10, barY + 15);
    ctx.lineTo(150, barY);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(150, barY - 30); ctx.lineTo(150, barY + 30); ctx.stroke();
    ctx.fillStyle = primaryCrimson;
    ctx.fillRect(144, barY - 45, 12, 15);
    ctx.fillRect(144, barY + 30, 12, 15);

  } else {
    // Squat / Movement loop
    ctx.strokeStyle = '#27272a';
    ctx.beginPath(); ctx.moveTo(20, 180); ctx.lineTo(280, 180); ctx.stroke();

    const squatY = 90 + t * 45;
    const kneeX = 170 + t * 20;

    ctx.strokeStyle = primaryCrimson;
    ctx.beginPath();
    ctx.moveTo(150, 180);
    ctx.lineTo(kneeX, 150);
    ctx.lineTo(130, squatY);
    ctx.lineTo(120, squatY - 40);
    ctx.stroke();

    ctx.fillStyle = whiteGlow;
    ctx.beginPath(); ctx.arc(120, squatY - 55, 10, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(120, squatY - 40); ctx.lineTo(120, squatY - 40); ctx.stroke();
  }
}
