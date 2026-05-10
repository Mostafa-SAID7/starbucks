import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { navigationFetchers } from "@/lib/api";
import { CACHE_TIMES } from "@/lib/core/constants";

/**
 * Hook to fetch navigation data (navbar and footer)
 *
 * Cache Strategy:
 * - Stale Time: 24 hours (static content)
 * - GC Time: 48 hours
 */
export function useNavigation() {
  return useQuery({
    queryKey: queryKeys.navigation.config(),
    queryFn: () => navigationFetchers.fetchNavigation(),
    staleTime: CACHE_TIMES.NAV_STALE,
    gcTime: CACHE_TIMES.NAV_GC,
  });
}

