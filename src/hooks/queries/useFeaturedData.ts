import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { featuredFetchers } from "@/lib/fetchers";

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
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
}

/**
 * Hook to fetch hero section data
 */
export function useHero() {
  return useQuery({
    queryKey: queryKeys.featured.hero(),
    queryFn: featuredFetchers.fetchHero,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
}

/**
 * Hook to fetch statement section data
 */
export function useStatement() {
  return useQuery({
    queryKey: queryKeys.featured.statement(),
    queryFn: featuredFetchers.fetchStatement,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
}
