import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { featuredFetchers } from "@/lib/api";
import { CACHE_TIMES } from "@/lib/core/constants";
import { useLanguage } from "@/hooks/i18n/useLanguage";

/**
 * Hook to fetch featured cards
 *
 * Cache Strategy:
 * - Stale Time: 24 hours (static content)
 * - GC Time: 48 hours
 */
export function useFeaturedCards() {
  const { lang } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.featured.cards(lang),
    queryFn: async () => {
      const language = lang === 'ar' ? 'ar' : 'en';
      return featuredFetchers.fetchFeaturedCards(language);
    },
    staleTime: CACHE_TIMES.FEATURED_STALE,
    gcTime: CACHE_TIMES.FEATURED_GC,
  });
}

/**
 * Hook to fetch hero section data
 */
export function useHero() {
  const { lang } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.featured.hero(lang),
    queryFn: async () => {
      const language = lang === 'ar' ? 'ar' : 'en';
      return featuredFetchers.fetchHero(language);
    },
    staleTime: CACHE_TIMES.FEATURED_STALE,
    gcTime: CACHE_TIMES.FEATURED_GC,
  });
}

/**
 * Hook to fetch statement section data
 */
export function useStatement() {
  const { lang } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.featured.statement(lang),
    queryFn: async () => {
      const language = lang === 'ar' ? 'ar' : 'en';
      return featuredFetchers.fetchStatement(language);
    },
    staleTime: CACHE_TIMES.FEATURED_STALE,
    gcTime: CACHE_TIMES.FEATURED_GC,
  });
}

