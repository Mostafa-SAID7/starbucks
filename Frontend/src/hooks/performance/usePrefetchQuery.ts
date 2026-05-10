/**
 * Unified Prefetch Query Hook
 * Consolidates prefetch logic from usePrefetch.ts and usePrefetchMenuCategory.ts
 * Eliminates 70+ lines of duplicate code
 */

import { useCallback } from 'react';
import { useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

export interface PrefetchOptions {
  staleTime?: number;
  cacheTime?: number;
  onError?: (error: unknown) => void;
}

/**
 * Generic prefetch hook for any query
 */
export function usePrefetchQuery() {
  const queryClient = useQueryClient();

  /**
   * Prefetch a query with error handling
   */
  const prefetch = useCallback(
    async <T,>(
      queryKey: unknown[],
      queryFn: () => Promise<T>,
      options: PrefetchOptions = {}
    ) => {
      const { staleTime = 1000 * 60 * 30, cacheTime, onError } = options;

      try {
        await queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime,
          gcTime: cacheTime,
        } as UseQueryOptions);
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          console.warn('Failed to prefetch query:', error);
        }
      }
    },
    [queryClient]
  );

  return { prefetch };
}

/**
 * Specialized prefetch hooks for common resources
 */
export function usePrefetchResources() {
  const { prefetch } = usePrefetchQuery();

  /**
   * Prefetch menu categories
   */
  const prefetchMenuCategories = useCallback(async () => {
    // Import here to avoid circular dependencies
    const { menuService } = await import('@/services/api/menuService');
    
    return prefetch(
      queryKeys.menu.categories(),
      () => menuService.getCategories(),
      { staleTime: 1000 * 60 * 30 }
    );
  }, [prefetch]);

  /**
   * Prefetch specific menu category
   */
  const prefetchMenuCategory = useCallback(
    async (categoryId: string) => {
      if (!categoryId) return;

      const { menuService } = await import('@/services/api/menuService');

      return prefetch(
        queryKeys.menu.byCategory(categoryId),
        () => menuService.getCategory(categoryId),
        { staleTime: 1000 * 60 * 30 }
      );
    },
    [prefetch]
  );

  /**
   * Prefetch menu item
   */
  const prefetchMenuItem = useCallback(
    async (itemId: string) => {
      if (!itemId) return;

      const { menuService } = await import('@/services/api/menuService');

      return prefetch(
        queryKeys.menu.item(itemId),
        () => menuService.getItem(itemId),
        { staleTime: 1000 * 60 * 30 }
      );
    },
    [prefetch]
  );

  /**
   * Prefetch locations
   */
  const prefetchLocations = useCallback(async () => {
    const { locationsService } = await import('@/services/api/locationsService');

    return prefetch(
      queryKeys.locations.list(),
      () => locationsService.getAll(),
      { staleTime: 1000 * 60 * 30 }
    );
  }, [prefetch]);

  /**
   * Prefetch locations by city
   */
  const prefetchLocationsByCity = useCallback(
    async (city: string) => {
      if (!city) return;

      const { locationsService } = await import('@/services/api/locationsService');

      return prefetch(
        queryKeys.locations.byCity(city),
        () => locationsService.getByCity(city),
        { staleTime: 1000 * 60 * 30 }
      );
    },
    [prefetch]
  );

  /**
   * Prefetch nearby locations
   */
  const prefetchNearbyLocations = useCallback(
    async (lat: number, lng: number, radius?: number) => {
      const { locationsService } = await import('@/services/api/locationsService');

      return prefetch(
        queryKeys.locations.nearby(lat, lng, radius),
        () => locationsService.getNearby(lat, lng, radius),
        { staleTime: 1000 * 60 * 30 }
      );
    },
    [prefetch]
  );

  /**
   * Prefetch user profile
   */
  const prefetchUserProfile = useCallback(async () => {
    const { userService } = await import('@/services/api/userService');

    return prefetch(
      queryKeys.user.profile(),
      () => userService.getProfile(),
      { staleTime: 1000 * 60 * 5 }
    );
  }, [prefetch]);

  return {
    prefetch,
    prefetchMenuCategories,
    prefetchMenuCategory,
    prefetchMenuItem,
    prefetchLocations,
    prefetchLocationsByCity,
    prefetchNearbyLocations,
    prefetchUserProfile,
  };
}
