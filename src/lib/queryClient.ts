import { QueryClient } from "@tanstack/react-query";
import { initializeCacheManager, setupAutoCleanup } from "./cacheInvalidation";
import { CACHE_TIMES, CLEANUP_CONFIG } from "./constants";

/**
 * Global QueryClient configuration
 * Optimized for production use with intelligent caching and retry logic
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache Configuration
      staleTime: CACHE_TIMES.DEFAULT_STALE,
      gcTime: CACHE_TIMES.DEFAULT_GC,

      // Retry Configuration
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

      // Refetch Configuration
      refetchOnWindowFocus: false, // Don't refetch on window focus (static data)
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: false, // Don't refetch on component mount if data is fresh

      // Error Handling
      throwOnError: true, // Throw errors to be caught by ErrorBoundaries
    },
    mutations: {
      retry: 1, // Retry mutations once
      throwOnError: true,
    },
  },
});

// Initialize cache invalidation manager
initializeCacheManager(queryClient);

// Setup automatic cleanup in production
if (import.meta.env.PROD) {
  setupAutoCleanup(queryClient, {
    cleanupInterval: CLEANUP_CONFIG.INTERVAL,
    staleAge: CLEANUP_CONFIG.STALE_AGE,
    unusedAge: CLEANUP_CONFIG.UNUSED_AGE,
  });
}

/**
 * Type-safe query client instance
 * Use this instead of creating new QueryClient instances
 */
export type AppQueryClient = typeof queryClient;
