import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { menuFetchers, pageFetchers, locationFetchers } from '@/lib/api';
import { CACHE_TIMES } from '@/lib/core/constants';

/**
 * Unified Prefetch Hook
 * Provides specialized methods for prefetching common resources to improve perceived performance.
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  /**
   * Prefetch a generic query
   */
  const prefetchQuery = useCallback(
    async (queryKey: readonly unknown[], queryFn: () => Promise<any>, staleTime = CACHE_TIMES.DEFAULT_STALE) => {
      try {
        await queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime,
        });
      } catch (error) {
        console.warn('Prefetch failed:', queryKey, error);
      }
    },
    [queryClient]
  );

  /**
   * Prefetch specific menu category
   */
  const prefetchMenuCategory = useCallback(
    (categoryId: string) => {
      if (!categoryId) return;
      prefetchQuery(
        queryKeys.menu.byCategory(categoryId),
        () => menuFetchers.fetchMenuCategory(categoryId),
        CACHE_TIMES.MENU_STALE
      );
    },
    [prefetchQuery]
  );

  /**
   * Prefetch specific menu item
   */
  const prefetchMenuItem = useCallback(
    (categoryId: string, itemId: string) => {
      if (!categoryId || !itemId) return;
      prefetchQuery(
        queryKeys.menu.byItem(categoryId, itemId),
        () => menuFetchers.fetchMenuItem(categoryId, itemId),
        CACHE_TIMES.MENU_STALE
      );
    },
    [prefetchQuery]
  );

  /**
   * Prefetch all locations
   */
  const prefetchLocations = useCallback(() => {
    prefetchQuery(
      queryKeys.locations.all(),
      locationFetchers.fetchLocations,
      CACHE_TIMES.LOCATION_STALE
    );
  }, [prefetchQuery]);

  /**
   * Prefetch a static page by slug
   */
  const prefetchPage = useCallback(
    (slug: string) => {
      if (!slug) return;
      prefetchQuery(
        queryKeys.pages.bySlug(slug),
        () => pageFetchers.fetchPageBySlug(slug),
        CACHE_TIMES.PAGE_STALE
      );
    },
    [prefetchQuery]
  );

  /**
   * Prefetch user profile
   */
  const prefetchUserProfile = useCallback(() => {
    prefetchQuery(
      queryKeys.user.profile(),
      async () => {
        // Placeholder for user profile fetcher if implemented later
        return null;
      },
      CACHE_TIMES.USER_STALE
    );
  }, [prefetchQuery]);

  return {
    prefetchQuery,
    prefetchMenuCategory,
    prefetchMenuItem,
    prefetchLocations,
    prefetchPage,
    prefetchUserProfile,
  };
}
