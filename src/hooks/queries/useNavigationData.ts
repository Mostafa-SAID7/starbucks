import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { navigationFetchers } from "@/lib/fetchers";

/**
 * Hook to fetch navbar data
 *
 * Cache Strategy:
 * - Stale Time: 24 hours (static content)
 * - GC Time: 48 hours
 */
export function useNavbar() {
  return useQuery({
    queryKey: queryKeys.navigation.navbar(),
    queryFn: navigationFetchers.fetchNavbar,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
}

/**
 * Hook to fetch footer data
 */
export function useFooter() {
  return useQuery({
    queryKey: queryKeys.navigation.footer(),
    queryFn: navigationFetchers.fetchFooter,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
}
