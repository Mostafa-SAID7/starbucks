/**
 * Admin Analytics Service
 * Handles all analytics API calls
 */

import { api } from '@/lib/api';
import {
  DashboardStatsDto,
  SalesAnalyticsDto,
  UserAnalyticsDto,
  OrderAnalyticsDto,
  LocationPerformanceDto,
  MenuItemPopularityDto,
} from '@/types/admin/analytics';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStatsDto> => {
  return api.get('/admin/analytics/dashboard');
};

/**
 * Get sales analytics for a date range
 */
export const getSalesAnalytics = async (
  startDate: string,
  endDate: string
): Promise<SalesAnalyticsDto[]> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);

  return api.get(`/admin/analytics/sales?${params.toString()}`);
};

/**
 * Get user analytics for a date range
 */
export const getUserAnalytics = async (
  startDate: string,
  endDate: string
): Promise<UserAnalyticsDto[]> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);

  return api.get(`/admin/analytics/users?${params.toString()}`);
};

/**
 * Get order analytics for a date range
 */
export const getOrderAnalytics = async (
  startDate: string,
  endDate: string
): Promise<OrderAnalyticsDto[]> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);

  return api.get(`/admin/analytics/orders?${params.toString()}`);
};

/**
 * Get location performance metrics
 */
export const getLocationPerformance = async (): Promise<LocationPerformanceDto[]> => {
  return api.get('/admin/analytics/locations');
};

/**
 * Get menu item popularity metrics
 */
export const getMenuItemPopularity = async (): Promise<MenuItemPopularityDto[]> => {
  return api.get('/admin/analytics/menu-items');
};

export const adminAnalyticsService = {
  getDashboardStats,
  getSalesAnalytics,
  getUserAnalytics,
  getOrderAnalytics,
  getLocationPerformance,
  getMenuItemPopularity,
};
