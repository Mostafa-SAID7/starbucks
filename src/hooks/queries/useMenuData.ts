import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { menuFetchers } from "@/lib/fetchers";
import type { MenuData } from "@/types";

/**
 * Type for the menu data structure that includes both languages
 */
type MenuDataWithLanguages = {
  ar: MenuData;
  en: MenuData;
};

/**
 * Hook to fetch all menu data
 *
 * Cache Strategy:
 * - Stale Time: 1 hour (menu data changes infrequently)
 * - GC Time: 2 hours
 *
 * @returns Query result with menu data
 *
 * @example
 * ```tsx
 * function MenuPage() {
 *   const { data, isLoading, error, refetch } = useMenuData();
 *
 *   if (isLoading) return <MenuSkeleton />;
 *   if (error) return <ErrorState onRetry={refetch} />;
 *
 *   return <MenuContent data={data} />;
 * }
 * ```
 */
export function useMenuData(): UseQueryResult<MenuDataWithLanguages, Error> {
  return useQuery({
    queryKey: queryKeys.menu.all(),
    queryFn: menuFetchers.fetchMenuData,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
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
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
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
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: !!categoryId && !!itemId,
  });
}
