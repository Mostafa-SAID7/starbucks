import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { pageFetchers } from "@/lib/fetchers";
import type { GenericPageData } from "@/types";

/**
 * Hook to fetch generic page data by slug
 *
 * Cache Strategy:
 * - Stale Time: 24 hours (static content changes rarely)
 * - GC Time: 48 hours
 *
 * @param slug - Page slug (e.g., 'about-us', 'sustainability')
 * @returns Query result with page data
 *
 * @example
 * ```tsx
 * function GenericPage({ slug }: { slug: string }) {
 *   const { data, isLoading, error } = usePageData(slug);
 *
 *   if (isLoading) return <StaticPageSkeleton />;
 *   if (error) return <ErrorState />;
 *
 *   return <PageContent data={data} />;
 * }
 * ```
 */
export function usePageData(
  slug: string,
): UseQueryResult<GenericPageData, Error> {
  return useQuery({
    queryKey: queryKeys.pages.bySlug(slug),
    queryFn: () => pageFetchers.fetchPageBySlug(slug),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    enabled: !!slug,
  });
}
