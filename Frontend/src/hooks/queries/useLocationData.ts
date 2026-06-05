import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { locationFetchers } from "@/lib/api";
import { CACHE_TIMES } from "@/lib/core/constants";

/**
 * Hook to fetch all locations
 *
 * Cache Strategy:
 * - Stale Time: 30 minutes (semi-static)
 * - GC Time: 1 hour
 */
export function useLocations() {
  return useQuery({
    queryKey: queryKeys.locations.all(),
    queryFn: locationFetchers.fetchLocations,
    staleTime: CACHE_TIMES.LOCATION_STALE,
    gcTime: CACHE_TIMES.LOCATION_GC,
  });
}
