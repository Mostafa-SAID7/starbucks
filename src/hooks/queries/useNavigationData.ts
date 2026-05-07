import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { navigationFetchers } from "@/lib/fetchers";

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
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
}
