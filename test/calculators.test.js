import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateMacroTargets,
  calculateWaterGoal,
  lbsToKg,
  kgToLbs,
  feetInchesToCm,
  cmToFeetInches
} from '../src/utils/calculator.js';

describe('Health & Fitness Calculators', () => {
  test('calculateBMI returns correct body mass index', () => {
    // 70kg, 175cm -> 70 / (1.75 * 1.75) = 22.86 -> 22.9
    const bmi = calculateBMI(70, 175);
    assert.equal(bmi, 22.9);
  });

  test('getBMICategory correctly categorizes BMI ranges', () => {
    assert.equal(getBMICategory(17.5).category, 'Underweight');
    assert.equal(getBMICategory(22.0).category, 'Healthy Weight');
    assert.equal(getBMICategory(27.5).category, 'Overweight');
    assert.equal(getBMICategory(32.0).category, 'Obesity Class');
  });

  test('calculateBMR applies Mifflin-St Jeor formula accurately', () => {
    // Male: 10*80 + 6.25*180 - 5*25 + 5 = 800 + 1125 - 125 + 5 = 1805
    const maleBmr = calculateBMR({ gender: 'male', weight: 80, height: 180, age: 25 });
    assert.equal(maleBmr, 1805);

    // Female: 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320
    const femaleBmr = calculateBMR({ gender: 'female', weight: 60, height: 165, age: 30 });
    assert.equal(femaleBmr, 1320);
  });

  test('calculateTDEE multiplies BMR by activity multiplier', () => {
    const tdee = calculateTDEE(1800, 1.55);
    assert.equal(tdee, 2790);
  });

  test('calculateMacroTargets calculates cut/bulk/maintenance calories and macros', () => {
    const maintenance = calculateMacroTargets(2000, 'maintenance', 'balanced');
    assert.equal(maintenance.calories, 2000);
    // 30% protein = 600 cals / 4 = 150g
    assert.equal(maintenance.protein, 150);

    const cut = calculateMacroTargets(2000, 'cut', 'high-protein');
    // cut = 2000 * 0.80 = 1600
    assert.equal(cut.calories, 1600);
    // high-protein: 40% protein = 640 cals / 4 = 160g
    assert.equal(cut.protein, 160);
  });

  test('calculateWaterGoal returns 35ml per kg of body weight', () => {
    const goal = calculateWaterGoal(75);
    assert.equal(goal, 2625);
  });

  test('Unit conversions (metric <-> imperial)', () => {
    assert.equal(lbsToKg(150), 68.0);
    assert.equal(kgToLbs(70), 154.3);
    assert.equal(feetInchesToCm(5, 9), 175);
    const imperial = cmToFeetInches(175);
    assert.equal(imperial.feet, 5);
    assert.equal(imperial.inches, 9);
  });
});
