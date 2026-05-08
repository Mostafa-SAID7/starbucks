import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { CLEANUP_CONFIG } from "./constants";

/**
 * Cache Invalidation Manager
 * Handles intelligent cache invalidation with batch operations
 */
export class CacheInvalidationManager {
  constructor(private queryClient: QueryClient) {}

  /**
   * Invalidate menu-related queries
   * Smart invalidation based on what changed
   */
  async invalidateMenu(
    options: {
      categoryId?: string;
      itemId?: string;
      invalidateAll?: boolean;
    } = {},
  ) {
    const { categoryId, itemId, invalidateAll } = options;

    if (invalidateAll) {
      // Invalidate all menu queries
      await this.queryClient.invalidateQueries({
        queryKey: queryKeys.menu.all(),
        refetchType: "active",
      });
      return;
    }

    // Batch invalidation for specific updates
    const invalidationPromises: Promise<void>[] = [];

    if (itemId && categoryId) {
      // Item updated - invalidate item and its category
      invalidationPromises.push(
        this.queryClient.invalidateQueries({
          queryKey: queryKeys.menu.byItem(categoryId, itemId),
          exact: true,
        }),
      );
      invalidationPromises.push(
        this.queryClient.invalidateQueries({
          queryKey: queryKeys.menu.byCategory(categoryId),
          exact: true,
        }),
      );
    } else if (categoryId) {
      // Category updated - invalidate category and main menu
      invalidationPromises.push(
        this.queryClient.invalidateQueries({
          queryKey: queryKeys.menu.byCategory(categoryId),
          exact: true,
        }),
      );
      invalidationPromises.push(
        this.queryClient.invalidateQueries({
          queryKey: queryKeys.menu.all(),
          exact: true,
        }),
      );
    }

    await Promise.all(invalidationPromises);
  }

  /**
   * Invalidate page-related queries
   */
  async invalidatePage(slug?: string) {
    if (slug) {
      await this.queryClient.invalidateQueries({
        queryKey: queryKeys.pages.bySlug(slug),
        exact: true,
      });
    } else {
      await this.queryClient.invalidateQueries({
        queryKey: queryKeys.pages.all(),
        refetchType: "active",
      });
    }
  }

  /**
   * Invalidate location-related queries
   */
  async invalidateLocations(region?: string) {
    const invalidationPromises: Promise<void>[] = [];

    // Always invalidate main locations query
    invalidationPromises.push(
      this.queryClient.invalidateQueries({
        queryKey: queryKeys.locations.all(),
        exact: true,
      }),
    );

    if (region) {
      // Invalidate specific region
      invalidationPromises.push(
        this.queryClient.invalidateQueries({
          queryKey: queryKeys.locations.byRegion(region),
          exact: true,
        }),
      );
    }

    await Promise.all(invalidationPromises);
  }

  /**
   * Invalidate navigation queries
   * Usually triggered by admin updates
   */
  async invalidateNavigation() {
    await this.queryClient.invalidateQueries({
      queryKey: queryKeys.navigation.config(),
      exact: true,
    });
  }

  /**
   * Invalidate featured content
   * Usually triggered by marketing updates
   */
  async invalidateFeaturedContent() {
    await Promise.all([
      this.queryClient.invalidateQueries({
        queryKey: queryKeys.featured.cards(),
        exact: true,
      }),
      this.queryClient.invalidateQueries({
        queryKey: queryKeys.featured.hero(),
        exact: true,
      }),
      this.queryClient.invalidateQueries({
        queryKey: queryKeys.featured.statement(),
        exact: true,
      }),
    ]);
  }

  /**
   * Smart batch invalidation
   * Groups related invalidations to minimize refetches
   */
  async batchInvalidate(
    operations: Array<{
      type: "menu" | "page" | "locations" | "navigation" | "featured";
      options?: Record<string, unknown>;
    }>,
  ) {
    // Group operations by type to optimize batch processing
    const groupedOps = operations.reduce(
      (acc, op) => {
        if (!acc[op.type]) acc[op.type] = [];
        acc[op.type].push(op.options || {});
        return acc;
      },
      {} as Record<string, Record<string, unknown>[]>,
    );

    const invalidationPromises: Promise<void>[] = [];

    // Process each type of operation
    for (const [type, optionsArray] of Object.entries(groupedOps)) {
      switch (type) {
        case "menu": {
          // Merge menu options and invalidate once
          const menuOptions = optionsArray.reduce(
            (acc, opts) => ({
              ...acc,
              ...opts,
              invalidateAll: acc.invalidateAll || opts.invalidateAll,
            }),
            {} as Record<string, unknown>,
          );
          invalidationPromises.push(this.invalidateMenu(menuOptions));
          break;
        }

        case "page": {
          // Invalidate all unique page slugs
          const slugs = [
            ...new Set(
              optionsArray.map((opts) => opts.slug as string).filter(Boolean),
            ),
          ];
          if (slugs.length === 0) {
            invalidationPromises.push(this.invalidatePage());
          } else {
            slugs.forEach((slug) => {
              invalidationPromises.push(this.invalidatePage(slug));
            });
          }
          break;
        }

        case "locations": {
          const regions = [
            ...new Set(
              optionsArray.map((opts) => opts.region as string).filter(Boolean),
            ),
          ];
          if (regions.length === 0) {
            invalidationPromises.push(this.invalidateLocations());
          } else {
            regions.forEach((region) => {
              invalidationPromises.push(this.invalidateLocations(region));
            });
          }
          break;
        }

        case "navigation":
          invalidationPromises.push(this.invalidateNavigation());
          break;

        case "featured":
          invalidationPromises.push(this.invalidateFeaturedContent());
          break;
      }
    }

    await Promise.all(invalidationPromises);
  }

