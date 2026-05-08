import type { QueryClient } from "@tanstack/react-query";

/**
 * Centralized Query Key Factory
 *
 * Provides type-safe, consistent query keys across the application.
 * Follows hierarchical structure for easy invalidation patterns.
 *
 * Pattern: [entity, ...identifiers, ...filters]
 *
 * Examples:
 * - queryKeys.menu.all() => ['menu']
 * - queryKeys.menu.byCategory('hot-drinks') => ['menu', 'categories', 'hot-drinks']
 * - queryKeys.pages.bySlug('about-us') => ['pages', 'about-us']
 */

export const queryKeys = {
  /**
   * Menu-related query keys
   */
  menu: {
    /** All menu data */
    all: () => ["menu"] as const,

    /** All menu categories */
    categories: () => ["menu", "categories"] as const,

    /** Specific menu category by ID */
    byCategory: (categoryId: string) =>
      ["menu", "categories", categoryId] as const,

    /** All items in a category */
    items: (categoryId: string) => ["menu", "items", categoryId] as const,

    /** Specific menu item */
    byItem: (categoryId: string, itemId: string) =>
      ["menu", "items", categoryId, itemId] as const,

    /** Allergy information */
    allergyInfo: () => ["menu", "allergy-info"] as const,
  },

  /**
   * Generic page-related query keys
   */
  pages: {
    /** All pages */
    all: () => ["pages"] as const,

    /** Specific page by slug */
    bySlug: (slug: string) => ["pages", slug] as const,
  },

  /**
   * Location-related query keys
   */
  locations: {
    /** All locations */
    all: () => ["locations"] as const,

    /** Locations filtered by region */
    byRegion: (region: string) => ["locations", region] as const,

    /** Locations filtered by governorate */
    byGovernorate: (governorate: string) =>
      ["locations", "governorate", governorate] as const,
  },

  /**
   * Contact information query keys
   */
  contact: {
    /** All contact information */
    all: () => ["contact"] as const,

    /** Contact info by type (phone, email, social) */
    byType: (type: string) => ["contact", type] as const,
  },

  /**
   * Featured content query keys
   */
  featured: {
    /** Featured cards for homepage */
    cards: () => ["featured", "cards"] as const,

    /** Hero section data */
    hero: () => ["featured", "hero"] as const,

    /** Statement section data */
    statement: () => ["featured", "statement"] as const,
  },

  /**
   * Navigation-related query keys
   */
  navigation: {
    /** Navigation config data */
    config: () => ["navigation", "config"] as const,
  },
} as const;

/**
 * Type helper to extract query key type
 */
export type QueryKey = ReturnType<
  (typeof queryKeys)[keyof typeof queryKeys][keyof (typeof queryKeys)[keyof typeof queryKeys]]
>;

/**
 * Utility function to invalidate all queries for an entity
 *
 * @example
 * // Invalidate all menu queries
 * invalidateEntity(queryClient, 'menu');
 *
 * // Invalidate all page queries
 * invalidateEntity(queryClient, 'pages');
 */
export function invalidateEntity(
  queryClient: QueryClient,
  entity: keyof typeof queryKeys,
): Promise<void> {
  const entityKeys = queryKeys[entity];

  // Get the base query key for the entity
  const baseKey = "all" in entityKeys ? entityKeys.all() : [entity];

  return queryClient.invalidateQueries({
    queryKey: baseKey,
  });
}
