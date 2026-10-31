# Changelog

All notable changes to the **FORGE & FUEL Matrix** platform are documented here.

## [Phase 5: Integrations & Data Portability] - 2026-10-30

### ⌚ Health & Wearables Hub
- **Multi-Device Biometric Sync** (`src/services/integrationsService.js`):
  - Integration interface for Apple HealthKit, Google Fit / Health Connect, Garmin Connect, and Fitbit / Pixel Watch.
  - Live synchronization of resting heart rate, active calories burned, daily steps, and parasympathetic sleep quality scores.

### 🎵 Spotify BPM Workout Matcher
- **Acoustic Intensity Calibration**:
  - Dynamically matches audio playlists to training style:
    - *Iron Phonk & Industrial Drive* (145–165 BPM) for Heavy Strength & 1RM attempts.
    - *Cyberpunk Electro Sprint* (160–175 BPM) for High-Intensity Interval Training (HIIT).
    - *Deep House & Synthwave Pump* (124–130 BPM) for Hypertrophy & Mind-Muscle connection.
    - *Mindful Lo-Fi & Parasympathetic Rest* (70–90 BPM) for Active Recovery & Mobility.

### 📅 Calendar Sync & Data Portability
- **RFC 5545 iCalendar (`.ics`) Generator** (`src/services/exportService.js`):
  - 1-click workout scheduling export compatible with Apple Calendar, Outlook, and Google Calendar.
  - Direct Google Calendar template link generator.
- **Complete Data Portability**:
  - Unrestricted CSV export for complete workout history (date, title, volume, duration, PRs) and nutrition logs (macros, calories, meal slots).
  - Clean browser print stylesheet for PDF report cards.

---

## [Phase 4: AI Features] - 2026-10-30

### 🤖 AI Coach & Biomechanics Assistant
- **Evidence-Based Knowledge Engine** (`src/services/aiService.js`):
  - Intelligent conversational assistant providing joint-friendly regressions, movement biomechanics (bench elbow tuck, squat knee tracking, pull-up progression), and nutrition advice.
  - Strict medical safety disclaimer embedded on every consultation.
  - Quick-prompt suggestions for instant answers on common lifting plateaus and form breakdowns.

### ⚡ Natural-Language Workout Logging
- **Regex-Powered NLP Parser**:
  - Parses freeform text inputs (e.g., *"3 sets of 10 bench at 80kg"*, *"squat 100kg 5x5"*, *"deadlift 140kg for 4 sets of 6 reps"*, *"pullups 3 sets 10 reps bodyweight"*).
  - Handles multi-line session notes, extracts exercise names, sets, reps, weight (kg or lbs), and computes total volume.
  - Interactive confirmation table with 1-click import into workout session history and automatic PR detection.

### 🔋 Smart Habits & Recovery Advisor
- **Systemic Fatigue Index & Readiness**:
  - Heuristic fatigue calculation comparing weekly volume trends to baseline capacity.
  - 6-muscle group readiness model (Chest, Back, Legs, Shoulders, Arms, Core) tracking 48-hour recovery windows.
  - Circadian optimal training window recommendation (`4:00 PM – 7:00 PM`) grounded in chronobiology and peak muscular contractility.

---

## [Phase 3: Social and Community] - 2026-10-30

### 📸 Workout Share Cards
- **Canvas-Based Story & Post Generator** (`src/services/shareCardService.js`):
  - Renders 800x1000 4:5 high-resolution export cards optimized for Instagram Stories and social platforms.
  - Dynamically draws athlete name, session date, total volume lifted (kg), active time, sets completed, consistency score, and PR highlights.
  - One-click native Web Share API integration with automatic fallback to high-quality PNG download.

### 👥 Athlete Network & Squads
- **Community Feed & Moderation** (`src/services/socialService.js`):
  - Live activity feed showing completed workouts, PRs, sets, and volumes.
  - Kudos reaction system with audio feedback cues.
  - Community comment threads with instant self-deletion and report moderation controls.
- **Buddy System & Motivational Cheers**:
  - Add workout partners via `@handle` or name.
  - Real-time cheers counter with synthesized audio fanfare and milestone tracking.
- **Teams & Volume Leaderboards**:
  - Squad creation and team join codes (e.g., `FORGE-88`, `SUNRISE-12`).
  - Weekly collective volume (kg) leaderboard ranking with Gold, Silver, and Bronze tier badges.

---

## [Phase 2: Insights and Engagement] - 2026-10-30

### 📊 Weekly Summary & Consistency Score
- **Consistency Score Algorithm** (`src/services/analyticsService.js`):
  - Weighted composite index: Training Adherence (40%) + Caloric Discipline (30%) + Hydration Target (20%) + Streak Momentum (10%).
  - Tiers: S-Tier Unstoppable (90-100), A-Tier Dedicated (75-89), B-Tier Consistent (60-74), C-Tier Developing (40-59).
  - In-app visual breakdown with detailed mathematical formula explainer.
- **Weekly Performance Summary**: Workouts completed, active training minutes, total lifting volume (kg), and heaviest compound lift.
- **Email Delivery Service** (`src/services/emailService.js`): Clean provider interface supporting Resend API with mock simulated dispatch fallback, sent email log, and branded HTML report card.

### 📈 Activity Matrix & PR Celebrations
- **12-Week Activity Heatmap**: 84-day GitHub-style contribution grid displaying daily training frequency, volume, and macro tracking consistency.
- **Personal Records (PRs) Showcase**: Automated historical best tracking with celebratory animations and fanfare audio cues.

### 🏆 Challenges, Streaks & Badges
- **7-Day & 30-Day Challenges** (`src/services/challengeService.js`):
  - *7-Day Iron Discipline* (5 workout sessions)
  - *7-Day Hydration Titan* (7 consecutive water goal days)
  - *30-Day Hypertrophy Forge* (20 high-volume workouts)
  - *30-Day Caloric Precision* (25 on-target nutrition days)
- **Solo & Friend Invites**: Dynamic invite link generator with Web Share API and 1-click clipboard copy.
- **Achievement Badges**: *Iron Will*, *Hydration Titan*, *PR Breaker*, *Century Club*, and *Forge Master* with glowing unlocked states.

---

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
