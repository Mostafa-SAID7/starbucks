/**
 * Admin Analytics Hook
 * Manages analytics data fetching and state
 * Simplified to use unified hooks and remove duplicate date range logic
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import {
  analyticsService,
} from '@/services/admin';

const {
  getDashboardStats,
  getSalesAnalytics,
  getUserAnalytics,
  getOrderAnalytics,
  getLocationPerformance,
  getMenuItemPopularity,
} = analyticsService;
import {
  DashboardStatsDto,
  SalesAnalyticsDto,
  UserAnalyticsDto,
  OrderAnalyticsDto,
  LocationPerformanceDto,
  MenuItemPopularityDto,
} from '@/types/admin/analytics';

export interface UseAnalyticsOptions {
  refetchInterval?: number;
}

/**
 * Hook for managing admin analytics
 */
export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { refetchInterval = 60000 } = options; // 1 minute default

  // Get default date range (last 30 days)
  const getDefaultDateRange = useCallback(() => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }, []);

  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  // Dashboard stats query
  const {
    data: dashboardStats,
    isLoading: isLoadingDashboard,
    error: dashboardError,
  } = useQuery({
    queryKey: queryKeys.admin.dashboardStats(),
    queryFn: getDashboardStats,
    refetchInterval,
  });

  // Sales analytics query
  const {
    data: salesAnalytics = [],
    isLoading: isLoadingSalesAnalytics,
    error: salesAnalyticsError,
  } = useQuery({
    queryKey: queryKeys.admin.salesAnalytics(dateRange.startDate, dateRange.endDate),
    queryFn: () => getSalesAnalytics(dateRange.startDate, dateRange.endDate),
  });

  // User analytics query
  const {
    data: userAnalytics = [],
    isLoading: isLoadingUserAnalytics,
    error: userAnalyticsError,
  } = useQuery({
    queryKey: queryKeys.admin.userAnalytics(dateRange.startDate, dateRange.endDate),
    queryFn: () => getUserAnalytics(dateRange.startDate, dateRange.endDate),
  });

  // Order analytics query
  const {
    data: orderAnalytics = [],
    isLoading: isLoadingOrderAnalytics,
    error: orderAnalyticsError,
  } = useQuery({
    queryKey: queryKeys.admin.orderAnalytics(dateRange.startDate, dateRange.endDate),
    queryFn: () => getOrderAnalytics(dateRange.startDate, dateRange.endDate),
  });

  // Location performance query
  const {
    data: locationPerformance = [],
    isLoading: isLoadingLocationPerformance,
    error: locationPerformanceError,
  } = useQuery({
    queryKey: queryKeys.admin.locationPerformance(),
    queryFn: getLocationPerformance,
    refetchInterval,
  });

  // Menu item popularity query
  const {
    data: menuItemPopularity = [],
    isLoading: isLoadingMenuItemPopularity,
    error: menuItemPopularityError,
  } = useQuery({
    queryKey: queryKeys.admin.menuItemPopularity(),
    queryFn: getMenuItemPopularity,
    refetchInterval,
  });

  // Update date range and refetch analytics
  const setDateRangeAndRefetch = useCallback((startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  }, []);

  return {
    // Dashboard
    dashboardStats,
    isLoadingDashboard,
    dashboardError: dashboardError?.message || null,

    // Sales analytics
    salesAnalytics,
    isLoadingSalesAnalytics,
    salesAnalyticsError: salesAnalyticsError?.message || null,

    // User analytics
    userAnalytics,
    isLoadingUserAnalytics,
    userAnalyticsError: userAnalyticsError?.message || null,

    // Order analytics
    orderAnalytics,
    isLoadingOrderAnalytics,
    orderAnalyticsError: orderAnalyticsError?.message || null,

    // Location performance
    locationPerformance,
    isLoadingLocationPerformance,
    locationPerformanceError: locationPerformanceError?.message || null,

    // Menu item popularity
    menuItemPopularity,
    isLoadingMenuItemPopularity,
    menuItemPopularityError: menuItemPopularityError?.message || null,

    // Date range
    dateRange,
    setDateRange: setDateRangeAndRefetch,
  };
}


