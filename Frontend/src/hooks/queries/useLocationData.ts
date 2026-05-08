import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { locationFetchers } from "@/lib/fetchers";
import { CACHE_TIMES } from "@/lib/constants";

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

/**
 * Hook to fetch locations by region
 */
export function useLocationsByRegion(region: string) {
  return useQuery({
    queryKey: queryKeys.locations.byRegion(region),
    queryFn: () => locationFetchers.fetchLocationsByRegion(region),
    staleTime: CACHE_TIMES.LOCATION_STALE,
    gcTime: CACHE_TIMES.LOCATION_GC,
    enabled: !!region,
  });
}
