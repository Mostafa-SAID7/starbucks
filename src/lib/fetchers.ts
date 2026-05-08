import { AppError, ErrorType } from "./errorUtils";
import type { MenuData, GenericPageData, NavigationConfig, MenuCategory, MenuSubcategory } from "@/types";
import { API_CONFIG } from "./constants";

/**
 * Simulated delay for development (mimics network latency)
 * Remove in production or when connecting to real APIs
 */
const simulateDelay = (ms: number = API_CONFIG.SIMULATED_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Menu Data Fetchers
 */
export const menuFetchers = {
  /**
   * Fetch all menu data (structural only)
   */
  async fetchMenuData(): Promise<MenuData> {
    await simulateDelay();

    const { menu } = await import("@/data");
    return menu as MenuData;
  },

  /**
   * Fetch specific menu category (structural only)
   */
  async fetchMenuCategory(
    categoryId: string,
  ): Promise<MenuData["categories"][0]> {
    await simulateDelay();

    const { menu } = await import("@/data");
    const menuData = menu as MenuData;

    const category = menuData.categories?.find((c) => c.id === categoryId);

    if (!category) {
      throw new AppError(
        `Category not found: ${categoryId}`,
        ErrorType.NOT_FOUND,
        404,
        "Not Found",
      );
    }

    return category;
  },

  /**
   * Fetch specific menu item (structural only)
   */
  async fetchMenuItem(
    categoryId: string,
    subcategoryId: string,
  ): Promise<{
    category: MenuCategory;
    subcategory: MenuSubcategory;
  }> {
    await simulateDelay();

    const { menu } = await import("@/data");
    const menuData = menu as MenuData;

    const category = menuData.categories?.find((c) => c.id === categoryId);
    const subcategory = category?.subcategories?.find(
      (s) => s.id === subcategoryId,
    );

    if (!category || !subcategory) {
      throw new AppError(
        `Item not found: ${categoryId}/${subcategoryId}`,
        ErrorType.NOT_FOUND,
        404,
        "Not Found",
      );
    }

    return { category, subcategory };
  },

  /**
   * Fetch specific menu item
   */
  async fetchMenuItemDetails(categoryId: string, itemId: string) {
    await simulateDelay();

    const category = await this.fetchMenuCategory(categoryId);

    for (const subcategory of category.subcategories || []) {
      const item = subcategory.items?.find((i) => i.id === itemId);
      if (item) {
        return { category, subcategory, item };
      }
    }

    throw new AppError(
      `Item not found: ${itemId}`,
      ErrorType.NOT_FOUND,
      404,
      "Not Found",
    );
  },
};

/**
 * Generic Page Data Fetchers
 */
export const pageFetchers = {
  /**
   * Fetch generic page data by slug
   */
  async fetchPageBySlug(slug: string): Promise<GenericPageData> {
    await simulateDelay();

    const pageMap: Record<string, () => Promise<unknown>> = {
      "about-us": () => import("@/data").then((m) => m.aboutUs),
      sustainability: () => import("@/data").then((m) => m.sustainability),
      "community-impact": () => import("@/data").then((m) => m.communityImpact),
      "new-era": () => import("@/data").then((m) => m.newEra),
      "our-coffees": () => import("@/data").then((m) => m.ourCoffees),
      "terms-of-use": () => import("@/data").then((m) => m.termsOfUse),
      "privacy-statement": () =>
        import("@/data").then((m) => m.privacyStatement),
      cookies: () => import("@/data").then((m) => m.cookies),
      delivery: () => import("@/data").then((m) => m.delivery),
      "middle-east": () => import("@/data").then((m) => m.middleEast),
    };

    const fetcher = pageMap[slug];
    if (!fetcher) {
      throw new AppError(
        `Page not found: ${slug}`,
        ErrorType.NOT_FOUND,
        404,
        "Not Found",
      );
    }

    const data = await fetcher();
    return data as GenericPageData;
  },
};

/**
 * Location Data Fetchers
 */
export const locationFetchers = {
  /**
   * Fetch all locations (cities with store counts)
   */
  async fetchLocations() {
    await simulateDelay();

    const { locations } = await import("@/data");
    return locations;
  },

  /**
   * Fetch locations by region
   */
  async fetchLocationsByRegion(region: string) {
    await simulateDelay();

    const locations = await this.fetchLocations();
    return locations.filter((loc) => loc.slug === region);
  },
};

/**
 * Contact Data Fetchers
 */
export const contactFetchers = {
  /**
   * Fetch contact information (structural data: email, phone, social URLs)
   * UI labels come from i18next locales/contact.json
   */
  async fetchContactInfo() {
    await simulateDelay();

    const { contactUs } = await import("@/data");
    return contactUs;
  },
};

/**
 * Featured Content Fetchers
 */
export const featuredFetchers = {
  /**
   * Fetch featured cards (bilingual content + image URLs)
   */
  async fetchFeaturedCards() {
    await simulateDelay();

    const { featuredCards } = await import("@/data");
    return featuredCards;
  },

  /**
   * Fetch hero section data
   */
  async fetchHero() {
    await simulateDelay();

    const { hero } = await import("@/data");
    return hero;
  },

  /**
   * Fetch statement section data
   */
  async fetchStatement() {
    await simulateDelay();

    const { statement } = await import("@/data");
    return statement;
  },
};

/**
 * Navigation Data Fetchers
 * Structural data only (hrefs, socials, countries).
 * All labels come from i18next: t('navigation.navbar.*'), t('navigation.footer.*')
 */
export const navigationFetchers = {
  /**
   * Fetch navigation structural data (link hrefs, socials, countries)
   */
  async fetchNavigation(): Promise<NavigationConfig> {
    await simulateDelay();

    const { navigation } = await import("@/data");
    return navigation as NavigationConfig;
  },
};
