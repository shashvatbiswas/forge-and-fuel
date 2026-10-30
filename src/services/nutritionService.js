/**
 * Nutrition & Meal Planning Service
 * Manages daily meal logs by category (Breakfast, Lunch, Dinner, Snacks),
 * 7-day weekly meal plans, and auto-generated consolidated grocery lists.
 */

import { initialFoodDatabase } from '../data/foodData.js';

export const MEAL_TYPES = [
  { id: 'breakfast', name: 'Breakfast', icon: 'fa-mug-saucer' },
  { id: 'lunch',     name: 'Lunch',     icon: 'fa-burger' },
  { id: 'dinner',    name: 'Dinner',    icon: 'fa-drumstick-bite' },
  { id: 'snacks',    name: 'Snacks',    icon: 'fa-apple-whole' }
];

export const DAYS_OF_WEEK = [
  { id: 'mon', name: 'Monday' },
  { id: 'tue', name: 'Tuesday' },
  { id: 'wed', name: 'Wednesday' },
  { id: 'thu', name: 'Thursday' },
  { id: 'fri', name: 'Friday' },
  { id: 'sat', name: 'Saturday' },
  { id: 'sun', name: 'Sunday' }
];

class NutritionService {
  constructor() {
    this.mealPlan = this.load('ff_meal_plan', this.getDefaultMealPlan());
    this.groceryList = this.load('ff_grocery_list', []);
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

  getDefaultMealPlan() {
    return {
      mon: {
        breakfast: [initialFoodDatabase[4], initialFoodDatabase[10]], // Egg + Rolled Oats
        lunch: [initialFoodDatabase[0], initialFoodDatabase[8], initialFoodDatabase[20]], // Chicken + Basmati + Broccoli
        dinner: [initialFoodDatabase[1], initialFoodDatabase[11], initialFoodDatabase[15]], // Salmon + Sweet Potato + Avocado
        snacks: [initialFoodDatabase[29]] // Whey scoop
      },
      tue: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      wed: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      thu: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      fri: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      sat: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      sun: { breakfast: [], lunch: [], dinner: [], snacks: [] }
    };
  }

  // ── Weekly Planner Operations ────────────────────────────────────────────────
  getWeeklyPlan() {
    return this.mealPlan;
  }

  addFoodToPlan(day, mealType, food) {
    if (!this.mealPlan[day]) this.mealPlan[day] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    if (!this.mealPlan[day][mealType]) this.mealPlan[day][mealType] = [];
    this.mealPlan[day][mealType].push({
      ...food,
      instanceId: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    });
    this.save('ff_meal_plan', this.mealPlan);
  }

  removeFoodFromPlan(day, mealType, instanceId) {
    if (!this.mealPlan[day] || !this.mealPlan[day][mealType]) return;
    this.mealPlan[day][mealType] = this.mealPlan[day][mealType].filter(f => f.instanceId !== instanceId);
    this.save('ff_meal_plan', this.mealPlan);
  }

  getDayTotals(day) {
    const dayData = this.mealPlan[day] || {};
    let cals = 0, p = 0, c = 0, f = 0;
    Object.values(dayData).forEach(items => {
      (items || []).forEach(item => {
        cals += item.cals || 0;
        p += item.p || 0;
        c += item.c || 0;
        f += item.f || 0;
      });
    });
    return { cals, p: Math.round(p), c: Math.round(c), f: Math.round(f) };
  }

  // ── Grocery List Generation ──────────────────────────────────────────────────
  generateGroceryListFromPlan() {
    const counts = {}; // { [foodName]: { count, category, serving, checked } }

    Object.values(this.mealPlan).forEach(day => {
      Object.values(day).forEach(items => {
        (items || []).forEach(item => {
          if (!counts[item.name]) {
            counts[item.name] = {
              name: item.name,
              category: item.category || 'general',
              serving: item.serving || '1 serving',
              count: 1,
              checked: false
            };
          } else {
            counts[item.name].count += 1;
          }
        });
      });
    });

    // Merge with any custom manual grocery items that were already checked/added
    const currentChecked = new Set(this.groceryList.filter(g => g.checked).map(g => g.name));

    const generated = Object.values(counts).map(item => ({
      ...item,
      checked: currentChecked.has(item.name)
    }));

    this.groceryList = generated;
    this.save('ff_grocery_list', this.groceryList);
    return this.groceryList;
  }

  getGroceryList() {
    if (this.groceryList.length === 0) {
      return this.generateGroceryListFromPlan();
    }
    return this.groceryList;
  }

  toggleGroceryItem(name) {
    const item = this.groceryList.find(g => g.name === name);
    if (item) {
      item.checked = !item.checked;
      this.save('ff_grocery_list', this.groceryList);
    }
  }

  addCustomGroceryItem(name, category = 'pantry') {
    if (!name.trim()) return;
    this.groceryList.push({
      name: name.trim(),
      category,
      serving: 'Custom',
      count: 1,
      checked: false
    });
    this.save('ff_grocery_list', this.groceryList);
  }

  clearCheckedGroceryItems() {
    this.groceryList = this.groceryList.filter(g => !g.checked);
    this.save('ff_grocery_list', this.groceryList);
  }
}

export const nutritionService = new NutritionService();
