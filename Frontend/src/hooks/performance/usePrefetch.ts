import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';

/**
 * usePrefetch Hook
 * 
 * Prefetches data for likely next routes to improve perceived performance
 * Usage: Call on route hover or before navigation
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  /**
   * Prefetch menu data
   * Called when hovering over menu link
   */
  const prefetchMenu = useCallback(async () => {
    try {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.menu.categories(),
        staleTime: 1000 * 60 * 30, // 30 minutes
      });
    } catch (error) {
      console.warn('Failed to prefetch menu:', error);
    }
  }, [queryClient]);

  /**
   * Prefetch locations data
   * Called when hovering over locations link
   */
  const prefetchLocations = useCallback(async () => {
    try {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.locations.list(),
        staleTime: 1000 * 60 * 30, // 30 minutes
      });
    } catch (error) {
      console.warn('Failed to prefetch locations:', error);
    }
  }, [queryClient]);

  /**
   * Prefetch user profile
   * Called when hovering over account link
   */
  const prefetchUserProfile = useCallback(async () => {
    try {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.user.profile(),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    } catch (error) {
      console.warn('Failed to prefetch user profile:', error);
    }
  }, [queryClient]);

  /**
   * Prefetch page data
   * Called when hovering over static page links
   */
  const prefetchPage = useCallback(
    async (slug: string) => {
      try {
        await queryClient.prefetchQuery({
          queryKey: queryKeys.pages.detail(slug),
          staleTime: 1000 * 60 * 60, // 1 hour for static pages
        });
      } catch (error) {
        console.warn(`Failed to prefetch page ${slug}:`, error);
      }
    },
    [queryClient]
  );

  /**
   * Prefetch specific menu category
   */
  const prefetchMenuCategory = useCallback(
    async (categoryId: string) => {
      try {
        await queryClient.prefetchQuery({
          queryKey: queryKeys.menu.category(categoryId),
          staleTime: 1000 * 60 * 30, // 30 minutes
        });
      } catch (error) {
        console.warn(`Failed to prefetch category ${categoryId}:`, error);
      }
    },
    [queryClient]
  );

  return {
    prefetchMenu,
    prefetchLocations,
    prefetchUserProfile,
    prefetchPage,
    prefetchMenuCategory,
  };
};
