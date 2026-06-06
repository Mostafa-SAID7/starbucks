import { simulateDelay } from "./client";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const featuredFetchers = {
  async fetchFeaturedCards(language: string = 'en') {
    try {
      // Try Backend Resources API first
      const response = await fetch(
        `${API_URL}/v1/resources/localization/${language}/common`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.resources.featured) {
          return data.resources.featured;
        }
      }
    } catch (err) {
      console.warn('Backend featured cards API not available', err);
    }

    // Fallback to local JSON
    await simulateDelay();
    const featuredCards = await import("@/data/home/featured-cards.json");
    return featuredCards.default;
  },

  async fetchHero(language: string = 'en') {
    try {
      // Try Backend Resources API first
      const response = await fetch(
        `${API_URL}/v1/resources/localization/${language}/common`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.resources.hero) {
          return data.resources.hero;
        }
      }
    } catch (err) {
      console.warn('Backend hero API not available', err);
    }

    await simulateDelay();
    const hero = await import("@/data/home/hero.json");
    return hero.default;
  },

  async fetchStatement(language: string = 'en') {
    try {
      // Try Backend Resources API first
      const response = await fetch(
        `${API_URL}/v1/resources/localization/${language}/common`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.resources.statement) {
          return data.resources.statement;
        }
      }
    } catch (err) {
      console.warn('Backend statement API not available', err);
    }

    await simulateDelay();
    const statement = await import("@/data/home/statement.json");
    return statement.default;
  },
};
