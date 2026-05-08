import { AppError, ErrorType } from "./errorUtils";
import type { MenuData, GenericPageData, NavigationConfig, MenuCategory, MenuSubcategory } from "@/types";
import { API_CONFIG } from "./constants";

/**
 * Simulated delay for development (mimics network latency)
 * In a real production app, this would be 0 or handled by the server
 */
const simulateDelay = (ms: number = API_CONFIG.SIMULATED_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Menu Data Fetchers
 */
export const menuFetchers = {
  async fetchMenuData(): Promise<MenuData> {
    await simulateDelay();
    const menu = await import("@/data/menu/menu.json");
    return menu.default as MenuData;
  },

  async fetchMenuCategory(categoryId: string): Promise<MenuData["categories"][0]> {
    await simulateDelay();
    const menu = await import("@/data/menu/menu.json");
    const menuData = menu.default as MenuData;
    const category = menuData.categories?.find((c) => c.id === categoryId);

    if (!category) {
      throw new AppError(`Category not found: ${categoryId}`, ErrorType.NOT_FOUND, 404);
    }
    return category;
  },

  async fetchMenuItem(categoryId: string, subcategoryId: string): Promise<{ category: MenuCategory; subcategory: MenuSubcategory }> {
    await simulateDelay();
    const menu = await import("@/data/menu/menu.json");
    const menuData = menu.default as MenuData;
    const category = menuData.categories?.find((c) => c.id === categoryId);
    const subcategory = category?.subcategories?.find((s) => s.id === subcategoryId);

    if (!category || !subcategory) {
      throw new AppError(`Item not found: ${categoryId}/${subcategoryId}`, ErrorType.NOT_FOUND, 404);
    }
    return { category, subcategory };
  },

  async fetchMenuItemDetails(categoryId: string, itemId: string) {
    await simulateDelay();
    const category = await this.fetchMenuCategory(categoryId);
    for (const subcategory of category.subcategories || []) {
      const item = subcategory.items?.find((i) => i.id === itemId);
      if (item) return { category, subcategory, item };
    }
    throw new AppError(`Item not found: ${itemId}`, ErrorType.NOT_FOUND, 404);
  },
};

/**
 * Generic Page Data Fetchers
 */
export const pageFetchers = {
  async fetchPageBySlug(slug: string): Promise<GenericPageData> {
    await simulateDelay();

    const pageMap: Record<string, () => Promise<any>> = {
      "about-us": () => import("@/data/pages/about-us.json"),
      sustainability: () => import("@/data/pages/sustainability.json"),
      "community-impact": () => import("@/data/pages/community-impact.json"),
      "new-era": () => import("@/data/pages/new-era.json"),
      "our-coffees": () => import("@/data/pages/our-coffees.json"),
      "terms-of-use": () => import("@/data/pages/terms-of-use.json"),
      "privacy-statement": () => import("@/data/pages/privacy-statement.json"),
      cookies: () => import("@/data/pages/cookies.json"),
      delivery: () => import("@/data/pages/delivery.json"),
      "middle-east": () => import("@/data/pages/middle-east.json"),
    };

    const fetcher = pageMap[slug];
    if (!fetcher) {
      throw new AppError(`Page not found: ${slug}`, ErrorType.NOT_FOUND, 404);
    }

    const data = await fetcher();
    return data.default as GenericPageData;
  },
};

/**
 * Location Data Fetchers
 */
export const locationFetchers = {
  async fetchLocations() {
    await simulateDelay();
    const locations = await import("@/data/locations/locations.json");
    return locations.default;
  },

  async fetchLocationsByRegion(region: string) {
    const locations = await this.fetchLocations();
    return locations.filter((loc: any) => loc.slug === region);
  },
};

/**
 * Contact Data Fetchers
 */
export const contactFetchers = {
  async fetchContactInfo() {
    await simulateDelay();
    const contactUs = await import("@/data/contact/contact-us.json");
    return contactUs.default;
  },
};

/**
 * Featured Content Fetchers
 */
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

/**
 * Navigation Data Fetchers
 */
export const navigationFetchers = {
  async fetchNavigation(): Promise<NavigationConfig> {
    await simulateDelay();
    const navigation = await import("@/data/navigation/navigation.json");
    return navigation.default as unknown as NavigationConfig;
  },
};
