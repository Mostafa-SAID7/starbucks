import { QueryClient } from "@tanstack/react-query";
import { initializeCacheManager, setupAutoCleanup } from "./cacheInvalidation";

/**
 * Global QueryClient configuration
 * Optimized for production use with intelligent caching and retry logic
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache Configuration
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection (formerly cacheTime)

      // Retry Configuration
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

      // Refetch Configuration
      refetchOnWindowFocus: false, // Don't refetch on window focus (static data)
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: false, // Don't refetch on component mount if data is fresh

      // Error Handling
      throwOnError: false, // Don't throw errors, handle them in components
    },
    mutations: {
      retry: 1, // Retry mutations once
      throwOnError: false,
    },
  },
});

// Initialize cache invalidation manager
initializeCacheManager(queryClient);

// Setup automatic cleanup in production
if (import.meta.env.PROD) {
  setupAutoCleanup(queryClient, {
    cleanupInterval: 5 * 60 * 1000, // 5 minutes
    staleAge: 10 * 60 * 1000, // 10 minutes
    unusedAge: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Type-safe query client instance
 * Use this instead of creating new QueryClient instances
 */
export type AppQueryClient = typeof queryClient;
