export const knowledgeCategories = [
  { id: 'all', name: 'All Knowledge Articles', icon: 'fa-book-open' },
  { id: 'workout-science', name: 'Workout Science', icon: 'fa-microscope' },
  { id: 'nutrition-diet', name: 'Nutrition & Diet', icon: 'fa-apple-whole' },
  { id: 'health-recovery', name: 'Recovery & Sleep', icon: 'fa-bed' },
  { id: 'mindset-habits', name: 'Mindset & Habits', icon: 'fa-brain' }
];

export const knowledgeArticles = [
  {
    id: 'progressive-overload',
    category: 'workout-science',
    title: 'The Golden Law of Hypertrophy: Progressive Overload',
    subtitle: 'Why 90% of gym goers plateau and how to ensure non-stop muscle growth every single month.',
    readTime: '5 min read',
    author: 'Forge & Fuel Science Team',
    tags: ['Hypertrophy', 'Strength Training', 'Periodization'],
    content: `
      <h3>What is Progressive Overload?</h3>
      <p>Progressive overload is the gradual increase of stress placed upon the musculoskeletal and nervous system during exercise. Your muscles do not grow out of luck or sweat—they adapt specifically to demand. If you lift 100 lbs for 10 reps every week for a year, your body has zero physiological reason to build new muscle tissue beyond what is required for that exact load.</p>
      
      <h3>The 5 Progressive Overload Drivers</h3>
      <ul>
        <li><strong>1. Increasing Weight (Resistance):</strong> Adding 2.5 lb - 5 lb to the barbell once target reps are achieved cleanly.</li>
        <li><strong>2. Increasing Repetitions:</strong> Moving from 8 reps to 10 reps with identical weight and strict tempo.</li>
        <li><strong>3. Increasing Sets (Volume):</strong> Moving from 3 working sets to 4 working sets for lagging muscle groups.</li>
        <li><strong>4. Enhancing Execution & Range of Motion:</strong> Deepening squat depth or pausing 2 seconds in peak stretch without reducing load.</li>
        <li><strong>5. Decreasing Rest Intervals:</strong> Completing the same total volume in 60 seconds rest instead of 90 seconds.</li>
      </ul>

      <div class="glass-panel p-4 my-4 border-l-4 border-neon">
        <h4 class="text-neon mb-1 font-bold">Pro Tip: RIR (Reps In Reserve)</h4>
        <p class="text-sm">Train most hyper-trophy sets within 1-3 Reps in Reserve (RIR). You do not need to hit total nervous system failure on every single set—consistent close-to-failure mechanical tension is king.</p>
      </div>
    `
  },
  {
    id: 'macronutrient-mastery',
    category: 'nutrition-diet',
    title: 'Macronutrients Deconstructed: Protein, Carbs & Fats',
    subtitle: 'Master the fuel your body converts into raw muscle power and metabolic energy.',
    readTime: '7 min read',
    author: 'Forge & Fuel Clinical Nutrition',
    tags: ['Macros', 'Protein', 'Carbohydrates', 'Fats'],
    content: `
      <h3>The Triad of Human Metabolism</h3>
      <p>Every single food item you consume yields energy measured in Calories. This energy comes from three primary macronutrients, each serving distinct biological duties in your body.</p>

      <div class="grid-3 my-6 gap-4">
        <div class="glass-panel p-4">
          <h4 class="text-neon font-bold text-lg mb-2"><i class="fa-solid fa-drumstick-bite mr-2"></i>Protein (4 kcal/g)</h4>
          <p class="text-xs text-muted mb-2">Builds & repairs muscle tissue, enzymes, and hormones.</p>
          <p class="text-xs"><strong>Target:</strong> 1.6g - 2.2g per kg of bodyweight daily (0.8g - 1.0g per lb).</p>
        </div>

        <div class="glass-panel p-4">
          <h4 class="text-cyan font-bold text-lg mb-2"><i class="fa-solid fa-wheat-awn mr-2"></i>Carbs (4 kcal/g)</h4>
          <p class="text-xs text-muted mb-2">Primary energy source stored as muscle glycogen.</p>
          <p class="text-xs"><strong>Target:</strong> 40% - 50% of total daily energy depending on output.</p>
        </div>

        <div class="glass-panel p-4">
          <h4 class="text-amber font-bold text-lg mb-2"><i class="fa-solid fa-oil-well mr-2"></i>Healthy Fats (9 kcal/g)</h4>
          <p class="text-xs text-muted mb-2">Crucial for testosterone, joint lubrication & brain health.</p>
          <p class="text-xs"><strong>Target:</strong> 20% - 30% of total daily calories (never below 0.5g/kg).</p>
        </div>
      </div>

      <h3>Protein Synthesis & Amino Acids</h3>
      <p>Muscle Protein Synthesis (MPS) is triggered primarily by the essential amino acid <strong>Leucine</strong>. Eating 25-40 grams of high-quality protein every 3-5 hours optimizes MPS throughout the day, keeping your body in an anabolic state.</p>
    `
  },
  {
    id: 'caloric-balance-math',
    category: 'nutrition-diet',
    title: 'The Thermodynamics of Body Recomposition',
    subtitle: 'The math behind burning fat vs. building lean muscle mass.',
    readTime: '6 min read',
    author: 'Forge & Fuel Performance',
    tags: ['Caloric Deficit', 'TDEE', 'Fat Loss', 'Bulking'],
    content: `
      <h3>Energy Balance: CICO Principles</h3>
      <p>Regardless of diet trend (Keto, Carnivore, Intermittent Fasting, Vegan), the First Law of Thermodynamics governs human body weight change: <strong>Calories In vs. Calories Out (CICO)</strong>.</p>
      
      <ul>
        <li><strong>Caloric Deficit (Fat Loss):</strong> Consuming 300 - 500 calories below your TDEE (Total Daily Energy Expenditure). Expect 0.5 - 1.0 lb fat loss per week without sacrificing lean tissue.</li>
        <li><strong>Caloric Surplus (Lean Bulk):</strong> Consuming 200 - 300 calories above TDEE. Provides extra energy to fuel heavy training and synthesize new muscle fibers with minimal fat gain.</li>
        <li><strong>Maintenance / Recomposition:</strong> Consuming exact TDEE calories. Ideal for beginners or returning lifters to drop fat and build muscle simultaneously.</li>
      </ul>
    `
  },
  {
    id: 'sleep-cortisol-recovery',
    category: 'health-recovery',
    title: 'Sleep Architecture: Where Growth Hormone Spikes',
    subtitle: 'Why 8 hours of deep sleep is more powerful than any anabolic supplement on earth.',
    readTime: '5 min read',
    author: 'Forge & Fuel Recovery Lab',
    tags: ['Sleep', 'Hormones', 'Cortisol', 'Recovery'],
    content: `
      <h3>Muscles Grow in Bed, Not in the Gym</h3>
      <p>Lifting weights creates micro-tears in muscle fibers (stimulus). Actual repair and hypertrophy occur during deep Slow-Wave Sleep (Stage 3 & 4 NREM sleep).</p>
      
      <p>During deep sleep, your pituitary gland releases up to 70% of your daily pulse of <strong>Human Growth Hormone (HGH)</strong>. Chronic sleep deprivation (under 6 hours) increases <strong>Cortisol</strong> (stress hormone), causing muscle breakdown, impaired glucose tolerance, and elevated hunger hormones (Ghrelin).</p>
    `
  }
];
