/**
 * Initial Load Hook
 * Manages initial data loading with optimizations for real-world usage
 */

import { useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useErrorMonitoring } from './useErrorMonitoring';

export interface InitialLoadOptions {
  prefetchMenu?: boolean;
  prefetchLocations?: boolean;
  prefetchUser?: boolean;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

/**
 * Hook for managing initial app load with prefetching
 * Implements stale-while-revalidate pattern for better UX
 */
export function useInitialLoad(options: InitialLoadOptions = {}) {
  const {
    prefetchMenu = true,
    prefetchLocations = true,
    prefetchUser = true,
    onLoadComplete,
    onLoadError,
  } = options;

  const { addBreadcrumb } = useErrorMonitoring();
  const loadStartTimeRef = useRef<number>(Date.now());
  const hasNotifiedRef = useRef(false);

  // Prefetch menu data
  const menuQuery = useQuery({
    queryKey: queryKeys.menu.all(),
    enabled: prefetchMenu,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prefetch locations
  const locationsQuery = useQuery({
    queryKey: queryKeys.locations.all(),
    enabled: prefetchLocations,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Prefetch user profile if authenticated
  const userQuery = useQuery({
    queryKey: queryKeys.user.profile(),
    enabled: prefetchUser,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Track loading state
  const isLoading = menuQuery.isLoading || locationsQuery.isLoading;
  const isError = menuQuery.isError || locationsQuery.isError;
  const error = menuQuery.error || locationsQuery.error;

  // Notify on load complete
  useEffect(() => {
    if (!isLoading && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      const loadTime = Date.now() - loadStartTimeRef.current;

      addBreadcrumb(
        `Initial load completed in ${loadTime}ms`,
        'performance',
        'info',
        { loadTime }
      );

      if (isError && error) {
        onLoadError?.(error as Error);
      } else {
        onLoadComplete?.();
      }
    }
  }, [isLoading, isError, error, onLoadComplete, onLoadError, addBreadcrumb]);

  return {
    isLoading,
    isError,
    error,
    menuData: menuQuery.data,
    locationsData: locationsQuery.data,
    userData: userQuery.data,
  };
}

/**
 * Hook for managing data refresh with stale-while-revalidate pattern
 */
export function useStaleWhileRevalidate<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: {
    staleTime?: number;
    gcTime?: number;
    onRefresh?: (data: T) => void;
  }
) {
  const { staleTime = 5 * 60 * 1000, gcTime = 10 * 60 * 1000, onRefresh } = options || {};

  const query = useQuery({
    queryKey,
    queryFn,
    staleTime,
    gcTime,
  });

  // Automatically refetch when data becomes stale
  useEffect(() => {
    if (query.isStale && !query.isFetching) {
      query.refetch();
    }
  }, [query.isStale, query.isFetching, query]);

  // Notify on refresh
  useEffect(() => {
    if (!query.isFetching && query.data) {
      onRefresh?.(query.data);
    }
  }, [query.data, query.isFetching, onRefresh]);

  return query;
}

/**
 * Hook for managing optimistic updates
 */
export function useOptimisticUpdate<T>(
  onMutate: (newData: T) => void,
  onError: (error: Error, previousData: T) => void
) {
  const previousDataRef = useRef<T | null>(null);

  const handleMutate = useCallback((newData: T) => {
    previousDataRef.current = newData;
    onMutate(newData);
  }, [onMutate]);

  const handleError = useCallback((error: Error) => {
    if (previousDataRef.current) {
      onError(error, previousDataRef.current);
    }
  }, [onError]);

  return {
    handleMutate,
    handleError,
    previousData: previousDataRef.current,
  };
}

/**
 * Hook for managing retry logic with exponential backoff
 */
export function useRetryWithBackoff(
  fn: () => Promise<any>,
  options?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  }
) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    onRetry,
  } = options || {};

  const attemptsRef = useRef(0);

  const execute = useCallback(async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        attemptsRef.current = attempt;
        return await fn();
      } catch (error) {
        lastError = error as Error;
        onRetry?.(attempt + 1, lastError);

        if (attempt < maxRetries) {
          const delay = Math.min(
            initialDelay * Math.pow(2, attempt),
            maxDelay
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }, [fn, maxRetries, initialDelay, maxDelay, onRetry]);

  return {
    execute,
    attempts: attemptsRef.current,
  };
}
