# FORGE & FUEL — Fitness, Workout & Nutrition Matrix

A full-stack, mobile-first progressive web application (PWA) for strength athletes, physique builders, and fitness enthusiasts.

---

## 🚀 Key Features

### Phase 1: Core Tools
- **Workout & Circuit Builder**: Drag-and-drop / custom circuit builder with configurable sets, reps, weight, duration, and rest intervals. Save, edit, duplicate, and delete routines.
- **Full-Screen Gym Mode**: High-contrast, large-button workout tracking interface with full-screen timer, next-exercise preview, rest countdown, and Web Audio API synthesized audio cues.
- **Evidence-Based Calculators**: SEO-optimized static pages for BMI (Quetelet Index), BMR (Mifflin-St Jeor), and TDEE with instant Metric / Imperial unit toggles.
- **Calorie & Macro Tracker**: Food search connecting to Open Food Facts free public API with instant fallback to local database, meal categorization (Breakfast, Lunch, Dinner, Snacks), and remaining macro counters.
- **Water Intake Tracker**: Dynamic SVG circular progress ring, quick-add buttons (+150ml, +250ml, +500ml), weight-calibrated hydration goals, and browser notification reminders.
- **Weekly Meal Planner & Grocery List**: 7-day meal planning matrix with auto-consolidating grocery checklist and strikethrough items.
- **PWA Ready**: Web App Manifest (`manifest.json`) and service worker (`sw.js`) enabling mobile installation and offline operation.
- **6 Hand-Crafted Themes**: Cyber Neon, Sapphire Luxury, Obsidian Crimson, Amber Gold, Arctic Light, and Solstice Glow (Terracotta & Sand).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Vanilla JavaScript (ES Modules), HTML5, Custom Vanilla CSS (`src/style.css`)
- **Bundler & Server**: Vite 5 (`vite --host --port 3000`)
- **Testing**: Node.js built-in native test runner (`node --test`)
- **Service Layer**:
  - `src/services/workoutService.js` — Routines, circuits, Epley 1RM formula, and PR detection.
  - `src/services/audioService.js` — Zero-dependency Web Audio API synthesizer.
  - `src/services/foodApiService.js` — Open Food Facts API client with offline fallback and caching.
  - `src/services/nutritionService.js` — Meal planning and consolidated grocery compiler.
  - `src/services/notificationService.js` — Browser Web Notification manager.

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on Node v24)

### Installation & Run
```bash
# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Run automated unit tests
npm test

# Build production bundle
npm run build
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` to configure external service integrations:

```bash
cp .env.example .env
```

| Variable | Description | Default / Fallback |
|---|---|---|
| `VITE_OPEN_FOOD_FACTS_API_URL` | Open Food Facts Search Endpoint | `https://world.openfoodfacts.org/cgi/search.pl` (Fallback: Local DB) |
| `VITE_USDA_API_KEY` | USDA FoodData Central Key (Optional) | Mock fallback |
| `VITE_EMAIL_PROVIDER` | Email delivery provider | `mock` |
| `VITE_AI_PROVIDER` | AI coaching backend | `mock` |
| `VITE_SPOTIFY_CLIENT_ID` | Spotify Web API client ID | Mock playlists |
