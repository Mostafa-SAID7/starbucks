/**
 * Admin Analytics Hook
 * Manages analytics data fetching and state
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getSalesAnalytics,
  getUserAnalytics,
  getOrderAnalytics,
  getLocationPerformance,
  getMenuItemPopularity,
} from '@/services/admin/adminAnalyticsService';
import {
  DashboardStatsDto,
  SalesAnalyticsDto,
  UserAnalyticsDto,
  OrderAnalyticsDto,
  LocationPerformanceDto,
  MenuItemPopularityDto,
} from '@/types/admin/analytics';

export interface UseAdminAnalyticsOptions {
  refetchInterval?: number;
}

export interface UseAdminAnalyticsReturn {
  // Dashboard
  dashboardStats: DashboardStatsDto | null;
  isLoadingDashboard: boolean;
  dashboardError: string | null;

  // Sales analytics
  salesAnalytics: SalesAnalyticsDto[];
  isLoadingSalesAnalytics: boolean;
  salesAnalyticsError: string | null;
  loadSalesAnalytics: (startDate: string, endDate: string) => Promise<void>;

  // User analytics
  userAnalytics: UserAnalyticsDto[];
  isLoadingUserAnalytics: boolean;
  userAnalyticsError: string | null;
  loadUserAnalytics: (startDate: string, endDate: string) => Promise<void>;

  // Order analytics
  orderAnalytics: OrderAnalyticsDto[];
  isLoadingOrderAnalytics: boolean;
  orderAnalyticsError: string | null;
  loadOrderAnalytics: (startDate: string, endDate: string) => Promise<void>;

  // Location performance
  locationPerformance: LocationPerformanceDto[];
  isLoadingLocationPerformance: boolean;
  locationPerformanceError: string | null;
  loadLocationPerformance: () => Promise<void>;

  // Menu item popularity
  menuItemPopularity: MenuItemPopularityDto[];
  isLoadingMenuItemPopularity: boolean;
  menuItemPopularityError: string | null;
  loadMenuItemPopularity: () => Promise<void>;

  // Date range
  dateRange: { startDate: string; endDate: string };
  setDateRange: (startDate: string, endDate: string) => void;
}

/**
 * Hook for managing admin analytics
 */
export function useAdminAnalytics(
  options: UseAdminAnalyticsOptions = {}
): UseAdminAnalyticsReturn {
  const { refetchInterval = 60000 } = options; // 1 minute default

  const [dateRange, setDateRangeState] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalyticsDto[]>([]);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsDto[]>([]);
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalyticsDto[]>([]);
  const [locationPerformance, setLocationPerformance] = useState<LocationPerformanceDto[]>([]);
  const [menuItemPopularity, setMenuItemPopularity] = useState<MenuItemPopularityDto[]>([]);

  // Dashboard stats query
  const {
    data: dashboardStats,
    isLoading: isLoadingDashboard,
    error: dashboardError,
  } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval,
  });

  // Sales analytics
  const loadSalesAnalytics = useCallback(async (startDate: string, endDate: string) => {
    try {
      const data = await getSalesAnalytics(startDate, endDate);
      setSalesAnalytics(data);
    } catch (error) {
      console.error('Failed to load sales analytics:', error);
    }
  }, []);

  const {
    isLoading: isLoadingSalesAnalytics,
    error: salesAnalyticsError,
  } = useQuery({
    queryKey: ['admin-sales-analytics', dateRange.startDate, dateRange.endDate],
    queryFn: () => getSalesAnalytics(dateRange.startDate, dateRange.endDate),
    onSuccess: setSalesAnalytics,
  });

  // User analytics
  const loadUserAnalytics = useCallback(async (startDate: string, endDate: string) => {
    try {
      const data = await getUserAnalytics(startDate, endDate);
      setUserAnalytics(data);
    } catch (error) {
      console.error('Failed to load user analytics:', error);
    }
  }, []);

  const {
    isLoading: isLoadingUserAnalytics,
    error: userAnalyticsError,
  } = useQuery({
    queryKey: ['admin-user-analytics', dateRange.startDate, dateRange.endDate],
    queryFn: () => getUserAnalytics(dateRange.startDate, dateRange.endDate),
    onSuccess: setUserAnalytics,
  });

  // Order analytics
  const loadOrderAnalytics = useCallback(async (startDate: string, endDate: string) => {
    try {
      const data = await getOrderAnalytics(startDate, endDate);
      setOrderAnalytics(data);
    } catch (error) {
      console.error('Failed to load order analytics:', error);
    }
  }, []);

  const {
    isLoading: isLoadingOrderAnalytics,
    error: orderAnalyticsError,
  } = useQuery({
    queryKey: ['admin-order-analytics', dateRange.startDate, dateRange.endDate],
    queryFn: () => getOrderAnalytics(dateRange.startDate, dateRange.endDate),
    onSuccess: setOrderAnalytics,
  });

  // Location performance
  const loadLocationPerformance = useCallback(async () => {
    try {
      const data = await getLocationPerformance();
      setLocationPerformance(data);
    } catch (error) {
      console.error('Failed to load location performance:', error);
    }
  }, []);

  const {
    isLoading: isLoadingLocationPerformance,
    error: locationPerformanceError,
  } = useQuery({
    queryKey: ['admin-location-performance'],
    queryFn: getLocationPerformance,
    onSuccess: setLocationPerformance,
    refetchInterval,
  });

  // Menu item popularity
  const loadMenuItemPopularity = useCallback(async () => {
    try {
      const data = await getMenuItemPopularity();
      setMenuItemPopularity(data);
    } catch (error) {
      console.error('Failed to load menu item popularity:', error);
    }
  }, []);

  const {
    isLoading: isLoadingMenuItemPopularity,
    error: menuItemPopularityError,
  } = useQuery({
    queryKey: ['admin-menu-item-popularity'],
    queryFn: getMenuItemPopularity,
    onSuccess: setMenuItemPopularity,
    refetchInterval,
  });

  const setDateRange = useCallback((startDate: string, endDate: string) => {
    setDateRangeState({ startDate, endDate });
  }, []);

  return {
    dashboardStats: dashboardStats || null,
    isLoadingDashboard,
    dashboardError: dashboardError ? (dashboardError as Error).message : null,
    salesAnalytics,
    isLoadingSalesAnalytics,
    salesAnalyticsError: salesAnalyticsError ? (salesAnalyticsError as Error).message : null,
    loadSalesAnalytics,
    userAnalytics,
    isLoadingUserAnalytics,
    userAnalyticsError: userAnalyticsError ? (userAnalyticsError as Error).message : null,
    loadUserAnalytics,
    orderAnalytics,
    isLoadingOrderAnalytics,
    orderAnalyticsError: orderAnalyticsError ? (orderAnalyticsError as Error).message : null,
    loadOrderAnalytics,
    locationPerformance,
    isLoadingLocationPerformance,
    locationPerformanceError: locationPerformanceError
      ? (locationPerformanceError as Error).message
      : null,
    loadLocationPerformance,
    menuItemPopularity,
    isLoadingMenuItemPopularity,
    menuItemPopularityError: menuItemPopularityError
      ? (menuItemPopularityError as Error).message
      : null,
    loadMenuItemPopularity,
    dateRange,
    setDateRange,
  };
}
