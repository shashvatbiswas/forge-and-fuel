import confetti from 'canvas-confetti';
import { exercisesData, workoutCategories as workoutCategoryObjects } from './data/workoutData.js';
import { initialFoodDatabase } from './data/foodData.js';
import { knowledgeArticles } from './data/knowledgeData.js';
import { motivationalQuotes } from './data/motivationData.js';
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
  cmToFeetInches,
  drawExerciseCanvas
} from './utils/calculator.js';

import { workoutService, STARTER_ROUTINES } from './services/workoutService.js';
import { audioCueService } from './services/audioService.js';
import { foodApiService } from './services/foodApiService.js';
import { nutritionService, MEAL_TYPES, DAYS_OF_WEEK } from './services/nutritionService.js';
import { notificationService } from './services/notificationService.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const THEMES = [
  { id: 'cyber-neon',       name: 'Cyber Neon',      color: '#00f2fe', icon: 'fa-bolt' },
  { id: 'sapphire-luxury',  name: 'Sapphire Luxury',  color: '#6366f1', icon: 'fa-gem' },
  { id: 'obsidian-crimson', name: 'Obsidian Crimson', color: '#ff334b', icon: 'fa-fire' },
  { id: 'amber-gold',       name: 'Amber Gold',       color: '#f59e0b', icon: 'fa-sun' },
  { id: 'arctic-light',     name: 'Arctic Light',     color: '#0284c7', icon: 'fa-snowflake' },
  { id: 'solstice-glow',    name: 'Solstice Glow',    color: '#e07a5f', icon: 'fa-sun-plant-wilt' }
];

const DEFAULT_USER = {
  name: '', email: '', password: '',
  age: 25, height: 175, weight: 75, targetWeight: 70,
  gender: 'male', activityLevel: 1.55, goal: 'cut', ratioType: 'balanced',
  avatar: '', bio: 'Ready to forge my best self.',
  streakDays: 0, savedWorkouts: [], bookmarkedQuotes: []
};

// ─── Main App ──────────────────────────────────────────────────────────────────
class ForgeFuelApp {
  constructor() {
    // Auth state
    this.accounts       = this.ls('ff_accounts', []);
    this.currentUser    = this.ls('ff_current_user', null);

    // App state
    this.route          = this.currentUser ? 'home' : 'auth';
    this.authMode       = 'login'; // 'login' | 'register'
    this.authStep       = 1;

    // Tracker & Nutrition
    this.loggedMeals    = this.ls('ff_meals', []);
    this.loggedSets     = this.ls('ff_sets', []);
    this.waterIntake    = this.ls('ff_water', 0);
    this.customFoodDb   = this.ls('ff_food_db', initialFoodDatabase);
    this.foodSearch     = '';
    this.foodSearchResults = [];
    this.isFoodSearching = false;
    this.activeMealSlot = 'breakfast';

    // Workouts & Builder
    this.workoutTab     = 'routines'; // 'routines' | 'catalog' | 'builder'
    this.workoutSearch  = '';
    this.workoutCategory = 'all';
    this.builderWorkout = null;

    // Gym Mode Active State
    this.activeGymWorkout = null;
    this.gymTimerInterval = null;

    // Calculators
    this.calcUnit       = 'metric'; // 'metric' | 'imperial'
    this.calcData       = {
      weight: 75,
      height: 175,
      weightLbs: 165,
      heightFeet: 5,
      heightInches: 9,
      age: 25,
      gender: 'male',
      activity: 1.55,
      goal: 'cut'
    };

    // Meal Planner
    this.selectedPlannerDay = 'mon';

    // UI
    this.activeTheme    = this.ls('ff_theme', 'cyber-neon');
    this.isThemeOpen    = false;
    this.isMobileOpen   = false;
    this.activeExerciseModal = null;
    this.activeArticleModal  = null;
    this.canvasFrame    = null;
    this.canvasTick     = 0;
    this.authError      = '';
    this.onlineStatus   = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.pwaInstallPrompt = null;

    this.init();
  }

