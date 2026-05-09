import { QueryClient, DefaultOptions } from '@tanstack/react-query';

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
 * Query Key Factory
 * Centralized query key management for consistency and refactoring
 */
export const queryKeys = {
  all: ['queries'] as const,
  
  // Menu queries
  menu: {
    all: [...queryKeys.all, 'menu'] as const,
    categories: () => [...queryKeys.menu.all, 'categories'] as const,
    category: (id: string) => [...queryKeys.menu.categories(), id] as const,
    items: () => [...queryKeys.menu.all, 'items'] as const,
    item: (id: string) => [...queryKeys.menu.items(), id] as const,
    search: (query: string) => [...queryKeys.menu.all, 'search', query] as const,
  },
  
  // Locations queries
  locations: {
    all: [...queryKeys.all, 'locations'] as const,
    list: () => [...queryKeys.locations.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.locations.all, 'detail', id] as const,
    byCity: (city: string) => [...queryKeys.locations.all, 'byCity', city] as const,
    nearby: (lat: number, lng: number) => [...queryKeys.locations.all, 'nearby', lat, lng] as const,
  },
  
  // User queries
  user: {
    all: [...queryKeys.all, 'user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
  },
  
  // Page data queries
  pages: {
    all: [...queryKeys.all, 'pages'] as const,
    detail: (slug: string) => [...queryKeys.pages.all, 'detail', slug] as const,
  },
  
  // Auth queries
  auth: {
    all: [...queryKeys.all, 'auth'] as const,
    status: () => [...queryKeys.auth.all, 'status'] as const,
  },
};

/**
 * Cache invalidation helpers
 */
export const invalidateQueries = {
  menu: () => queryClient.invalidateQueries({ queryKey: queryKeys.menu.all }),
  locations: () => queryClient.invalidateQueries({ queryKey: queryKeys.locations.all }),
  user: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
  pages: () => queryClient.invalidateQueries({ queryKey: queryKeys.pages.all }),
  all: () => queryClient.invalidateQueries(),
};
