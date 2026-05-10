import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { featuredFetchers } from "@/lib/api";
import { CACHE_TIMES } from "@/lib/core/constants";

/**
 * Hook to fetch featured cards
 *
 * Cache Strategy:
 * - Stale Time: 24 hours (static content)
 * - GC Time: 48 hours
 */
export function useFeaturedCards() {
  return useQuery({
    queryKey: queryKeys.featured.cards(),
    queryFn: featuredFetchers.fetchFeaturedCards,
    staleTime: CACHE_TIMES.FEATURED_STALE,
    gcTime: CACHE_TIMES.FEATURED_GC,
  });
}

/**
 * Hook to fetch hero section data
 */
export function useHero() {
  return useQuery({
    queryKey: queryKeys.featured.hero(),
    queryFn: featuredFetchers.fetchHero,
    staleTime: CACHE_TIMES.FEATURED_STALE,
    gcTime: CACHE_TIMES.FEATURED_GC,
  });
}

/**
 * Hook to fetch statement section data
 */
export function useStatement() {
  return useQuery({
    queryKey: queryKeys.featured.statement(),
    queryFn: featuredFetchers.fetchStatement,
    staleTime: CACHE_TIMES.FEATURED_STALE,
    gcTime: CACHE_TIMES.FEATURED_GC,
  });
}

