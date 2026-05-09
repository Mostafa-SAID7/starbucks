import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { queryKeys } from "@/lib/queryKeys";
import { menuFetchers, pageFetchers } from "@/lib/fetchers";
import { CACHE_TIMES } from "@/lib/constants";

/**
 * Custom hook for prefetching menu categories
 * Extracts prefetch logic from components for reusability and testability
 * 
 * @returns Function to prefetch a menu category
 * 
 * @example
 * ```tsx
 * const prefetchCategory = usePrefetchMenuCategory();
 * 
 * return (
 *   <div onMouseEnter={() => prefetchCategory(categoryId)}>
 *     {category.name}
 *   </div>
 * );
 * ```
 */
export function usePrefetchMenuCategory() {
  const queryClient = useQueryClient();

  return useCallback(
    (categoryId: string) => {
      if (!categoryId) return;

      queryClient.prefetchQuery({
        queryKey: queryKeys.menu.byCategory(categoryId),
        queryFn: () => menuFetchers.fetchMenuCategory(categoryId),
        staleTime: CACHE_TIMES.MENU_STALE,
      });
    },
    [queryClient]
  );
}

/**
 * Custom hook for prefetching menu items
 * 
 * @returns Function to prefetch a menu item
 */
export function usePrefetchMenuItem() {
  const queryClient = useQueryClient();

  return useCallback(
    (categoryId: string, itemId: string) => {
      if (!categoryId || !itemId) return;

      queryClient.prefetchQuery({
        queryKey: queryKeys.menu.byItem(categoryId, itemId),
        queryFn: () => menuFetchers.fetchMenuItem(categoryId, itemId),
        staleTime: CACHE_TIMES.MENU_STALE,
      });
    },
    [queryClient]
  );
}

/**
 * Custom hook for prefetching pages
 * Uses centralized page fetcher to avoid duplication
 * 
 * @returns Function to prefetch a page
 */
export function usePrefetchPage() {
  const queryClient = useQueryClient();

  return useCallback(
    (slug: string) => {
      if (!slug) return;

      queryClient.prefetchQuery({
        queryKey: queryKeys.pages.bySlug(slug),
        queryFn: () => pageFetchers.fetchPageBySlug(slug),
        staleTime: CACHE_TIMES.PAGE_STALE,
      });
    },
    [queryClient]
  );
}
