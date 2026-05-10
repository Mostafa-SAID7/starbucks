import { simulateDelay } from "./client";

export const featuredFetchers = {
  async fetchFeaturedCards() {
    await simulateDelay();
    const featuredCards = await import("@/data/home/featured-cards.json");
    return featuredCards.default;
  },

  async fetchHero() {
    await simulateDelay();
    const hero = await import("@/data/home/hero.json");
    return hero.default;
  },

  async fetchStatement() {
    await simulateDelay();
    const statement = await import("@/data/home/statement.json");
    return statement.default;
  },
};