  /**
   * Selective invalidation based on data freshness
   * Only invalidates stale queries to avoid unnecessary refetches
   */
  async invalidateStaleQueries(maxAge: number = CLEANUP_CONFIG.STALE_AGE) {
    // Default from global config
    const queryCache = this.queryClient.getQueryCache();
    const queries = queryCache.getAll();
    const now = Date.now();

    const staleQueries = queries.filter((query) => {
      const lastFetch = query.state.dataUpdatedAt;
      return now - lastFetch > maxAge;
    });

    const invalidationPromises = staleQueries.map((query) =>
      this.queryClient.invalidateQueries({
        queryKey: query.queryKey,
        exact: true,
        refetchType: "active",
      }),
    );

    await Promise.all(invalidationPromises);
  }

  /**
   * Remove unused queries from cache
   * Helps manage memory usage
   */
  removeUnusedQueries(maxAge: number = CLEANUP_CONFIG.UNUSED_AGE) {
    // Default from global config
    const queryCache = this.queryClient.getQueryCache();
    const queries = queryCache.getAll();
    const now = Date.now();

    queries.forEach((query) => {
      const lastAccess = query.state.dataUpdatedAt;
      const hasObservers = query.getObserversCount() > 0;

      // Remove if old and no active observers
      if (!hasObservers && now - lastAccess > maxAge) {
        queryCache.remove(query);
      }
    });
  }

  /**
   * Prefetch related queries
   * Intelligently prefetches likely-to-be-needed queries
   */
  async prefetchRelated(currentQueryKey: unknown[]) {
    const keyString = JSON.stringify(currentQueryKey);

    // Menu-related prefetching
    if (keyString.includes("menu")) {
      if (keyString.includes("byCategory")) {
        // User viewing category - could prefetch popular items
        const categoryMatch = keyString.match(/"([^"]+)"/g);
        if (categoryMatch && categoryMatch[1]) {
          // Implementation depends on having popularity data
          // TODO: Implement analytics-based prefetching
        }
      } else if (keyString.includes("all")) {
        // User viewing main menu - could prefetch popular categories
        // TODO: Implement popular categories prefetching
      }
    }

    // Page-related prefetching
    if (keyString.includes("pages")) {
      // Could prefetch related pages based on navigation patterns
      // TODO: Implement navigation pattern analysis
    }
  }
}

/**
 * Global cache invalidation manager instance
 */
let cacheManager: CacheInvalidationManager | null = null;

export function initializeCacheManager(queryClient: QueryClient) {
  cacheManager = new CacheInvalidationManager(queryClient);
  return cacheManager;
}

export function getCacheManager(): CacheInvalidationManager {
  if (!cacheManager) {
    throw new Error(
      "Cache manager not initialized. Call initializeCacheManager first.",
    );
  }
  return cacheManager;
}

/**
 * Convenience functions for common invalidation patterns
 */
export const cacheInvalidation = {
  /**
   * Invalidate after menu update
   */
  menuUpdated: (categoryId?: string, itemId?: string) => {
    return getCacheManager().invalidateMenu({ categoryId, itemId });
  },

  /**
   * Invalidate after page content update
   */
  pageUpdated: (slug: string) => {
    return getCacheManager().invalidatePage(slug);
  },

  /**
   * Invalidate after location update
   */
  locationUpdated: (region?: string) => {
    return getCacheManager().invalidateLocations(region);
  },

  /**
   * Invalidate after navigation update
   */
  navigationUpdated: () => {
    return getCacheManager().invalidateNavigation();
  },

  /**
   * Invalidate after featured content update
   */
  featuredContentUpdated: () => {
    return getCacheManager().invalidateFeaturedContent();
  },

  /**
   * Batch multiple updates
   */
  batchUpdate: (
    operations: Array<{
      type: "menu" | "page" | "locations" | "navigation" | "featured";
      options?: Record<string, unknown>;
    }>,
  ) => {
    return getCacheManager().batchInvalidate(operations);
  },

  /**
   * Clean up stale queries
   */
  cleanupStale: (maxAge?: number) => {
    return getCacheManager().invalidateStaleQueries(maxAge);
  },

  /**
   * Remove unused queries
   */
  removeUnused: (maxAge?: number) => {
    return getCacheManager().removeUnusedQueries(maxAge);
  },
};

/**
 * Auto-cleanup configuration
 * Automatically removes unused queries and cleans up stale data
 */
export function setupAutoCleanup(
  _queryClient: QueryClient,
  options: {
    cleanupInterval?: number; // milliseconds
    staleAge?: number; // milliseconds
    unusedAge?: number; // milliseconds
  } = {},
) {
  const {
    cleanupInterval = CLEANUP_CONFIG.INTERVAL,
    unusedAge = CLEANUP_CONFIG.UNUSED_AGE,
  } = options;

  const manager = getCacheManager();

  // Set up periodic cleanup
  const cleanupTimer = setInterval(() => {
    // Remove unused queries
    manager.removeUnusedQueries(unusedAge);

    // Optionally invalidate very stale queries
    // manager.invalidateStaleQueries(staleAge);
  }, cleanupInterval);

  // Return cleanup function
  return () => {
    clearInterval(cleanupTimer);
  };
}
