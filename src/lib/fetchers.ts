import type { MenuData, GenericPageData } from "@/types";

/**
 * Type for the menu data structure that includes both languages
 */
type MenuDataWithLanguages = {
  ar: MenuData;
  en: MenuData;
};

/**
 * Custom error class for fetch errors
 */
export class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

/**
 * Simulated delay for development (mimics network latency)
 * Remove in production or when connecting to real APIs
 */
const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Menu Data Fetchers
 */
export const menuFetchers = {
  /**
   * Fetch all menu data
   * Currently returns static data, will be replaced with API call
   */
  async fetchMenuData(): Promise<MenuDataWithLanguages> {
    await simulateDelay();

    // Import static data (will be replaced with API call)
    const { menu } = await import("@/data");
    return menu as MenuDataWithLanguages;
  },

  /**
   * Fetch specific menu category
   */
  async fetchMenuCategory(
    categoryId: string,
  ): Promise<MenuData["categories"][0]> {
    await simulateDelay();

    const { menu } = await import("@/data");
    const menuData = menu as MenuDataWithLanguages;

    // Access the language-specific data
    const lang = document.documentElement.getAttribute("lang") || "ar";
    const langData = menuData[lang as keyof MenuDataWithLanguages];

    const category = langData?.categories?.find((c) => c.id === categoryId);

    if (!category) {
      throw new FetchError(
        `Category not found: ${categoryId}`,
        404,
        "Not Found",
      );
    }

    return category;
  },

  /**
   * Fetch specific menu item
   */
  async fetchMenuItem(categoryId: string, itemId: string) {
    await simulateDelay();

    const category = await this.fetchMenuCategory(categoryId);

    // Find item in subcategories
    for (const subcategory of category.subcategories || []) {
      const item = subcategory.items?.find((i) => i.id === itemId);
      if (item) {
        return { category, subcategory, item };
      }
    }

    throw new FetchError(`Item not found: ${itemId}`, 404, "Not Found");
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

    // Map slugs to data imports
    const pageMap: Record<string, () => Promise<unknown>> = {
      "about-us": () => import("@/data").then((m) => m.aboutUs),
      sustainability: () => import("@/data").then((m) => m.sustainability),
      "community-impact": () => import("@/data").then((m) => m.communityImpact),
      "new-era": () => import("@/data").then((m) => m.newEra),
      "our-coffees": () => import("@/data").then((m) => m.ourCoffees),
      "terms-of-use": () => import("@/data").then((m) => m.termsOfUse),
      "privacy-statement": () =>
        import("@/data").then((m) => m.privacyStatement),
      cookies: () => import("@/data").then((m) => m.cookies.pageData),
      delivery: () => import("@/data").then((m) => m.delivery),
      "middle-east": () => import("@/data").then((m) => m.middleEast),
    };

    const fetcher = pageMap[slug];
    if (!fetcher) {
      throw new FetchError(`Page not found: ${slug}`, 404, "Not Found");
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

    // Import cities data from LocationsPage constants
    const cities = [
      {
        name: "Alexandria",
        nameAr: "الإسكندرية",
        count: 7,
        slug: "alexandria",
      },
      { name: "Cairo", nameAr: "القاهرة", count: 62, slug: "cairo" },
      { name: "Giza", nameAr: "الجيزة", count: 5, slug: "giza" },
      {
        name: "North Coast",
        nameAr: "الساحل الشمالي",
        count: 1,
        slug: "north-coast",
      },
    ];

    return cities;
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
   * Fetch contact information
   */
  async fetchContactInfo(): Promise<unknown> {
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
   * Fetch featured cards
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
 */
export const navigationFetchers = {
  /**
   * Fetch navbar data
   */
  async fetchNavbar() {
    await simulateDelay();

    const { navbar } = await import("@/data");
    return navbar;
  },

  /**
   * Fetch footer data
   */
  async fetchFooter() {
    await simulateDelay();

    const { footer } = await import("@/data");
    return footer;
  },
};
