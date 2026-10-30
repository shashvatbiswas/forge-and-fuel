/**
 * Food API Service
 * Integrates with Open Food Facts public API with fast timeout and
 * seamless instant fallback to local curated food database.
 */

import { initialFoodDatabase } from '../data/foodData.js';

class FoodApiService {
  constructor() {
    this.cache = new Map();
    this.apiUrl = import.meta.env?.VITE_OPEN_FOOD_FACTS_API_URL || 'https://world.openfoodfacts.org/cgi/search.pl';
  }

  async searchFood(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Check in-memory cache
    if (this.cache.has(q)) {
      return this.cache.get(q);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

      const url = `${this.apiUrl}?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=10`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('API response not ok');
      const data = await res.json();

      if (data && Array.isArray(data.products) && data.products.length > 0) {
        const formatted = data.products
          .filter(p => p.product_name && p.nutriments)
          .map(p => {
            const n = p.nutriments;
            const cals = Math.round(n['energy-kcal_100g'] || (n['energy_100g'] ? n['energy_100g'] / 4.184 : 0)) || 0;
            const protein = Math.round((n.proteins_100g || 0) * 10) / 10;
            const carbs = Math.round((n.carbohydrates_100g || 0) * 10) / 10;
            const fat = Math.round((n.fat_100g || 0) * 10) / 10;
            const brand = p.brands ? ` (${p.brands})` : '';

            return {
              id: `off_${p.code || Math.random().toString(36).substr(2, 9)}`,
              name: `${p.product_name}${brand}`,
              category: 'meals',
              serving: p.serving_size || '100g',
              cals,
              p: protein,
              c: carbs,
              f: fat,
              source: 'Open Food Facts'
            };
          });

        if (formatted.length > 0) {
          this.cache.set(q, formatted);
          return formatted;
        }
      }
    } catch {
      // Offline, network error, or timeout — fall back to local database
    }

    // Fallback: search local database
    const localResults = initialFoodDatabase.filter(f =>
      f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    ).map(f => ({ ...f, source: 'Forge Fuel Core' }));

    this.cache.set(q, localResults);
    return localResults;
  }
}

export const foodApiService = new FoodApiService();
