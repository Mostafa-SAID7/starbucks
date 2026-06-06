import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { locationFetchers } from "@/lib/api";
import { useLanguage } from "@/hooks";
import { CACHE_TIMES } from "@/lib/core/constants";

/**
 * Hook to fetch all locations for the current UI language.
 * 
 * Locations are resolved server-side based on the passed language parameter,
 * so location names and addresses are in the appropriate language.
 *
 * Cache Strategy:
 * - Stale Time: 30 minutes (semi-static)
 * - GC Time: 1 hour
 * - Query key includes language so separate caches per locale
 */
export function useLocations() {
  const { lang } = useLanguage();

  return useQuery({
    queryKey: [...queryKeys.locations.all(), lang],
    queryFn: () => locationFetchers.fetchLocations(lang),
    staleTime: CACHE_TIMES.LOCATION_STALE,
    gcTime: CACHE_TIMES.LOCATION_GC,
  });
}
