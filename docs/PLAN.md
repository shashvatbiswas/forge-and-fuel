# FORGE & FUEL — Extension & Evolution Plan

## Step 0: Existing Codebase Audit

### 1. Current Architecture & Stack
- **Framework & Language**: Vanilla JavaScript (ES Modules), HTML5, CSS3 bundled with **Vite 5**.
- **Styling Approach**: Custom Vanilla CSS with Design System Tokens, CSS Variables, Glassmorphism, Responsive Grid/Flexbox, and 6 curated themes (Cyber Neon, Sapphire Luxury, Obsidian Crimson, Amber Gold, Arctic Light, Solstice Glow). No external CSS frameworks (e.g., Tailwind).
- **Fonts & Icons**: Bebas Neue & Plus Jakarta Sans via Google Fonts; FontAwesome 6 icons.
- **Routing**: Client-side SPA navigation via `ForgeFuelApp.go(route)` with responsive top navbar, mobile bottom navigation bar, and profile/settings views.
- **State Management**: Reactive class-based state (`ForgeFuelApp` singleton accessible at `window.app`), persisted in `localStorage` (`ff_accounts`, `ff_current_user`, `ff_meals`, `ff_sets`, `ff_water`, `ff_food_db`, `ff_theme`, etc.).
- **Auth & User System**: Client-side authentication with email/password validation, 2-step onboarding (credentials + biometric metrics & fitness goals), session persistence, and a 1-click Demo Account mode.
- **Current Data & Modules**:
  - `src/data/workoutData.js`: Exercise catalog with category, equipment, muscles, step-by-step form guides, and safety tips.
  - `src/data/foodData.js`: Starter nutrition catalog with macros (calories, protein, carbs, fats, serving sizes).
  - `src/data/knowledgeData.js`: Educational articles on nutrition, strength training, recovery, and mindset.
  - `src/data/motivationData.js`: Quotes and discipline principles.
  - `src/utils/calculator.js`: Mifflin-St Jeor BMR, TDEE, macro target formulas, water intake goal calculation, and HTML5 Canvas exercise animation.

---

## Target Architecture & Service Layer

To keep the codebase maintainable without breaking existing features, we introduce clean modular services in `src/services/` and `src/models/` while integrating them seamlessly into `ForgeFuelApp`:

```
src/
├── app.js               # Main SPA controller, view rendering & event bindings
├── style.css            # Base CSS, tokens, gym-mode, theme variables, new UI components
├── data/
│   ├── workoutData.js   # Starter exercise catalog + muscle-group/equipment tags
│   ├── foodData.js      # Starter food & recipe database
│   ├── knowledgeData.js
│   └── motivationData.js
├── models/              # Schema definitions and data contracts
│   ├── workout.js       # Workout, Circuit, Exercise, Set, WorkoutLog
│   ├── nutrition.js     # FoodItem, MealLog, DailyNutrition, GroceryItem
│   ├── social.js        # Buddy, Team, LeaderboardEntry, Comment
│   └── challenge.js     # Challenge, Badge, StreakLog
├── services/            # Pure business logic layer (fully testable)
│   ├── storageService.js     # LocalStorage abstraction with offline queue
│   ├── workoutService.js     # Workout builder, circuits, PR detection
│   ├── foodApiService.js     # Open Food Facts API + local database fallback
│   ├── nutritionService.js   # Meals, macro tracking, grocery aggregation
│   ├── notificationService.js# Web Push / Web Notifications for water & workouts
│   ├── audioService.js       # Web Audio API cues for rest timers and intervals
│   ├── analyticsService.js   # Consistency score calculation & PR algorithms
│   ├── aiService.js          # NLP workout parsing & coaching advice with safety disclaimers
│   └── exportService.js      # CSV and printable PDF reports
└── utils/
    ├── calculator.js    # BMR, TDEE, BMI, body fat calculations
    └── pwa.js           # Service worker registration & install prompt
```

---

## Global Requirements Checklist
- [x] **Mobile-first & Responsive**: Fluid touch targets (min 44px), sticky bottom navigation for mobile, collapsible drawers.
- [ ] **Gym Mode**: Dedicated high-contrast, large-button workout tracking interface designed for quick taps while resting or lifting.
- [ ] **PWA Capabilities**: Web App Manifest (`manifest.json`), service worker (`sw.js`) for asset caching, offline active workout logging, and automatic background sync upon reconnection.
- [ ] **Accessibility & UX**: ARIA attributes, semantic landmarks, high contrast ratios across all 6 themes, keyboard navigability, clear empty/loading/error states.
- [ ] **Environment Configuration**: `.env.example` documenting all mockable external APIs (Open Food Facts, USDA, Resend/SMTP, AI LLM endpoints, Spotify, Wearables).
- [ ] **Test Coverage**: Automated tests for calculators, consistency score formula, PR detection engine, and natural-language workout parsing.

