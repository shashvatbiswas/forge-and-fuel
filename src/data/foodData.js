export const foodCategories = [
  { id: 'all', name: 'All Foods' },
  { id: 'protein', name: 'Lean Proteins' },
  { id: 'carbs', name: 'Complex Carbs & Grains' },
  { id: 'fats', name: 'Healthy Fats' },
  { id: 'veggies', name: 'Vegetables & Greens' },
  { id: 'fruits', name: 'Fruits & Berries' },
  { id: 'dairy', name: 'Dairy & Alternatives' },
  { id: 'meals', name: 'Prepared Fitness Meals' },
  { id: 'supps', name: 'Supplements' }
];

export const initialFoodDatabase = [
  // Lean Proteins
  { id: 'f1', name: 'Grilled Chicken Breast', category: 'protein', serving: '100g cooked', cals: 165, p: 31, c: 0, f: 3.6 },
  { id: 'f2', name: 'Atlantic Salmon Fillet', category: 'protein', serving: '100g cooked', cals: 206, p: 22, c: 0, f: 12.3 },
  { id: 'f3', name: 'Extra Lean Ground Beef (93/7)', category: 'protein', serving: '100g cooked', cals: 172, p: 26, c: 0, f: 7 },
  { id: 'f4', name: 'Egg Whites', category: 'protein', serving: '100g (3-4 whites)', cals: 52, p: 11, c: 0.7, f: 0.2 },
  { id: 'f5', name: 'Whole Large Egg', category: 'protein', serving: '1 egg (50g)', cals: 72, p: 6.3, c: 0.4, f: 4.8 },
  { id: 'f6', name: 'Canned Tuna in Water', category: 'protein', serving: '100g drained', cals: 116, p: 25.5, c: 0, f: 1 },
  { id: 'f7', name: 'Firm Tofu', category: 'protein', serving: '100g', cals: 83, p: 10, c: 2.3, f: 4.8 },
  { id: 'f8', name: 'Turkey Breast Slice', category: 'protein', serving: '100g', cals: 135, p: 30, c: 0, f: 1 },

  // Carbs & Grains
  { id: 'f9', name: 'White Basmati Rice (Cooked)', category: 'carbs', serving: '100g cooked', cals: 130, p: 2.7, c: 28, f: 0.3 },
  { id: 'f10', name: 'Brown Jasmine Rice (Cooked)', category: 'carbs', serving: '100g cooked', cals: 112, p: 2.6, c: 23.5, f: 0.9 },
  { id: 'f11', name: 'Rolled Oats (Raw)', category: 'carbs', serving: '50g dry', cals: 190, p: 6.8, c: 33, f: 3.5 },
  { id: 'f12', name: 'Baked Sweet Potato', category: 'carbs', serving: '150g baked', cals: 135, p: 3, c: 31, f: 0.2 },
  { id: 'f13', name: 'Quinoa (Cooked)', category: 'carbs', serving: '100g cooked', cals: 120, p: 4.4, c: 21.3, f: 1.9 },
  { id: 'f14', name: 'Whole Wheat Bread', category: 'carbs', serving: '2 slices (70g)', cals: 160, p: 8, c: 28, f: 2 },
  { id: 'f15', name: 'Whole Grain Pasta (Cooked)', category: 'carbs', serving: '100g cooked', cals: 124, p: 5, c: 25, f: 0.8 },

  // Fats
  { id: 'f16', name: 'Fresh Hass Avocado', category: 'fats', serving: '1/2 medium (75g)', cals: 120, p: 1.5, c: 6, f: 11 },
  { id: 'f17', name: 'Raw Almonds', category: 'fats', serving: '30g (approx 23 nuts)', cals: 172, p: 6.3, c: 6.1, f: 15 },
  { id: 'f18', name: 'Natural Peanut Butter', category: 'fats', serving: '2 tbsp (32g)', cals: 190, p: 8, c: 7, f: 16 },
  { id: 'f19', name: 'Extra Virgin Olive Oil', category: 'fats', serving: '1 tbsp (14ml)', cals: 119, p: 0, c: 0, f: 13.5 },
  { id: 'f20', name: 'Chia Seeds', category: 'fats', serving: '20g', cals: 97, p: 3.3, c: 8.4, f: 6.1 },

  // Veggies
  { id: 'f21', name: 'Steamed Broccoli', category: 'veggies', serving: '150g', cals: 50, p: 4.2, c: 10, f: 0.6 },
  { id: 'f22', name: 'Fresh Baby Spinach', category: 'veggies', serving: '100g raw', cals: 23, p: 2.9, c: 3.6, f: 0.4 },
  { id: 'f23', name: 'Asparagus Spears', category: 'veggies', serving: '100g cooked', cals: 22, p: 2.4, c: 4, f: 0.2 },
  { id: 'f24', name: 'Bell Peppers (Mixed)', category: 'veggies', serving: '100g raw', cals: 26, p: 1, c: 6, f: 0.3 },

  // Fruits
  { id: 'f25', name: 'Banana', category: 'fruits', serving: '1 medium (118g)', cals: 105, p: 1.3, c: 27, f: 0.3 },
  { id: 'f26', name: 'Fresh Blueberries', category: 'fruits', serving: '100g', cals: 57, p: 0.7, c: 14, f: 0.3 },
  { id: 'f27', name: 'Honeycrisp Apple', category: 'fruits', serving: '1 medium (180g)', cals: 95, p: 0.5, c: 25, f: 0.3 },

  // Dairy & Supplements
  { id: 'f28', name: 'Greek Yogurt 0% Fat', category: 'dairy', serving: '170g tub', cals: 100, p: 18, c: 6, f: 0 },
  { id: 'f29', name: 'Cottage Cheese 2% Fat', category: 'dairy', serving: '150g', cals: 120, p: 18, c: 5, f: 3 },
  { id: 'f30', name: 'Whey Protein Isolate Scoop', category: 'supps', serving: '1 scoop (30g)', cals: 120, p: 25, c: 1.5, f: 1 },
  { id: 'f31', name: 'Creatine Monohydrate', category: 'supps', serving: '5g scoop', cals: 0, p: 0, c: 0, f: 0 },
  { id: 'f32', name: 'Chicken & Rice Power Bowl', category: 'meals', serving: '1 full bowl (400g)', cals: 520, p: 45, c: 60, f: 10 }
];
