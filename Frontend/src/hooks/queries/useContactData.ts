import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { contactFetchers } from "@/lib/fetchers";
import { CACHE_TIMES } from "@/lib/constants";

/**
 * Hook to fetch contact information
 *
 * Cache Strategy:
 * - Stale Time: 24 hours (rarely changes)
 * - GC Time: 48 hours
 */
export function useContactInfo() {
  return useQuery({
    queryKey: queryKeys.contact.all(),
    queryFn: contactFetchers.fetchContactInfo,
    staleTime: CACHE_TIMES.PAGE_STALE,
    gcTime: CACHE_TIMES.PAGE_GC,
  });
}
