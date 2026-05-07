import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { locationFetchers } from "@/lib/fetchers";

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
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch locations by region
 */
export function useLocationsByRegion(region: string) {
  return useQuery({
    queryKey: queryKeys.locations.byRegion(region),
    queryFn: () => locationFetchers.fetchLocationsByRegion(region),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: !!region,
  });
}