---

## Phase-by-Phase Roadmap

### Phase 1: Core Tools (Immediate Focus)
1. **Workout Builder & Circuits**:
   - Drag-and-drop / re-orderable circuits of exercises with customizable sets, target reps, weight/duration, and rest intervals.
   - Save, edit, duplicate, and delete custom workout routines.
   - **Guided Workout Mode**: Fullscreen gym interface with large timer, Web Audio countdown beeps, next-exercise preview, and rest interval countdown.
2. **Dedicated Calculators Page**:
   - Interactive BMI, BMR, and TDEE calculation with metric (kg/cm) and imperial (lbs/in) unit toggles.
   - SEO-friendly static semantic structure (meta tags, descriptive H1/H2 hierarchy, structured advice).
3. **Calorie & Macro Tracker**:
   - Food search integrating free Open Food Facts API with instant fallback to built-in local database.
   - Daily meals categorized by Breakfast, Lunch, Dinner, and Snacks with macro distribution bars.
4. **Water Intake Tracker**:
   - SVG interactive progress ring, quick-add buttons (+150ml, +250ml, +500ml), daily target based on body weight, and Web Push / browser reminder capability.
5. **Meal Planner & Grocery List**:
   - 7-day weekly meal planning grid.
   - Auto-generated grocery list aggregating ingredients with quantities, category groupings, and strike-through checkboxes.

### Phase 2: Insights & Engagement
6. **Weekly Summary Report**:
   - Total volume lifted, active workout minutes, caloric adherence, best lifts, and weighted consistency score.
   - In-app visual report card and simulated/pluggable email delivery service.
7. **Progress Dashboard & PR Detection**:
   - Interactive charts for weight trends, lifting volume, and personal records (PRs).
   - GitHub-style 52-week activity heatmap.
   - Automatic PR detection with celebration confetti and sound cue.
8. **Challenges & Streaks**:
   - 7-day and 30-day fitness challenges with progress milestones, streak counters, and unlockable achievement badges.

### Phase 3: Social & Community
9. **Workout Share Cards**:
   - Canvas-based image generator creating branded workout summary cards exportable via the Web Share API or PNG download.
10. **Buddy System & Cheers**:
    - Add buddies by username/invite code, view activity feed, and send motivational cheers.
11. **Teams & Leaderboards**:
    - Team creation/joining (gyms, offices, bootcamps), team feed, and weekly leaderboard.
12. **Comments & Kudos**:
    - Workout log feedback with moderation controls (delete own, report).

### Phase 4: AI Features
13. **AI Coach Chat**:
    - Conversational assistant for training advice, recovery questions, and exercise regressions/swaps with strict medical safety disclaimers.
14. **Natural-Language Workout Logging**:
    - Parsing unstructured inputs (e.g., *"3 sets of 10 bench at 80kg"*) into structured workout logs with interactive confirmation modal.
15. **Smart Habits & Recovery**:
    - Heuristic schedule advisor predicting optimal workout windows and recommending active recovery based on volume history.

### Phase 5: Integrations & Exports
16. **Health & Wearables Hub**:
    - Extensible wearable sync abstraction (Google Fit, Apple Health, Garmin, Fitbit) with clean mock fallbacks and configuration documentation.
17. **Spotify Workout Matcher**:
    - Playlist suggestions calibrated to workout intensity (HIIT, Heavy Lifting, Steady Cardio, Mobility).
18. **Calendar Sync**:
    - Schedule workouts and export as `.ics` calendar files or Google Calendar direct links.
19. **Data Export**:
    - Complete data portability with CSV export for workouts & nutrition, plus formatted printable PDF summary.

---

## Data Models Summary
- **User**: `{ id, name, email, age, height, weight, targetWeight, gender, activityLevel, goal, ratioType, streakDays, badges, settings }`
- **Workout**: `{ id, title, description, category, difficulty, circuits: [{ id, name, restBetweenSets, exercises: [{ exerciseId, sets, reps, weight, duration }] }] }`
- **WorkoutLog**: `{ id, workoutId, workoutTitle, date, durationSeconds, totalVolumeKg, completedSets: [{ exerciseId, setNumber, weight, reps, completed }], prsAchieved: [] }`
- **MealPlan**: `{ id, userId, weekStartDate, days: { monday: [...foodItems], ... } }`
- **WaterLog**: `{ date, totalMl, goalMl, logs: [{ time, amountMl }] }`
- **Challenge**: `{ id, title, durationDays, type, target, participants: [], badges: [] }`
- **Team**: `{ id, name, description, code, members: [], weeklyScore }`
