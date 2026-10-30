# Changelog

All notable changes to the **FORGE & FUEL Matrix** platform are documented here.

## [Phase 1: Core Tools] - 2026-10-30

### 🏋️‍♂️ Workout Builder & Gym Mode
- **Drag-and-Drop / Circuit Routine Builder**: Create, save, edit, duplicate, and delete custom workout routines with configurable circuits, sets, target reps, weight (kg), duration, and rest timers.
- **Preloaded Starter Routines**: Added *Alpha Push Hypertrophy*, *Iron Back & Core Destroyer*, and *Metabolic Matrix HIIT*.
- **Full-Screen Gym Mode**: High-visibility workout view featuring:
  - Giant tabular digits timer with millisecond accuracy.
  - Active exercise title, set counter, and target load display.
  - Next-exercise and next-circuit preview banners.
  - Large-button touch controls optimized for gym use while training.
  - Active rest countdown with audio chime and 3-2-1 countdown beeps.
  - Quick "+30s Rest" and "Skip Rest" actions.
- **Web Audio API Sound Engine** (`src/services/audioService.js`): Pure synthesized audio cues (countdown ticks, start chime, rest cues, and victory fanfare) with zero external MP3 dependencies.
- **PR Detection Engine** (`src/services/workoutService.js`): Epley formula 1RM calculations with automatic PR detection, sound cue, and confetti celebration.

### 📐 Evidence-Based Calculators
- **Dedicated Calculators Hub** (`calculators` route):
  - **Quetelet BMI Calculator**: Dynamic calculation with color-coded classification (Underweight, Healthy, Overweight, Obesity Class) and actionable recommendations.
  - **Mifflin-St Jeor BMR Calculator**: Physiological baseline calorie expenditure based on age, gender, height, and weight.
  - **TDEE & Caloric Goal Calculator**: Multiplied by physical activity factor with target calories for Fat Loss Cut (-20%), Maintenance, Lean Bulk (+15%), and Body Recomposition (-5%) along with gram-level macro splits.
- **Unit Toggles**: Instant seamless switching between Metric (kg / cm) and Imperial (lbs / ft & in).
- **SEO Optimization**: Semantic `<h1>` / `<h2>` hierarchy, descriptive meta tags, and structured guidance.

### 🥗 Calorie & Macro Tracker
- **Food Search Integration** (`src/services/foodApiService.js`): Open Food Facts free public API search with in-memory caching and automatic instant fallback to local curated database.
- **Meal Slot Categorization**: Log foods specifically into *Breakfast*, *Lunch*, *Dinner*, or *Snacks*.
- **Real-Time Macro Summary Cards**: Live tracking of calories, protein, carbs, and fats against calculated personal goals with remaining deficit counters.

### 💧 Water Intake Tracker
- **SVG Circular Progress Ring**: Smooth stroke animation with glowing cyan indicator and percentage of target reached.
- **Dynamic Water Goal**: Calculated based on body weight formula (35ml per kg).
- **Quick-Add Buttons**: Fast-log buttons for `+150ml` (cup), `+250ml` (glass), and `+500ml` (bottle).
- **Web Push Reminders** (`src/services/notificationService.js`): Scheduled hydration browser notifications with in-app toast fallbacks.

### 🗓️ Weekly Meal Planner & Grocery List
- **7-Day Meal Planning Grid**: Assign foods to Monday through Sunday across all 4 meal slots with live daily macro totals.
- **Auto-Consolidated Grocery List**: Aggregates servings across the 7-day plan, categorizes ingredients, supports manual item entry, and provides persistent checked strikethrough states.

### 📱 PWA & Offline Support
- **Web App Manifest** (`public/manifest.json`): Configured for full standalone mobile app installation.
- **Service Worker** (`public/sw.js`): Offline asset caching, background navigation fallback, and online/offline connectivity detection banner.

### 🧪 Automated Testing
- **Node.js Native Test Suite** (`test/calculators.test.js`, `test/workout.test.js`): 10 unit tests covering BMR, TDEE, BMI, macro ratios, water targets, metric/imperial unit conversions, Epley 1RM, and PR detection. All passing with 0 dependencies.