  // ── Storage helpers ──────────────────────────────────────────────────────────
  ls(key, fallback) {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
    catch { return fallback; }
  }
  ss(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  // ── Boot ──────────────────────────────────────────────────────────────────────
  init() {
    this.applyTheme(this.activeTheme);
    if (this.currentUser) {
      this.calcData.weight = this.currentUser.weight || 75;
      this.calcData.height = this.currentUser.height || 175;
      this.calcData.age = this.currentUser.age || 25;
      this.calcData.gender = this.currentUser.gender || 'male';
      this.calcData.activity = this.currentUser.activityLevel || 1.55;
      this.calcData.goal = this.currentUser.goal || 'cut';
      this.calcData.weightLbs = kgToLbs(this.calcData.weight);
      const fi = cmToFeetInches(this.calcData.height);
      this.calcData.heightFeet = fi.feet;
      this.calcData.heightInches = fi.inches;
    }

    // PWA & Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.pwaInstallPrompt = e;
      });
      window.addEventListener('online', () => {
        this.onlineStatus = true;
        this.showToast('Online! Cloud sync active.');
        this.render();
      });
      window.addEventListener('offline', () => {
        this.onlineStatus = false;
        this.showToast('Offline mode active. Logging locally.');
        this.render();
      });
    }

    this.render();
    window.app = this;
  }

  applyTheme(id) {
    this.activeTheme = id;
    document.body.setAttribute('data-theme', id);
    this.ss('ff_theme', id);
  }

  // ── Routing ───────────────────────────────────────────────────────────────────
  go(route) {
    if (!this.currentUser && route !== 'login' && route !== 'register' && route !== 'auth') {
      this.authMode = 'login'; this.route = 'auth'; this.render(); return;
    }
    this.route = route;
    this.isMobileOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  // ── Auth ──────────────────────────────────────────────────────────────────────
  showAuth(mode = 'login') {
    this.authMode = mode; this.authStep = 1; this.authError = '';
    this.route = 'auth'; this.render();
  }

  handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get('email')?.trim().toLowerCase();
    const password = fd.get('password');
    const account = this.accounts.find(a => a.email === email && a.password === password);
    if (!account) { this.authError = 'Invalid email or password. Please try again.'; this.render(); return; }
    this.currentUser = account;
    this.ss('ff_current_user', account);
    this.authError = '';
    this.route = 'home';
    this.showToast(`Welcome back, ${account.name}! 💪`);
    this.render();
  }

  handleRegisterStep1(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name')?.trim();
    const email = fd.get('email')?.trim().toLowerCase();
    const password = fd.get('password');
    const confirm = fd.get('confirm');
    if (!name || name.length < 2) { this.authError = 'Please enter your full name (min 2 chars).'; this.render(); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.authError = 'Please enter a valid email address.'; this.render(); return; }
    if (this.accounts.find(a => a.email === email)) { this.authError = 'An account with that email already exists.'; this.render(); return; }
    if (!password || password.length < 6) { this.authError = 'Password must be at least 6 characters.'; this.render(); return; }
    if (password !== confirm) { this.authError = 'Passwords do not match.'; this.render(); return; }
    this._pendingReg = { name, email, password };
    this.authError = ''; this.authStep = 2; this.render();
  }

  handleRegisterStep2(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newUser = {
      ...DEFAULT_USER,
      ...this._pendingReg,
      age:          parseInt(fd.get('age'))    || 25,
      height:       parseInt(fd.get('height')) || 175,
      weight:       parseFloat(fd.get('weight')) || 75,
      targetWeight: parseFloat(fd.get('targetWeight')) || 70,
      gender:       fd.get('gender') || 'male',
      activityLevel:parseFloat(fd.get('activity')) || 1.55,
      goal:         fd.get('goal') || 'cut',
      streakDays:   0,
      savedWorkouts:[],
      bookmarkedQuotes:[]
    };
    this.accounts.push(newUser);
    this.ss('ff_accounts', this.accounts);
    this.currentUser = newUser;
    this.ss('ff_current_user', newUser);
    this.authError = '';
    this.route = 'home';
    this.triggerConfetti();
    this.showToast(`Welcome to FORGE & FUEL, ${newUser.name}! 🔥`);
    this.render();
  }

  logout() {
    this.currentUser = null;
    this.ss('ff_current_user', null);
    this.route = 'auth';
    this.authMode = 'login';
    this.authError = '';
    this.showToast('Logged out. See you next session!');
    this.render();
  }

  demoLogin() {
    const demo = {
      ...DEFAULT_USER,
      name: 'Alex Demo', email: 'demo@forgefuel.com', password: 'demo123',
      age: 28, height: 182, weight: 85, targetWeight: 80, gender: 'male',
      activityLevel: 1.725, goal: 'cut', ratioType: 'high-protein',
      bio: 'Demo athlete — pushing boundaries.', streakDays: 7
    };
    const exists = this.accounts.find(a => a.email === demo.email);
    if (!exists) { this.accounts.push(demo); this.ss('ff_accounts', this.accounts); }
    this.currentUser = exists || demo;
    this.ss('ff_current_user', this.currentUser);
    this.route = 'home';
    this.showToast('Demo mode activated! 🚀');
    this.render();
  }

  togglePwd(id, btn) {
    const inp = document.getElementById(id);
    if (!inp) return;
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.innerHTML = isText ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
  }

  // ── Metrics ───────────────────────────────────────────────────────────────────
  getMetrics() {
    if (!this.currentUser) return null;
    const bmr  = calculateBMR(this.currentUser);
    const tdee = calculateTDEE(bmr, this.currentUser.activityLevel);
    const macros = calculateMacroTargets(tdee, this.currentUser.goal, this.currentUser.ratioType || 'balanced');
    const waterGoal = calculateWaterGoal(this.currentUser.weight);
    return { bmr, tdee, macros, waterGoal };
  }

  getTodayMacros() {
    return this.loggedMeals.reduce((a, m) => {
      a.cals += m.cals || 0;
      a.p += m.p || 0;
      a.c += m.c || 0;
      a.f += m.f || 0;
      return a;
    }, { cals: 0, p: 0, c: 0, f: 0 });
  }

  // ── Toast & Confetti ──────────────────────────────────────────────────────────
  showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(110%)'; setTimeout(() => toast.remove(), 300); }, 3000);
  }

  triggerConfetti() {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: ['#00f2fe', '#fff', '#10b981'] });
  }

  // ── Render Root ───────────────────────────────────────────────────────────────
  render() {
    const app = document.getElementById('app');
    if (this.route === 'auth' || !this.currentUser) {
      app.innerHTML = this.renderAuth();
    } else {
      app.innerHTML = `
        ${this.renderNav()}
        <main class="main-content">${this.renderView()}</main>
        ${this.renderFooter()}
        ${this.renderMobileBar()}
        ${this.renderModals()}
        ${this.activeGymWorkout ? this.renderGymMode() : ''}
      `;
    }
    this.postRender();
  }

  // ─────────────────────────── NAVBAR ─────────────────────────────────────────
  renderNav() {
    const t = THEMES.find(x => x.id === this.activeTheme) || THEMES[0];
    const u = this.currentUser;
    const initials = u ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    const navLinks = [
      { r: 'home',        icon: 'fa-house',      label: 'Dashboard' },
      { r: 'workouts',    icon: 'fa-dumbbell',   label: 'Workouts' },
      { r: 'tracker',     icon: 'fa-chart-pie',  label: 'Nutrition' },
      { r: 'calculators', icon: 'fa-calculator', label: 'Calculators' },
      { r: 'planner',     icon: 'fa-calendar-week', label: 'Meal Plan' },
      { r: 'knowledge',   icon: 'fa-book-open',  label: 'Knowledge' },
      { r: 'motivation',  icon: 'fa-bolt',       label: 'Mindset' },
    ];
    return `
      <header class="header-wrapper">
        <nav class="navbar">
          <div class="navbar-brand" onclick="window.app.go('home')">
            <div class="brand-icon"><i class="fa-solid ${t.icon}"></i></div>
            <div class="brand-title">FORGE<span>&FUEL</span></div>
          </div>

          <div class="navbar-links ${this.isMobileOpen ? 'mobile-open' : ''}">
            ${navLinks.map(l => `
              <button class="nav-link ${this.route === l.r ? 'active' : ''}" onclick="window.app.go('${l.r}')">
                <i class="fa-solid ${l.icon}"></i> ${l.label}
              </button>
            `).join('')}
          </div>

          <div class="navbar-actions">
            <div class="theme-dropdown-wrapper">
              <button class="theme-toggle-btn" onclick="window.app.toggleTheme()" title="Theme">
                <span class="theme-dot" style="background:${t.color};box-shadow:0 0 8px ${t.color}"></span>
                <span class="hidden-xs">${t.name}</span>
                <i class="fa-solid fa-chevron-down text-xs"></i>
              </button>
              <div id="theme-popover" class="theme-popover ${this.isThemeOpen ? 'show' : ''}">
                ${THEMES.map(th => `
                  <button class="theme-popover-item ${this.activeTheme === th.id ? 'active' : ''}" onclick="window.app.setTheme('${th.id}')">
                    <span style="display:flex;align-items:center;gap:8px">
                      <span class="theme-dot" style="background:${th.color}"></span>${th.name}
                    </span>
                    ${this.activeTheme === th.id ? '<i class="fa-solid fa-check text-xs"></i>' : ''}
                  </button>
                `).join('')}
              </div>
            </div>

            <button class="user-avatar-btn" onclick="window.app.go('profile')" title="My Profile">
              <div class="user-avatar">${initials}</div>
              <span class="hidden-xs user-name-nav">${u ? u.name.split(' ')[0] : ''}</span>
            </button>

            <button class="btn-hamburger" onclick="window.app.toggleMobile()" aria-label="Menu">
              <i class="fa-solid ${this.isMobileOpen ? 'fa-xmark' : 'fa-bars'}"></i>
            </button>
          </div>
        </nav>
      </header>
    `;
  }

  toggleTheme() { this.isThemeOpen = !this.isThemeOpen; this.render(); }
  setTheme(id) { this.applyTheme(id); this.isThemeOpen = false; this.showToast(`Theme: ${THEMES.find(t=>t.id===id)?.name}`); this.render(); }
  toggleMobile() { this.isMobileOpen = !this.isMobileOpen; this.render(); }

  // ─────────────────────────── MOBILE BAR ────────────────────────────────────
  renderMobileBar() {
    const links = [
      { r: 'home',        icon: 'fa-house',         label: 'Home' },
      { r: 'workouts',    icon: 'fa-dumbbell',      label: 'Train' },
      { r: 'tracker',     icon: 'fa-utensils',      label: 'Macros' },
      { r: 'calculators', icon: 'fa-calculator',    label: 'Calcs' },
      { r: 'planner',     icon: 'fa-calendar-week', label: 'Plan' },
      { r: 'profile',     icon: 'fa-user',          label: 'Profile' },
    ];
    return `
      <div class="mobile-bar">
        ${links.map(l => `
          <button class="mobile-link ${this.route === l.r ? 'active' : ''}" onclick="window.app.go('${l.r}')">
            <i class="fa-solid ${l.icon}"></i>
            <span>${l.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  // ─────────────────────────── ROUTER ────────────────────────────────────────
  renderView() {
    switch (this.route) {
      case 'home':        return this.renderHome();
      case 'workouts':    return this.renderWorkouts();
      case 'calculators': return this.renderCalculators();
      case 'tracker':     return this.renderTracker();
      case 'planner':     return this.renderPlanner();
      case 'knowledge':   return this.renderKnowledge();
      case 'motivation':  return this.renderMotivation();
      case 'profile':     return this.renderProfile();
      default:            return this.renderHome();
    }
  }

  // ─────────────────────────── HOME / DASHBOARD ──────────────────────────────
  renderHome() {
    const u  = this.currentUser;
    const m  = this.getMetrics();
    const td = this.getTodayMacros();
    const caloriesPct = m ? Math.min(100, (td.cals / m.macros.calories) * 100) : 0;
    const proteinPct  = m ? Math.min(100, (td.p   / m.macros.protein)   * 100) : 0;
    const waterPct    = m ? Math.min(100, (this.waterIntake / m.waterGoal) * 100) : 0;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return `
      <div class="view-container animate-fade-in">
        <!-- Dashboard Hero -->
        <div class="dashboard-hero">
          <div class="dashboard-hero-text">
            <p class="eyebrow"><span class="eyebrow-dot"></span> ${greeting}</p>
            <h1 class="dashboard-title">${u.name.split(' ')[0]},<br><span>Let's Forge Today.</span></h1>
            <p class="text-muted" style="font-size:0.9rem;margin-top:8px">Day ${u.streakDays + 1} of your fitness journey 🔥</p>
          </div>
          <div class="dashboard-hero-actions">
            <button class="btn btn-primary" onclick="window.app.go('workouts')">
              <i class="fa-solid fa-play"></i> Start Workout
            </button>
            <button class="btn btn-outline" onclick="window.app.go('tracker')">
              <i class="fa-solid fa-utensils"></i> Log Nutrition
            </button>
          </div>
        </div>

        <!-- Quick Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card metric-card-primary">
            <div class="metric-icon"><i class="fa-solid fa-fire-flame-curved"></i></div>
            <div class="metric-body">
              <span class="metric-label">Calories Today</span>
              <span class="metric-value">${td.cals} <small>/ ${m ? m.macros.calories : '—'}</small></span>
              <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${caloriesPct}%"></div></div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon" style="color:var(--color-secondary)"><i class="fa-solid fa-egg"></i></div>
            <div class="metric-body">
              <span class="metric-label">Protein</span>
              <span class="metric-value">${td.p}g <small>/ ${m ? m.macros.protein : '—'}g</small></span>
              <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${proteinPct}%;background:var(--color-secondary)"></div></div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon" style="color:#38bdf8"><i class="fa-solid fa-droplet"></i></div>
            <div class="metric-body">
              <span class="metric-label">Hydration</span>
              <span class="metric-value">${this.waterIntake}ml <small>/ ${m ? m.waterGoal : '—'}ml</small></span>
              <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${waterPct}%;background:#38bdf8"></div></div>
            </div>
          </div>
        </div>

        <!-- Quick Launch Features -->
        <section class="home-section">
          <div class="section-header">
            <div>
              <p class="eyebrow"><span class="eyebrow-dot"></span> Core Systems</p>
              <h2 class="section-title">Your Training & Nutrition Matrix</h2>
            </div>
          </div>
          <div class="grid-4">
            <div class="program-card cursor-pointer" onclick="window.app.go('workouts')">
              <div>
                <span class="program-number">01</span>
                <div style="width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;margin:12px 0">
                  <i class="fa-solid fa-dumbbell" style="font-size:1.1rem"></i>
                </div>
                <h3 class="program-card-title">Workout Builder & Gym Mode</h3>
                <p class="program-card-desc">Drag-and-drop circuits with timer, audio cues, and full-screen gym mode.</p>
              </div>
              <span class="arrow-link">TRAIN NOW <i class="fa-solid fa-arrow-right"></i></span>
            </div>

            <div class="program-card program-card-highlight cursor-pointer" onclick="window.app.go('tracker')">
              <div>
                <span class="program-number">02</span>
                <div style="width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;margin:12px 0">
                  <i class="fa-solid fa-apple-whole" style="font-size:1.1rem"></i>
                </div>
                <h3 class="program-card-title">Macro & Food Database</h3>
                <p class="program-card-desc">Real-time Open Food Facts search + local database and water ring tracker.</p>
              </div>
              <span class="arrow-link">LOG FOOD <i class="fa-solid fa-arrow-right"></i></span>
            </div>

            <div class="program-card cursor-pointer" onclick="window.app.go('calculators')">
              <div>
                <span class="program-number">03</span>
                <div style="width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;margin:12px 0">
                  <i class="fa-solid fa-calculator" style="font-size:1.1rem"></i>
                </div>
                <h3 class="program-card-title">BMI, BMR & TDEE</h3>
                <p class="program-card-desc">Metric & Imperial health calculators with tailored caloric guidelines.</p>
              </div>
              <span class="arrow-link">CALCULATE <i class="fa-solid fa-arrow-right"></i></span>
            </div>

            <div class="program-card cursor-pointer" onclick="window.app.go('planner')">
              <div>
                <span class="program-number">04</span>
                <div style="width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;margin:12px 0">
                  <i class="fa-solid fa-cart-shopping" style="font-size:1.1rem"></i>
                </div>
                <h3 class="program-card-title">Meal Planner & Groceries</h3>
                <p class="program-card-desc">Weekly 7-day meal matrix with auto-consolidating grocery checklist.</p>
              </div>
              <span class="arrow-link">VIEW PLAN <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  // ─────────────────────────── WORKOUTS VIEW ──────────────────────────────────
  renderWorkouts() {
    const customRoutines = workoutService.getAllWorkouts();
    const filteredExercises = exercisesData.filter(ex => {
      const matchCat  = this.workoutCategory === 'all' || ex.category === this.workoutCategory;
      const matchSearch = !this.workoutSearch || ex.name.toLowerCase().includes(this.workoutSearch.toLowerCase());
      return matchCat && matchSearch;
    });

    return `
      <div class="view-container animate-fade-in">
        <div class="page-header">
          <div>
            <p class="eyebrow"><span class="eyebrow-dot"></span> Training Headquarters</p>
            <h1 class="page-title">Workouts & Circuit Builder</h1>
          </div>
          <div class="flex gap-2">
            <button class="btn ${this.workoutTab === 'routines' ? 'btn-primary' : 'btn-outline'} btn-sm"
              onclick="window.app.workoutTab='routines';window.app.render()">
              <i class="fa-solid fa-list-check"></i> Routines & Circuits
            </button>
            <button class="btn ${this.workoutTab === 'catalog' ? 'btn-primary' : 'btn-outline'} btn-sm"
              onclick="window.app.workoutTab='catalog';window.app.render()">
              <i class="fa-solid fa-book"></i> Exercise Guide
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.app.openWorkoutBuilder()">
              <i class="fa-solid fa-plus"></i> Build Routine
            </button>
          </div>
        </div>

        ${this.workoutTab === 'routines' ? `
          <!-- Routines List -->
          <div class="grid-3">
            ${customRoutines.map(routine => {
              const totalExercises = routine.circuits.reduce((acc, c) => acc + c.exercises.length, 0);
              return `
                <div class="routine-card">
                  <div>
                    <div class="routine-header">
                      <span class="badge badge-primary">${routine.category.toUpperCase()}</span>
                      <span class="badge badge-outline">${routine.difficulty || 'Custom'}</span>
                    </div>
                    <h3 class="routine-title" style="margin-top:10px">${routine.title}</h3>
                    <p class="text-muted text-sm" style="margin-bottom:14px">${routine.description || 'Custom circuit routine.'}</p>
                    
                    <div style="font-size:0.8rem;color:var(--color-muted);margin-bottom:12px">
                      <i class="fa-solid fa-layer-group"></i> ${routine.circuits.length} Circuits · 
                      <i class="fa-solid fa-dumbbell"></i> ${totalExercises} Movements
                    </div>

                    <!-- Circuits Summary -->
                    ${routine.circuits.map((c, i) => `
                      <div class="circuit-box" style="padding:10px;margin-bottom:8px">
                        <div style="font-size:0.75rem;font-weight:700;color:var(--color-primary)">CIRCUIT ${i+1}: ${c.name}</div>
                        <div style="font-size:0.75rem;color:var(--color-muted)">${c.exercises.length} Exercises (Rest: ${c.restBetweenSets}s)</div>
                      </div>
                    `).join('')}
                  </div>

                  <div class="flex gap-2" style="margin-top:16px;border-top:1px solid var(--color-border);padding-top:12px">
                    <button class="btn btn-primary btn-sm" style="flex:2" onclick="window.app.startGymMode('${routine.id}')">
                      <i class="fa-solid fa-play"></i> Start Gym Mode
                    </button>
                    <button class="btn btn-outline btn-sm" title="Duplicate Routine" onclick="window.app.duplicateRoutine('${routine.id}')">
                      <i class="fa-solid fa-copy"></i>
                    </button>
                    <button class="btn btn-outline btn-sm" title="Delete Routine" onclick="window.app.deleteRoutine('${routine.id}')">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <!-- Exercise Catalog -->
          <div class="filter-bar">
            <div class="search-wrapper">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" class="search-input" placeholder="Search exercise library..." value="${this.workoutSearch}"
                oninput="window.app.workoutSearch=this.value;window.app.render()" />
            </div>
            <div class="filter-chips">
              ${workoutCategoryObjects.map(cat => `
                <button class="filter-chip ${this.workoutCategory === cat.id ? 'active' : ''}" onclick="window.app.workoutCategory='${cat.id}';window.app.render()">
                  ${cat.name}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="grid-3">
            ${filteredExercises.map(ex => `
              <div class="exercise-card cursor-pointer" onclick="window.app.openExercise('${ex.id}')">
                <div class="exercise-card-header">
                  <span class="badge badge-primary">${ex.difficulty}</span>
                  <span class="badge badge-outline">${ex.equipment}</span>
                </div>
                <h3 class="exercise-card-title">${ex.name}</h3>
                <p class="exercise-card-muscles"><i class="fa-solid fa-bullseye"></i> ${ex.targetMuscles.join(', ')}</p>
                <div class="exercise-card-footer">
                  <span class="badge badge-muted">${ex.category}</span>
                  <span class="arrow-link text-xs">VIEW FORM <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Workout Builder Modal -->
        ${this.builderWorkout ? this.renderWorkoutBuilderModal() : ''}
      </div>
    `;
  }

  openExercise(id) {
    this.activeExerciseModal = exercisesData.find(e => e.id === id);
    this.render();
  }
  closeExercise() {
    this.activeExerciseModal = null;
    if (this.canvasFrame) { cancelAnimationFrame(this.canvasFrame); this.canvasFrame = null; }
    this.render();
  }
  logSet(exId) {
    const weight = parseFloat(document.getElementById('set-weight')?.value) || 0;
    const reps   = parseInt(document.getElementById('set-reps')?.value)   || 0;
    if (reps <= 0) { this.showToast('Please enter valid reps!'); return; }
    
    // Check PR
    const pr = workoutService.checkAndRecordPR(exId, weight, reps);
    this.loggedSets.push({ id: Date.now(), exerciseId: exId, weight, reps, date: new Date().toDateString() });
    this.ss('ff_sets', this.loggedSets);
    
    if (pr) {
      audioCueService.playVictory();
      this.triggerConfetti();
      this.showToast(`🔥 NEW PERSONAL RECORD! Est. 1RM: ${pr.estimated1RM}kg`);
    } else {
      this.showToast(`Set logged: ${weight}kg × ${reps} reps`);
    }
    this.closeExercise();
  }

  // ─── Workout Builder Operations ─────────────────────────────────────────────
  openWorkoutBuilder(id = null) {
    if (id) {
      const existing = workoutService.getWorkoutById(id);
      this.builderWorkout = JSON.parse(JSON.stringify(existing));
    } else {
      this.builderWorkout = {
        id: `routine_${Date.now()}`,
        title: 'New Circuit Routine',
        category: 'strength',
        difficulty: 'Intermediate',
        description: 'Custom circuits forged for strength & stamina.',
        circuits: [
          {
            id: `c_${Date.now()}`,
            name: 'Circuit 1',
            restBetweenSets: 60,
            exercises: [
              { exerciseId: 'barbell-bench-press', sets: 3, reps: 10, weight: 60, duration: 0 }
            ]
          }
        ]
      };
    }
    this.render();
  }

  addCircuitToBuilder() {
    this.builderWorkout.circuits.push({
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: `Circuit ${this.builderWorkout.circuits.length + 1}`,
      restBetweenSets: 60,
      exercises: [
        { exerciseId: exercisesData[0].id, sets: 3, reps: 10, weight: 50, duration: 0 }
      ]
    });
    this.render();
  }

  removeCircuitFromBuilder(cIdx) {
    this.builderWorkout.circuits.splice(cIdx, 1);
    this.render();
  }

  addExerciseToCircuit(cIdx) {
    this.builderWorkout.circuits[cIdx].exercises.push({
      exerciseId: exercisesData[0].id,
      sets: 3,
      reps: 10,
      weight: 40,
      duration: 0
    });
    this.render();
  }

  removeExerciseFromCircuit(cIdx, eIdx) {
    this.builderWorkout.circuits[cIdx].exercises.splice(eIdx, 1);
    this.render();
  }

  saveBuilderWorkout() {
    const titleInp = document.getElementById('builder-title');
    if (titleInp && titleInp.value.trim()) {
      this.builderWorkout.title = titleInp.value.trim();
    }
    workoutService.saveWorkout(this.builderWorkout);
    this.builderWorkout = null;
    this.triggerConfetti();
    this.showToast('Workout routine saved successfully! 🚀');
    this.render();
  }

  duplicateRoutine(id) {
    workoutService.duplicateWorkout(id);
    this.showToast('Workout duplicated!');
    this.render();
  }

  deleteRoutine(id) {
    if (confirm('Are you sure you want to delete this routine?')) {
      workoutService.deleteWorkout(id);
      this.showToast('Workout deleted.');
      this.render();
    }
  }

  renderWorkoutBuilderModal() {
    const b = this.builderWorkout;
    return `
      <div class="modal-backdrop" onclick="if(event.target===this){window.app.builderWorkout=null;window.app.render()}">
        <div class="modal-content" style="max-width:760px">
          <div class="modal-header">
            <div>
              <span class="badge badge-primary">ROUTINE BUILDER</span>
              <h2 class="modal-title" style="margin-top:6px">Create / Edit Routine</h2>
            </div>
            <button class="modal-close-btn" onclick="window.app.builderWorkout=null;window.app.render()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div style="display:flex;flex-direction:column;gap:16px">
            <div class="input-group">
              <label class="input-label">Routine Name</label>
              <input type="text" id="builder-title" class="input-field" value="${b.title}" placeholder="e.g. Upper Body Hypertrophy" />
            </div>

            <div class="reg-grid-2">
              <div class="input-group">
                <label class="input-label">Category</label>
                <select class="input-field" onchange="window.app.builderWorkout.category=this.value">
                  <option value="strength" ${b.category==='strength'?'selected':''}>Strength</option>
                  <option value="hypertrophy" ${b.category==='hypertrophy'?'selected':''}>Hypertrophy</option>
                  <option value="cardio" ${b.category==='cardio'?'selected':''}>Cardio & HIIT</option>
                  <option value="mobility" ${b.category==='mobility'?'selected':''}>Mobility</option>
                </select>
              </div>
              <div class="input-group">
                <label class="input-label">Difficulty</label>
                <select class="input-field" onchange="window.app.builderWorkout.difficulty=this.value">
                  <option value="Beginner" ${b.difficulty==='Beginner'?'selected':''}>Beginner</option>
                  <option value="Intermediate" ${b.difficulty==='Intermediate'?'selected':''}>Intermediate</option>
                  <option value="Advanced" ${b.difficulty==='Advanced'?'selected':''}>Advanced</option>
                </select>
              </div>
            </div>

            <!-- Circuits Builder -->
            <div>
              <div class="flex justify-between items-center" style="margin-bottom:10px">
                <h4 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--color-white)">Circuits & Exercises</h4>
                <button class="btn btn-outline btn-sm" onclick="window.app.addCircuitToBuilder()"><i class="fa-solid fa-plus"></i> Add Circuit</button>
              </div>

              ${b.circuits.map((circuit, cIdx) => `
                <div class="circuit-box" style="margin-bottom:14px">
                  <div class="circuit-header">
                    <input type="text" value="${circuit.name}" style="background:transparent;border:none;color:var(--color-primary);font-weight:700;font-size:0.9rem"
                      onchange="window.app.builderWorkout.circuits[${cIdx}].name=this.value" />
                    <div class="flex gap-2 items-center">
                      <label style="font-size:0.75rem;color:var(--color-muted)">Rest (s):</label>
                      <select style="background:var(--bg-card);border:1px solid var(--color-border);color:#fff;border-radius:4px;padding:2px 6px;font-size:0.75rem"
                        onchange="window.app.builderWorkout.circuits[${cIdx}].restBetweenSets=parseInt(this.value)">
                        ${[30,45,60,90,120,180].map(s => `<option value="${s}" ${circuit.restBetweenSets===s?'selected':''}>${s}s</option>`).join('')}
                      </select>
                      <button class="btn btn-outline btn-sm" style="padding:4px 8px" onclick="window.app.removeCircuitFromBuilder(${cIdx})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </div>

                  <!-- Exercises in Circuit -->
                  ${circuit.exercises.map((ex, eIdx) => `
                    <div class="circuit-item-row">
                      <select class="input-field" style="padding:6px 10px;font-size:0.8rem"
                        onchange="window.app.builderWorkout.circuits[${cIdx}].exercises[${eIdx}].exerciseId=this.value">
                        ${exercisesData.map(ed => `<option value="${ed.id}" ${ed.id===ex.exerciseId?'selected':''}>${ed.name}</option>`).join('')}
                      </select>
                      <input type="number" class="input-field" placeholder="Sets" value="${ex.sets}" title="Sets"
                        onchange="window.app.builderWorkout.circuits[${cIdx}].exercises[${eIdx}].sets=parseInt(this.value)||1" />
                      <input type="number" class="input-field" placeholder="Reps" value="${ex.reps}" title="Reps"
                        onchange="window.app.builderWorkout.circuits[${cIdx}].exercises[${eIdx}].reps=parseInt(this.value)||1" />
                      <input type="number" class="input-field" placeholder="Kg" value="${ex.weight}" title="Weight (kg)"
                        onchange="window.app.builderWorkout.circuits[${cIdx}].exercises[${eIdx}].weight=parseFloat(this.value)||0" />
                      <button class="btn btn-outline btn-sm" style="padding:6px;width:32px;height:32px"
                        onclick="window.app.removeExerciseFromCircuit(${cIdx}, ${eIdx})"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                  `).join('')}

                  <button class="btn btn-outline btn-sm" style="width:100%;margin-top:8px" onclick="window.app.addExerciseToCircuit(${cIdx})">
                    <i class="fa-solid fa-plus"></i> Add Exercise
                  </button>
                </div>
              `).join('')}
            </div>

            <div class="flex gap-2" style="margin-top:10px">
              <button class="btn btn-primary" style="flex:1" onclick="window.app.saveBuilderWorkout()">
                <i class="fa-solid fa-floppy-disk"></i> Save Routine
              </button>
              <button class="btn btn-outline" onclick="window.app.builderWorkout=null;window.app.render()">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ─── Guided Gym Mode Fullscreen ─────────────────────────────────────────────
  startGymMode(routineId) {
    const routine = workoutService.getWorkoutById(routineId);
    if (!routine || !routine.circuits.length) {
      this.showToast('Workout routine has no circuits!');
      return;
    }

    this.activeGymWorkout = {
      routine,
      circuitIdx: 0,
      exerciseIdx: 0,
      setIdx: 1,
      timerSeconds: 0,
      isResting: false,
      restRemaining: 0,
      completedSetsCount: 0,
      totalVolumeKg: 0
    };

    audioCueService.playGo();
    if (this.gymTimerInterval) clearInterval(this.gymTimerInterval);
    this.gymTimerInterval = setInterval(() => this.tickGymTimer(), 1000);
    this.render();
  }

  tickGymTimer() {
    if (!this.activeGymWorkout) return;
    this.activeGymWorkout.timerSeconds++;

    if (this.activeGymWorkout.isResting) {
      this.activeGymWorkout.restRemaining--;
      if (this.activeGymWorkout.restRemaining <= 3 && this.activeGymWorkout.restRemaining > 0) {
        audioCueService.playCountdown();
      }
      if (this.activeGymWorkout.restRemaining <= 0) {
        this.activeGymWorkout.isResting = false;
        audioCueService.playGo();
      }
    }

    // Refresh timer text in DOM without re-rendering whole app for buttery smooth 60fps
    const timerEl = document.getElementById('gym-timer-display');
    if (timerEl) {
      if (this.activeGymWorkout.isResting) {
        timerEl.innerText = `REST: ${this.activeGymWorkout.restRemaining}s`;
        timerEl.style.color = 'var(--color-secondary)';
      } else {
        const m = Math.floor(this.activeGymWorkout.timerSeconds / 60);
        const s = this.activeGymWorkout.timerSeconds % 60;
        timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        timerEl.style.color = 'var(--color-primary)';
      }
    }
  }

  nextGymSet() {
    const gw = this.activeGymWorkout;
    const curCircuit = gw.routine.circuits[gw.circuitIdx];
    const curExSpec = curCircuit.exercises[gw.exerciseIdx];
    const exData = exercisesData.find(e => e.id === curExSpec.exerciseId);

    gw.completedSetsCount++;
    gw.totalVolumeKg += (curExSpec.weight || 0) * (curExSpec.reps || 0);

    // Check PR
    const pr = workoutService.checkAndRecordPR(curExSpec.exerciseId, curExSpec.weight, curExSpec.reps);
    if (pr) {
      audioCueService.playVictory();
      this.triggerConfetti();
      this.showToast(`🔥 NEW PR: ${exData?.name || ''} ${pr.weight}kg × ${pr.reps} reps!`);
    }

    // Advance set or exercise
    if (gw.setIdx < curExSpec.sets) {
      gw.setIdx++;
      gw.isResting = true;
      gw.restRemaining = curCircuit.restBetweenSets || 60;
      audioCueService.playRestChime();
    } else {
      // Advance to next exercise in circuit
      if (gw.exerciseIdx < curCircuit.exercises.length - 1) {
        gw.exerciseIdx++;
        gw.setIdx = 1;
        gw.isResting = true;
        gw.restRemaining = curCircuit.restBetweenSets || 60;
        audioCueService.playRestChime();
      } else {
        // Advance to next circuit
        if (gw.circuitIdx < gw.routine.circuits.length - 1) {
          gw.circuitIdx++;
          gw.exerciseIdx = 0;
          gw.setIdx = 1;
          gw.isResting = true;
          gw.restRemaining = 90;
          audioCueService.playRestChime();
        } else {
          // Workout Complete!
          this.finishGymWorkout();
          return;
        }
      }
    }
    this.render();
  }

  skipRest() {
    if (this.activeGymWorkout) {
      this.activeGymWorkout.isResting = false;
      this.activeGymWorkout.restRemaining = 0;
      audioCueService.playGo();
      this.render();
    }
  }

  addRest(seconds = 30) {
    if (this.activeGymWorkout && this.activeGymWorkout.isResting) {
      this.activeGymWorkout.restRemaining += seconds;
      this.render();
    }
  }

  finishGymWorkout() {
    if (!this.activeGymWorkout) return;
    if (this.gymTimerInterval) { clearInterval(this.gymTimerInterval); this.gymTimerInterval = null; }

    const gw = this.activeGymWorkout;
    workoutService.logCompletedWorkout({
      workoutId: gw.routine.id,
      title: gw.routine.title,
      durationSeconds: gw.timerSeconds,
      totalVolumeKg: gw.totalVolumeKg,
      setsCompleted: gw.completedSetsCount
    });

    audioCueService.playVictory();
    this.triggerConfetti();
    this.showToast(`Workout Complete! Total Volume: ${gw.totalVolumeKg}kg 🔥`);
    this.activeGymWorkout = null;
    this.render();
  }

  exitGymMode() {
    if (confirm('Exit active workout session?')) {
      if (this.gymTimerInterval) { clearInterval(this.gymTimerInterval); this.gymTimerInterval = null; }
      this.activeGymWorkout = null;
      this.render();
    }
  }

  renderGymMode() {
    const gw = this.activeGymWorkout;
    const curCircuit = gw.routine.circuits[gw.circuitIdx];
    const curExSpec = curCircuit.exercises[gw.exerciseIdx];
    const exData = exercisesData.find(e => e.id === curExSpec.exerciseId);

    // Next exercise preview
    let nextPreview = 'Final Set / Finish Workout';
    if (gw.setIdx < curExSpec.sets) {
      nextPreview = `Next: Set ${gw.setIdx + 1} of ${curExSpec.sets} (${exData?.name})`;
    } else if (gw.exerciseIdx < curCircuit.exercises.length - 1) {
      const nextExSpec = curCircuit.exercises[gw.exerciseIdx + 1];
      const nextExData = exercisesData.find(e => e.id === nextExSpec.exerciseId);
      nextPreview = `Next Exercise: ${nextExData?.name || 'Next Movement'}`;
    } else if (gw.circuitIdx < gw.routine.circuits.length - 1) {
      const nextCirc = gw.routine.circuits[gw.circuitIdx + 1];
      nextPreview = `Next Circuit: ${nextCirc.name}`;
    }

    const m = Math.floor(gw.timerSeconds / 60);
    const s = gw.timerSeconds % 60;
    const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    return `
      <div class="gym-overlay">
        <!-- Gym Header -->
        <div class="gym-header">
          <div>
            <span class="gym-routine-badge"><i class="fa-solid fa-dumbbell"></i> ${gw.routine.title}</span>
            <div style="font-size:0.8rem;color:var(--color-muted);margin-top:2px">
              ${curCircuit.name} · Exercise ${gw.exerciseIdx + 1}/${curCircuit.exercises.length}
            </div>
          </div>
          <button class="gym-exit-btn" onclick="window.app.exitGymMode()">
            <i class="fa-solid fa-xmark"></i> End Workout
          </button>
        </div>

        <!-- Gym Body -->
        <div class="gym-body">
          <div id="gym-timer-display" class="gym-timer">${gw.isResting ? `REST: ${gw.restRemaining}s` : timeFormatted}</div>

          <div>
            <h2 class="gym-exercise-title">${exData?.name || 'Current Movement'}</h2>
            <div class="gym-set-counter">
              <span>SET</span>
              <strong>${gw.setIdx} / ${curExSpec.sets}</strong>
            </div>
          </div>

          <!-- Target Stats -->
          <div class="gym-target-stats">
            <div class="gym-stat-pill">
              <span class="gym-stat-label">Target Weight</span>
              <span class="gym-stat-val">${curExSpec.weight > 0 ? `${curExSpec.weight}kg` : 'Bodyweight'}</span>
            </div>
            <div class="gym-stat-pill">
              <span class="gym-stat-label">Target Reps</span>
              <span class="gym-stat-val">${curExSpec.reps || 'Failure'}</span>
            </div>
          </div>

          <div class="gym-next-banner">
            <i class="fa-solid fa-forward"></i> ${nextPreview}
          </div>
        </div>

        <!-- Gym Action Buttons -->
        <div class="gym-actions">
          ${gw.isResting ? `
            <button class="gym-btn-secondary" onclick="window.app.addRest(30)">
              <i class="fa-solid fa-plus"></i> +30s Rest
            </button>
            <button class="gym-btn-primary" onclick="window.app.skipRest()">
              <i class="fa-solid fa-forward-step"></i> Skip Rest & Start
            </button>
          ` : `
            <button class="gym-btn-primary" onclick="window.app.nextGymSet()">
              <i class="fa-solid fa-check"></i> Complete Set ${gw.setIdx}
            </button>
          `}
        </div>
      </div>
    `;
  }

  // ─────────────────────────── CALCULATORS VIEW (SEO) ─────────────────────────
  renderCalculators() {
    const isMetric = this.calcUnit === 'metric';
    const cd = this.calcData;

    // Weight and height in kg/cm
    const weightKg = isMetric ? cd.weight : lbsToKg(cd.weightLbs);
    const heightCm = isMetric ? cd.height : feetInchesToCm(cd.heightFeet, cd.heightInches);

    const bmi = calculateBMI(weightKg, heightCm);
    const bmiCat = getBMICategory(bmi);

    const bmr = calculateBMR({ gender: cd.gender, weight: weightKg, height: heightCm, age: cd.age });
    const tdee = calculateTDEE(bmr, cd.activity);
    const macros = calculateMacroTargets(tdee, cd.goal);

    return `
      <div class="view-container animate-fade-in">
        <!-- SEO Semantic Header -->
        <div class="page-header">
          <div>
            <p class="eyebrow"><span class="eyebrow-dot"></span> Evidence-Based Metrics</p>
            <h1 class="page-title">Fitness Calculators: BMI, BMR & TDEE</h1>
          </div>
          <!-- Unit Toggle Switch -->
          <div class="unit-toggle-wrap">
            <button class="unit-toggle-btn ${isMetric ? 'active' : ''}" onclick="window.app.setCalcUnit('metric')">
              Metric (kg / cm)
            </button>
            <button class="unit-toggle-btn ${!isMetric ? 'active' : ''}" onclick="window.app.setCalcUnit('imperial')">
              Imperial (lbs / ft)
            </button>
          </div>
        </div>

        <p class="text-muted" style="margin-bottom:24px;font-size:0.95rem;max-width:800px;line-height:1.6">
          Optimize your physique using calibrated physiological formulas. Calculates Basal Metabolic Rate (BMR) via the Mifflin-St Jeor equation, Total Daily Energy Expenditure (TDEE), and Quetelet Body Mass Index (BMI).
        </p>

        <!-- Calculators Grid -->
        <div class="grid-3">
          <!-- 1. BMI Card -->
          <div class="calc-card">
            <h2 class="calc-card-title"><i class="fa-solid fa-weight-scale" style="color:var(--color-primary)"></i> Body Mass Index (BMI)</h2>
            
            <div class="reg-grid-2">
              ${isMetric ? `
                <div class="input-group">
                  <label class="input-label">Weight (kg)</label>
                  <input type="number" class="input-field" value="${cd.weight}"
                    oninput="window.app.calcData.weight=parseFloat(this.value)||70;window.app.render()" />
                </div>
                <div class="input-group">
                  <label class="input-label">Height (cm)</label>
                  <input type="number" class="input-field" value="${cd.height}"
                    oninput="window.app.calcData.height=parseFloat(this.value)||175;window.app.render()" />
                </div>
              ` : `
                <div class="input-group">
                  <label class="input-label">Weight (lbs)</label>
                  <input type="number" class="input-field" value="${cd.weightLbs}"
                    oninput="window.app.calcData.weightLbs=parseFloat(this.value)||160;window.app.render()" />
                </div>
                <div class="input-group">
                  <label class="input-label">Height (ft & in)</label>
                  <div class="flex gap-2">
                    <input type="number" class="input-field" placeholder="Ft" value="${cd.heightFeet}"
                      oninput="window.app.calcData.heightFeet=parseInt(this.value)||5;window.app.render()" />
                    <input type="number" class="input-field" placeholder="In" value="${cd.heightInches}"
                      oninput="window.app.calcData.heightInches=parseInt(this.value)||0;window.app.render()" />
                  </div>
                </div>
              `}
            </div>

            <div class="calc-result-badge">
              <span class="text-muted text-xs">YOUR BMI SCORE</span>
              <div class="calc-result-number" style="color:${bmiCat.color}">${bmi}</div>
              <span class="badge" style="background:${bmiCat.color}22;color:${bmiCat.color};font-weight:700">
                ${bmiCat.category}
              </span>
            </div>

            <p style="font-size:0.82rem;color:var(--color-muted);line-height:1.5">${bmiCat.advice}</p>
          </div>

          <!-- 2. BMR Card -->
          <div class="calc-card">
            <h2 class="calc-card-title"><i class="fa-solid fa-heart-pulse" style="color:var(--color-secondary)"></i> Basal Metabolic Rate (BMR)</h2>
            
            <div class="reg-grid-2">
              <div class="input-group">
                <label class="input-label">Age</label>
                <input type="number" class="input-field" value="${cd.age}"
                  oninput="window.app.calcData.age=parseInt(this.value)||25;window.app.render()" />
              </div>
              <div class="input-group">
                <label class="input-label">Gender</label>
                <select class="input-field" onchange="window.app.calcData.gender=this.value;window.app.render()">
                  <option value="male" ${cd.gender==='male'?'selected':''}>Male</option>
                  <option value="female" ${cd.gender==='female'?'selected':''}>Female</option>
                </select>
              </div>
            </div>

            <div class="calc-result-badge">
              <span class="text-muted text-xs">BASE CALORIES BURNED AT REST</span>
              <div class="calc-result-number">${bmr} <small style="font-size:1.1rem;color:var(--color-muted)">kcal/day</small></div>
              <span class="text-muted text-xs">Mifflin-St Jeor Equation</span>
            </div>

            <p style="font-size:0.82rem;color:var(--color-muted);line-height:1.5">
              BMR is the baseline energy expenditure your body requires to fuel organ functions, respiration, and cellular recovery at complete rest.
            </p>
          </div>

          <!-- 3. TDEE Card -->
          <div class="calc-card">
            <h2 class="calc-card-title"><i class="fa-solid fa-bolt" style="color:#f59e0b"></i> Total Daily Energy (TDEE)</h2>
            
            <div class="input-group">
              <label class="input-label">Activity Multiplier</label>
              <select class="input-field" onchange="window.app.calcData.activity=parseFloat(this.value);window.app.render()">
                <option value="1.2" ${cd.activity===1.2?'selected':''}>Sedentary (Desk job, little exercise)</option>
                <option value="1.375" ${cd.activity===1.375?'selected':''}>Light (1-3 workout days/wk)</option>
                <option value="1.55" ${cd.activity===1.55?'selected':''}>Moderate (3-5 workout days/wk)</option>
                <option value="1.725" ${cd.activity===1.725?'selected':''}>Heavy (6-7 intense days/wk)</option>
                <option value="1.9" ${cd.activity===1.9?'selected':''}>Athlete (2x training/day)</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Target Fitness Goal</label>
              <select class="input-field" onchange="window.app.calcData.goal=this.value;window.app.render()">
                <option value="cut" ${cd.goal==='cut'?'selected':''}>Fat Loss Cut (-20% deficit)</option>
                <option value="maintenance" ${cd.goal==='maintenance'?'selected':''}>Maintenance (Equilibrium)</option>
                <option value="bulk" ${cd.goal==='bulk'?'selected':''}>Lean Bulk (+15% surplus)</option>
                <option value="recomp" ${cd.goal==='recomp'?'selected':''}>Body Recomposition (-5%)</option>
              </select>
            </div>

            <div class="calc-result-badge">
              <span class="text-muted text-xs">TARGET CALORIES FOR YOUR GOAL</span>
              <div class="calc-result-number" style="color:var(--color-primary)">${macros.calories} <small style="font-size:1.1rem;color:var(--color-muted)">kcal</small></div>
              <div class="flex justify-center gap-2" style="margin-top:6px;font-size:0.8rem">
                <span style="color:#10b981">P: ${macros.protein}g</span> · 
                <span style="color:#f59e0b">C: ${macros.carbs}g</span> · 
                <span style="color:#e879f9">F: ${macros.fat}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setCalcUnit(unit) {
    this.calcUnit = unit;
    this.render();
  }

  // ─────────────────────────── NUTRITION & TRACKER VIEW ───────────────────────
  renderTracker() {
    const m  = this.getMetrics();
    const td = this.getTodayMacros();
    if (!m) return '<div class="view-container"><p>Loading...</p></div>';

    const pct = (v, t) => `${Math.min(100, Math.round((v / t) * 100))}%`;
    const waterGoal = m.waterGoal || 2600;
    const waterDashoffset = Math.max(0, 440 - (440 * (this.waterIntake / waterGoal)));

    const foodsToDisplay = this.foodSearchResults.length > 0 ? this.foodSearchResults : this.customFoodDb.slice(0, 8);

    return `
      <div class="view-container animate-fade-in">
        <div class="page-header">
          <div>
            <p class="eyebrow"><span class="eyebrow-dot"></span> Nutrition Strategy</p>
            <h1 class="page-title">Macro & Calorie Tracker</h1>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm" onclick="window.app.clearMeals()"><i class="fa-solid fa-rotate-left"></i> Reset Meals</button>
            <button class="btn btn-primary btn-sm" onclick="window.app.addWater(250)"><i class="fa-solid fa-droplet"></i> +250ml</button>
          </div>
        </div>

        <!-- Macro Summary Cards -->
        <div class="tracker-summary-grid">
          <div class="tracker-macro-card tracker-macro-cals">
            <div class="tmac-top">
              <span class="tmac-label">Calories</span>
              <i class="fa-solid fa-fire-flame-curved tmac-icon"></i>
            </div>
            <div class="tmac-vals">${td.cals} <span>/ ${m.macros.calories}</span></div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct(td.cals,m.macros.calories)};background:var(--color-primary)"></div></div>
            <span class="tmac-remain">${Math.max(0, m.macros.calories - td.cals)} kcal remaining</span>
          </div>

          <div class="tracker-macro-card">
            <div class="tmac-top"><span class="tmac-label">Protein</span><i class="fa-solid fa-egg tmac-icon" style="color:#10b981"></i></div>
            <div class="tmac-vals">${td.p}g <span>/ ${m.macros.protein}g</span></div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct(td.p,m.macros.protein)};background:#10b981"></div></div>
          </div>

          <div class="tracker-macro-card">
            <div class="tmac-top"><span class="tmac-label">Carbs</span><i class="fa-solid fa-wheat-awn tmac-icon" style="color:#f59e0b"></i></div>
            <div class="tmac-vals">${td.c}g <span>/ ${m.macros.carbs}g</span></div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct(td.c,m.macros.carbs)};background:#f59e0b"></div></div>
          </div>

          <div class="tracker-macro-card">
            <div class="tmac-top"><span class="tmac-label">Fats</span><i class="fa-solid fa-droplet tmac-icon" style="color:#e879f9"></i></div>
            <div class="tmac-vals">${td.f}g <span>/ ${m.macros.fat}g</span></div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct(td.f,m.macros.fat)};background:#e879f9"></div></div>
          </div>
        </div>

        <!-- 2-Column: Water Ring Tracker + Logged Meals By Slot -->
        <div class="grid-2" style="margin-top:24px">
          <!-- Water Progress Ring Card -->
          <div class="water-tracker-card">
            <div class="flex justify-between items-center w-full">
              <h3 style="font-family:var(--font-heading);font-size:1.3rem;color:var(--color-white)">
                <i class="fa-solid fa-droplet" style="color:#38bdf8"></i> Hydration Ring
              </h3>
              <button class="btn btn-outline btn-sm" onclick="window.app.toggleWaterReminder()">
                <i class="fa-solid fa-bell"></i> Remind Me
              </button>
            </div>

            <!-- SVG Circular Ring -->
            <svg class="water-ring-svg" viewBox="0 0 160 160">
              <circle class="water-ring-bg" cx="80" cy="80" r="70" stroke-width="12" fill="none" />
              <circle class="water-ring-fill" cx="80" cy="80" r="70" stroke-width="12" fill="none"
                stroke-dasharray="440" stroke-dashoffset="${waterDashoffset}" />
            </svg>

            <div>
              <div style="font-family:var(--font-heading);font-size:2.2rem;color:#38bdf8;line-height:1">
                ${this.waterIntake} <span style="font-size:1rem;color:var(--color-muted)">/ ${waterGoal} ml</span>
              </div>
              <p class="text-muted text-xs" style="margin-top:4px">
                ${Math.round((this.waterIntake / waterGoal) * 100)}% of daily goal achieved
              </p>
            </div>

            <div class="water-quick-grid">
              <button class="water-quick-btn" onclick="window.app.addWater(150)">+150ml (Cup)</button>
              <button class="water-quick-btn" onclick="window.app.addWater(250)">+250ml (Glass)</button>
              <button class="water-quick-btn" onclick="window.app.addWater(500)">+500ml (Bottle)</button>
            </div>
          </div>

          <!-- Logged Meals by Slot -->
          <div class="calc-card">
            <h3 class="calc-card-title"><i class="fa-solid fa-utensils"></i> Today's Logged Meals</h3>
            ${this.loggedMeals.length === 0 ? `
              <div class="empty-state" style="padding:24px">
                <i class="fa-solid fa-bowl-food"></i>
                <p>No meals logged yet today. Search below to add food.</p>
              </div>
            ` : `
              <div style="max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">
                ${this.loggedMeals.map((m, idx) => `
                  <div class="flex justify-between items-center" style="padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid var(--color-border);border-radius:var(--radius-md)">
                    <div>
                      <strong style="color:var(--color-white);font-size:0.9rem">${m.name}</strong>
                      <div class="text-muted text-xs">${m.cals} kcal · ${m.p}g P · ${m.c}g C · ${m.f}g F (${m.slot || 'Meal'})</div>
                    </div>
                    <button class="btn btn-outline btn-sm" style="padding:4px 8px" onclick="window.app.removeMeal(${idx})"><i class="fa-solid fa-trash"></i></button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Food Search & Log Section (with Open Food Facts API) -->
        <div class="tracker-section" style="margin-top:32px">
          <div class="flex justify-between items-center" style="margin-bottom:12px;flex-wrap:wrap;gap:8px">
            <div>
              <h3 class="section-subtitle"><i class="fa-solid fa-magnifying-glass"></i> Search Food (Open Food Facts + Core)</h3>
              <p class="text-muted text-xs">Search global food items or choose from curated fitness fuel.</p>
            </div>

            <!-- Target Meal Slot Selector -->
            <div class="flex gap-2 items-center">
              <span class="text-muted text-xs">Add to:</span>
              <select class="input-field" style="padding:4px 10px;font-size:0.8rem;width:auto"
                onchange="window.app.activeMealSlot=this.value">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
          </div>

          <div class="search-wrapper" style="max-width:480px;margin-bottom:16px">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" class="search-input" placeholder="Search (e.g., Chicken breast, Greek yogurt, Banana)..."
              value="${this.foodSearch}"
              oninput="window.app.handleFoodSearch(this.value)" />
          </div>

          <div class="food-grid">
            ${foodsToDisplay.map(f => `
              <div class="food-item">
                <div class="food-item-info">
                  <div class="flex items-center gap-2">
                    <span class="food-item-name">${f.name}</span>
                    <span class="badge badge-muted text-xs">${f.source || 'Core'}</span>
                  </div>
                  <span class="food-item-serving">${f.serving}</span>
                  <div class="food-item-macros">
                    <span>${f.cals} kcal</span>
                    <span>${f.p}g P</span>
                    <span>${f.c}g C</span>
                    <span>${f.f}g F</span>
                  </div>
                </div>
                <button class="btn-log-food" onclick="window.app.logFood('${f.id}')" title="Log to ${this.activeMealSlot}">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  async handleFoodSearch(val) {
    this.foodSearch = val;
    if (!val || val.length < 2) {
      this.foodSearchResults = [];
      this.render();
      return;
    }
    const results = await foodApiService.searchFood(val);
    this.foodSearchResults = results;
    this.render();
  }

  logFood(foodId) {
    const f = this.foodSearchResults.find(x => x.id === foodId) || this.customFoodDb.find(x => x.id === foodId);
    if (!f) return;
    this.loggedMeals.push({
      ...f,
      slot: this.activeMealSlot || 'meal',
      loggedAt: Date.now()
    });
    this.ss('ff_meals', this.loggedMeals);
    this.showToast(`Added ${f.name} to ${this.activeMealSlot}!`);
    this.render();
  }

  removeMeal(idx) {
    this.loggedMeals.splice(idx, 1);
    this.ss('ff_meals', this.loggedMeals);
    this.render();
  }

  clearMeals() {
    this.loggedMeals = [];
    this.ss('ff_meals', []);
    this.showToast('Meals reset for today.');
    this.render();
  }

  addWater(amount) {
    this.waterIntake += amount;
    this.ss('ff_water', this.waterIntake);
    audioCueService.playTone(600, 'sine', 0.1, 0.15);
    this.showToast(`+${amount}ml logged! 💧`);
    this.render();
  }

  async toggleWaterReminder() {
    const granted = await notificationService.requestPermission();
    if (granted) {
      notificationService.scheduleWaterReminder(60);
      this.showToast('Hydration alerts active! We will remind you in 60 mins.');
    } else {
      this.showToast('Notification permission denied or unsupported. In-app alerts enabled.');
    }
  }

  // ─────────────────────────── MEAL PLANNER & GROCERY LIST ────────────────────
  renderPlanner() {
    const weeklyPlan = nutritionService.getWeeklyPlan();
    const activeDay = this.selectedPlannerDay;
    const dayData = weeklyPlan[activeDay] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    const dayTotals = nutritionService.getDayTotals(activeDay);
    const groceries = nutritionService.getGroceryList();

    return `
      <div class="view-container animate-fade-in">
        <div class="page-header">
          <div>
            <p class="eyebrow"><span class="eyebrow-dot"></span> Weekly Preparation</p>
            <h1 class="page-title">Meal Planner & Smart Grocery List</h1>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.app.generateGroceries()">
            <i class="fa-solid fa-arrows-rotate"></i> Sync Grocery List
          </button>
        </div>

        <!-- 7-Day Week Tabs -->
        <div class="flex gap-2 flex-wrap" style="margin-bottom:24px">
          ${DAYS_OF_WEEK.map(d => `
            <button class="planner-day-pill ${activeDay === d.id ? 'active' : ''}" onclick="window.app.selectedPlannerDay='${d.id}';window.app.render()">
              ${d.name}
            </button>
          `).join('')}
        </div>

        <div class="grid-2">
          <!-- Day Plan Cards -->
          <div class="calc-card">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="calc-card-title"><i class="fa-solid fa-calendar-day"></i> ${DAYS_OF_WEEK.find(d => d.id === activeDay)?.name} Plan</h3>
                <span class="text-muted text-xs">Day totals: ${dayTotals.cals} kcal · ${dayTotals.p}g P · ${dayTotals.c}g C · ${dayTotals.f}g F</span>
              </div>
            </div>

            <!-- Meal Slots (Breakfast, Lunch, Dinner, Snacks) -->
            ${MEAL_TYPES.map(mt => {
              const items = dayData[mt.id] || [];
              return `
                <div class="circuit-box" style="margin-top:10px">
                  <div class="flex justify-between items-center" style="margin-bottom:8px">
                    <span style="font-weight:700;color:var(--color-primary);font-size:0.85rem">
                      <i class="fa-solid ${mt.icon}"></i> ${mt.name}
                    </span>
                    <button class="btn btn-outline btn-sm" style="padding:2px 8px;font-size:0.72rem"
                      onclick="window.app.promptAddMealToPlan('${activeDay}', '${mt.id}')">
                      <i class="fa-solid fa-plus"></i> Add Food
                    </button>
                  </div>

                  ${items.length === 0 ? `
                    <div style="font-size:0.75rem;color:var(--color-muted);padding:6px 0">No items added.</div>
                  ` : items.map(item => `
                    <div class="flex justify-between items-center" style="padding:6px 8px;background:var(--bg-card);border-radius:4px;margin-bottom:4px;font-size:0.8rem">
                      <span>${item.name} (${item.cals} kcal)</span>
                      <button class="btn btn-outline btn-sm" style="padding:2px 6px" onclick="window.app.removeFoodFromPlan('${activeDay}', '${mt.id}', '${item.instanceId}')">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  `).join('')}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Auto-Generated Grocery List -->
          <div class="grocery-list-card">
            <div class="flex justify-between items-center" style="margin-bottom:16px">
              <h3 class="calc-card-title"><i class="fa-solid fa-cart-shopping"></i> Consolidated Grocery List</h3>
              <button class="btn btn-outline btn-sm" onclick="window.app.clearCheckedGroceries()">
                <i class="fa-solid fa-trash"></i> Clear Checked
              </button>
            </div>

            <!-- Add manual grocery item -->
            <form onsubmit="window.app.addCustomGrocery(event)" style="display:flex;gap:8px;margin-bottom:16px">
              <input type="text" name="groceryItem" class="input-field" placeholder="Add custom item (e.g. Olive Oil)..." required />
              <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-plus"></i> Add</button>
            </form>

            ${groceries.length === 0 ? `
              <div class="empty-state" style="padding:24px">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Grocery list empty. Sync from weekly meal plan above!</p>
              </div>
            ` : `
              <div style="max-height:380px;overflow-y:auto;display:flex;flex-direction:column;gap:6px">
                ${groceries.map(g => `
                  <div class="grocery-item-row ${g.checked ? 'checked' : ''}" onclick="window.app.toggleGrocery('${g.name}')">
                    <div class="flex items-center gap-2">
                      <i class="fa-solid ${g.checked ? 'fa-square-check' : 'fa-square'}" style="color:${g.checked ? 'var(--color-primary)' : 'var(--color-muted)'}"></i>
                      <span>${g.name}</span>
                    </div>
                    <span class="badge badge-outline text-xs">${g.count > 1 ? `${g.count}x servings` : (g.serving || '1x')}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  promptAddMealToPlan(day, slot) {
    const food = this.customFoodDb[Math.floor(Math.random() * this.customFoodDb.length)];
    nutritionService.addFoodToPlan(day, slot, food);
    nutritionService.generateGroceryListFromPlan();
    this.showToast(`Added ${food.name} to ${slot}!`);
    this.render();
  }

  removeFoodFromPlan(day, slot, instanceId) {
    nutritionService.removeFoodFromPlan(day, slot, instanceId);
    nutritionService.generateGroceryListFromPlan();
    this.render();
  }

  generateGroceries() {
    nutritionService.generateGroceryListFromPlan();
    this.showToast('Grocery list synchronized with your 7-day meal plan! 🛒');
    this.render();
  }

  toggleGrocery(name) {
    nutritionService.toggleGroceryItem(name);
    this.render();
  }

  addCustomGrocery(e) {
    e.preventDefault();
    const inp = e.target.elements['groceryItem'];
    if (inp?.value) {
      nutritionService.addCustomGroceryItem(inp.value);
      this.showToast(`Added ${inp.value} to grocery list!`);
      inp.value = '';
      this.render();
    }
  }

  clearCheckedGroceries() {
    nutritionService.clearCheckedGroceryItems();
    this.showToast('Cleared checked grocery items.');
    this.render();
  }

  // ─────────────────────────── KNOWLEDGE & MOTIVATION ─────────────────────────
  renderKnowledge() {
    return `
      <div class="view-container animate-fade-in">
        <div class="page-header">
          <div>
            <p class="eyebrow"><span class="eyebrow-dot"></span> Fitness Science</p>
            <h1 class="page-title">Knowledge & Protocol Matrix</h1>
          </div>
        </div>
        <div class="grid-3">
          ${knowledgeArticles.map(art => `
            <div class="article-card cursor-pointer" onclick="window.app.openArticle('${art.id}')">
              <div class="article-body">
                <span class="badge badge-primary">${art.readTime}</span>
                <h3 class="article-title">${art.title}</h3>
                <p class="article-sub">${art.subtitle}</p>
                <div class="article-footer">
                  <span class="text-muted text-xs">SCIENCE BACKED</span>
                  <span class="arrow-link text-xs">READ <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  openArticle(id) {
    this.activeArticleModal = knowledgeArticles.find(a => a.id === id);
    this.render();
  }
  closeArticle() {
    this.activeArticleModal = null;
    this.render();
  }

  renderMotivation() {
    const q = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    return `
      <div class="view-container animate-fade-in">
        <div class="page-header">
          <div>
            <p class="eyebrow"><span class="eyebrow-dot"></span> Unstoppable Mindset</p>
            <h1 class="page-title">Discipline & Drive Matrix</h1>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.app.render()"><i class="fa-solid fa-shuffle"></i> New Quote</button>
        </div>

        <div class="calc-card" style="text-align:center;padding:48px 24px">
          <i class="fa-solid fa-quote-left" style="font-size:2.5rem;color:var(--color-primary);margin-bottom:16px"></i>
          <blockquote style="font-family:var(--font-heading);font-size:clamp(1.8rem, 4vw, 2.6rem);color:var(--color-white);line-height:1.2;max-width:800px;margin:0 auto">
            "${q.quote}"
          </blockquote>
          <p style="color:var(--color-secondary);font-weight:700;margin-top:16px;letter-spacing:1px">— ${q.author}</p>
        </div>
      </div>
    `;
  }

  // ─────────────────────────── PROFILE ────────────────────────────────────────
  renderProfile() {
    const u = this.currentUser;
    const m = this.getMetrics();
    return `
      <div class="view-container animate-fade-in">
        <div class="page-header">
          <div>
            <p class="eyebrow"><span class="eyebrow-dot"></span> Athlete Profile</p>
            <h1 class="page-title">${u.name}</h1>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.app.logout()"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>
        </div>

        <div class="grid-2">
          <div class="calc-card">
            <h3 class="calc-card-title"><i class="fa-solid fa-user-pen"></i> Edit Profile</h3>
            <form onsubmit="window.app.updateProfile(event)" style="display:flex;flex-direction:column;gap:12px">
              <div class="input-group">
                <label class="input-label">Full Name</label>
                <input type="text" name="name" class="input-field" value="${u.name}" required />
              </div>
              <div class="reg-grid-2">
                <div class="input-group">
                  <label class="input-label">Weight (kg)</label>
                  <input type="number" name="weight" class="input-field" value="${u.weight}" required />
                </div>
                <div class="input-group">
                  <label class="input-label">Height (cm)</label>
                  <input type="number" name="height" class="input-field" value="${u.height}" required />
                </div>
              </div>
              <div class="reg-grid-2">
                <div class="input-group">
                  <label class="input-label">Age</label>
                  <input type="number" name="age" class="input-field" value="${u.age}" required />
                </div>
                <div class="input-group">
                  <label class="input-label">Fitness Goal</label>
                  <select name="goal" class="input-field">
                    <option value="cut" ${u.goal==='cut'?'selected':''}>Fat Loss (Cut)</option>
                    <option value="bulk" ${u.goal==='bulk'?'selected':''}>Lean Muscle Bulk</option>
                    <option value="recomp" ${u.goal==='recomp'?'selected':''}>Body Recomposition</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" style="margin-top:8px"><i class="fa-solid fa-floppy-disk"></i> Save Profile</button>
            </form>
          </div>

          <div class="calc-card">
            <h3 class="calc-card-title"><i class="fa-solid fa-trophy"></i> Athlete Stats</h3>
            <div class="calc-result-badge" style="margin-bottom:12px">
              <span class="text-muted text-xs">WORKOUT STREAK</span>
              <div class="calc-result-number">${u.streakDays || 1} <small style="font-size:1.1rem;color:var(--color-muted)">DAYS</small></div>
            </div>
            <div style="font-size:0.85rem;color:var(--color-muted);line-height:1.8">
              <div><strong>BMR:</strong> ${m?.bmr} kcal</div>
              <div><strong>TDEE:</strong> ${m?.tdee} kcal</div>
              <div><strong>Target Water:</strong> ${m?.waterGoal} ml/day</div>
              <div><strong>Target Protein:</strong> ${m?.macros.protein}g / day</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateProfile(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const updated = {
      ...this.currentUser,
      name:   fd.get('name')?.trim() || this.currentUser.name,
      weight: parseFloat(fd.get('weight')) || this.currentUser.weight,
      height: parseInt(fd.get('height')) || this.currentUser.height,
      age:    parseInt(fd.get('age')) || this.currentUser.age,
      goal:   fd.get('goal') || this.currentUser.goal
    };
    this.currentUser = updated;
    this.accounts = this.accounts.map(a => a.email === updated.email ? updated : a);
    this.ss('ff_current_user', updated);
    this.ss('ff_accounts', this.accounts);
    this.showToast('Profile updated!');
    this.render();
  }

  // ─────────────────────────── MODALS ─────────────────────────────────────────
  renderModals() {
    let html = '';
    if (this.activeExerciseModal) {
      const ex = this.activeExerciseModal;
      html += `
        <div class="modal-backdrop" onclick="if(event.target===this)window.app.closeExercise()">
          <div class="modal-content">
            <div class="modal-header">
              <div>
                <span class="badge badge-primary">${ex.difficulty}</span>
                <h2 class="modal-title">${ex.name}</h2>
                <p class="text-muted text-xs">${ex.equipment}</p>
              </div>
              <button class="modal-close-btn" onclick="window.app.closeExercise()"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <canvas id="exercise-canvas" class="exercise-canvas" width="560" height="180"></canvas>

            <div class="modal-section">
              <h4 class="modal-section-title"><i class="fa-solid fa-list-check"></i> Form Instructions</h4>
              <ol class="form-steps">
                ${ex.steps.map((s, i) => `<li><span class="step-num">${i + 1}</span>${s}</li>`).join('')}
              </ol>
            </div>

            <div class="modal-section">
              <h4 class="modal-section-title"><i class="fa-solid fa-plus-circle"></i> Log a Set</h4>
              <div class="log-set-form">
                <input type="number" id="set-weight" class="input-field" placeholder="Weight (kg)" min="0" />
                <input type="number" id="set-reps" class="input-field" placeholder="Reps" min="1" />
                <button class="btn btn-primary" onclick="window.app.logSet('${ex.id}')">
                  <i class="fa-solid fa-check"></i> Log Set
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeArticleModal) {
      const art = this.activeArticleModal;
      html += `
        <div class="modal-backdrop" onclick="if(event.target===this)window.app.closeArticle()">
          <div class="modal-content">
            <div class="modal-header">
              <div>
                <span class="badge badge-primary">${art.readTime}</span>
                <h2 class="modal-title">${art.title}</h2>
                <p class="text-muted text-xs">${art.subtitle}</p>
              </div>
              <button class="modal-close-btn" onclick="window.app.closeArticle()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="article-modal-content">${art.content}</div>
          </div>
        </div>
      `;
    }

    return html;
  }

  // ─────────────────────────── FOOTER ─────────────────────────────────────────
  renderFooter() {
    return `
      <footer class="footer-container">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="navbar-brand" style="margin-bottom:14px" onclick="window.app.go('home')">
                <div class="brand-icon"><i class="fa-solid fa-bolt"></i></div>
                <div class="brand-title">FORGE<span>&FUEL</span></div>
              </div>
              <p class="text-muted" style="font-size:0.82rem;line-height:1.7;max-width:300px">
                Science-backed fitness, circuit builder, and macro nutrition matrix.
              </p>
              <div class="status-badge" style="margin-top:16px">
                <span class="status-dot"></span> PWA READY · MATRIX v2.5
              </div>
            </div>
            <div>
              <h4 class="footer-col-title">Core Tools</h4>
              <ul class="footer-links">
                ${[
                  ['workouts','Workout Circuits'],
                  ['tracker','Macro & Water Tracker'],
                  ['calculators','BMI, BMR & TDEE'],
                  ['planner','Weekly Meal Planner'],
                  ['knowledge','Fitness Science']
                ].map(([r,l]) => `
                  <li class="footer-link-item"><button onclick="window.app.go('${r}')"><i class="fa-solid fa-chevron-right text-xs"></i> ${l}</button></li>
                `).join('')}
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <span>© 2026 FORGE & FUEL MATRIX. All rights reserved.</span>
            <button class="back-to-top-btn" onclick="window.scrollTo({top:0,behavior:'smooth'})">BACK TO TOP <i class="fa-solid fa-arrow-up"></i></button>
          </div>
        </div>
      </footer>
    `;
  }

  // ─────────────────────────── AUTH VIEW ──────────────────────────────────────
  renderAuth() {
    const isLogin = this.authMode === 'login';
    return `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-brand-side">
            <div class="brand-badge"><span class="badge-dot"></span> FORGE & FUEL MATRIX</div>
            <h1 class="brand-hero-title">DISCIPLINE OVER<br><span>MOTIVATION.</span></h1>
            <p class="brand-hero-sub">The all-in-one matrix for progressive overload, macro tracking, and unbreakable habits.</p>
          </div>

          <div class="auth-form-side">
            <div class="auth-form-header">
              <h2 class="auth-form-title">${isLogin ? 'Sign In to Matrix' : 'Create Account'}</h2>
              <p class="auth-form-sub">${isLogin ? 'Enter your credentials to continue' : 'Step 1 of 2 — Account Credentials'}</p>
            </div>

            ${this.authError ? `
              <div class="auth-error-banner" style="background:rgba(239,68,68,0.15);border:1px solid #ef4444;color:#ef4444;padding:10px 14px;border-radius:8px;font-size:0.85rem;margin-bottom:16px">
                <i class="fa-solid fa-circle-exclamation"></i> ${this.authError}
              </div>
            ` : ''}

            ${isLogin ? this.renderLoginForm() : (this.authStep === 1 ? this.renderRegisterForm1() : this.renderRegisterForm2())}
          </div>
        </div>
      </div>
    `;
  }

  renderLoginForm() {
    return `
      <form class="auth-form" onsubmit="window.app.handleLogin(event)">
        <div class="input-group">
          <label class="input-label"><i class="fa-solid fa-envelope"></i> Email Address</label>
          <input type="email" name="email" class="input-field" placeholder="you@example.com" required autocomplete="email" />
        </div>
        <div class="input-group">
          <label class="input-label"><i class="fa-solid fa-lock"></i> Password</label>
          <input type="password" name="password" class="input-field" placeholder="Enter password" required />
        </div>
        <button type="submit" class="btn btn-primary w-full" style="margin-top:8px">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In
        </button>
        <button type="button" class="btn btn-outline w-full" onclick="window.app.demoLogin()" style="margin-top:8px">
          <i class="fa-solid fa-bolt"></i> Try Demo Account
        </button>
      </form>
      <p class="auth-switch-text">New athlete? <button onclick="window.app.showAuth('register')">Create an account</button></p>
    `;
  }

  renderRegisterForm1() {
    return `
      <form class="auth-form" onsubmit="window.app.handleRegisterStep1(event)">
        <div class="input-group">
          <label class="input-label"><i class="fa-solid fa-user"></i> Full Name</label>
          <input type="text" name="name" class="input-field" placeholder="John Doe" required />
        </div>
        <div class="input-group">
          <label class="input-label"><i class="fa-solid fa-envelope"></i> Email Address</label>
          <input type="email" name="email" class="input-field" placeholder="you@example.com" required />
        </div>
        <div class="input-group">
          <label class="input-label"><i class="fa-solid fa-lock"></i> Password</label>
          <input type="password" name="password" class="input-field" placeholder="Min. 6 chars" required />
        </div>
        <div class="input-group">
          <label class="input-label"><i class="fa-solid fa-lock"></i> Confirm Password</label>
          <input type="password" name="confirm" class="input-field" placeholder="Confirm password" required />
        </div>
        <button type="submit" class="btn btn-primary w-full" style="margin-top:8px">
          Continue <i class="fa-solid fa-arrow-right"></i>
        </button>
      </form>
      <p class="auth-switch-text">Already have an account? <button onclick="window.app.showAuth('login')">Sign in</button></p>
    `;
  }

  renderRegisterForm2() {
    return `
      <form class="auth-form" onsubmit="window.app.handleRegisterStep2(event)">
        <div class="reg-grid-2">
          <div class="input-group">
            <label class="input-label">Age</label>
            <input type="number" name="age" class="input-field" value="25" />
          </div>
          <div class="input-group">
            <label class="input-label">Gender</label>
            <select name="gender" class="input-field">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div class="reg-grid-2">
          <div class="input-group">
            <label class="input-label">Height (cm)</label>
            <input type="number" name="height" class="input-field" value="175" />
          </div>
          <div class="input-group">
            <label class="input-label">Weight (kg)</label>
            <input type="number" name="weight" class="input-field" value="75" />
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Fitness Goal</label>
          <select name="goal" class="input-field">
            <option value="cut">Fat Loss Cut</option>
            <option value="maintenance">Maintenance</option>
            <option value="bulk">Lean Muscle Bulk</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary w-full" style="margin-top:8px">
          <i class="fa-solid fa-rocket"></i> Complete Registration
        </button>
      </form>
    `;
  }

  // ─────────────────────────── POST RENDER ─────────────────────────────────────
  postRender() {
    if (this.activeExerciseModal) {
      const canvas = document.getElementById('exercise-canvas');
      if (canvas) {
        if (this.canvasFrame) cancelAnimationFrame(this.canvasFrame);
        const type = this.activeExerciseModal.visualType;
        const tick = () => {
          this.canvasTick++;
          drawExerciseCanvas(canvas, type, this.canvasTick);
          this.canvasFrame = requestAnimationFrame(tick);
        };
        tick();
      }
    }
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => { new ForgeFuelApp(); });
