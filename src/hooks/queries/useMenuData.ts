import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { menuFetchers } from "@/lib/fetchers";
import type { MenuData } from "@/types";
import { CACHE_TIMES } from "@/lib/constants";

/**
 * Hook to fetch all menu data (structural)
 *
 * Cache Strategy:
 * - Stale Time: 1 hour (menu data changes infrequently)
 * - GC Time: 2 hours
 *
 * @returns Query result with menu data
 */
export function useMenuData(): UseQueryResult<MenuData, Error> {
  return useQuery({
    queryKey: queryKeys.menu.all(),
    queryFn: () => menuFetchers.fetchMenuData(),
    staleTime: CACHE_TIMES.MENU_STALE,
    gcTime: CACHE_TIMES.MENU_GC,
  });
}

/**
 * Hook to fetch specific menu category
 *
 * @param categoryId - Category ID from URL params
 * @returns Query result with category data
 *
 * @example
 * ```tsx
 * function MenuCategoryPage() {
 *   const { categoryId } = useParams();
 *   const { data, isLoading, error } = useMenuCategory(categoryId!);
 *
 *   // ... render logic
 * }
 * ```
 */
export function useMenuCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.menu.byCategory(categoryId),
    queryFn: () => menuFetchers.fetchMenuCategory(categoryId),
    staleTime: CACHE_TIMES.MENU_STALE,
    gcTime: CACHE_TIMES.MENU_GC,
    enabled: !!categoryId, // Only fetch if categoryId is provided
  });
}

/**
 * Hook to fetch specific menu item
 *
 * @param categoryId - Category ID from URL params
 * @param itemId - Item ID from URL params
 * @returns Query result with item data
 */
export function useMenuItem(categoryId: string, itemId: string) {
  return useQuery({
    queryKey: queryKeys.menu.byItem(categoryId, itemId),
    queryFn: () => menuFetchers.fetchMenuItem(categoryId, itemId),
    staleTime: CACHE_TIMES.MENU_STALE,
    gcTime: CACHE_TIMES.MENU_GC,
    enabled: !!categoryId && !!itemId,
  });
}
