import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';

/**
 * React Query Configuration
 * 
 * Caching Strategy:
 * - Static data (menu, locations): 30 minutes
 * - User data: 5 minutes
 * - Dynamic data: 1 minute
 * - Retry: 3 times with exponential backoff
 */

const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: how long data is considered fresh
    staleTime: 1000 * 60 * 5, // 5 minutes default
    
    // Cache time: how long unused data is kept in cache
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    
    // Retry configuration
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Refetch configuration
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  mutations: {
    retry: 1,
    retryDelay: 1000,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

/**
 * Export queryKeys for use throughout the app
 */
export { queryKeys };

/**
 * Cache invalidation helpers
 */
export const invalidateQueries = {
  menu: () => queryClient.invalidateQueries({ queryKey: queryKeys.menu.all() }),
  locations: () => queryClient.invalidateQueries({ queryKey: queryKeys.locations.all() }),
  user: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.all() }),
  pages: () => queryClient.invalidateQueries({ queryKey: queryKeys.pages.all() }),
  all: () => queryClient.invalidateQueries(),
};
