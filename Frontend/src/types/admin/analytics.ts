/**
 * Admin Analytics Types
 */

export interface DashboardStatsDto {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalOrders: number;
  ordersThisMonth: number;
  averageOrderValue: number;
  totalLocations: number;
  totalMenuItems: number;
  userRetentionRate: number;
  conversionRate: number;
}

export interface SalesAnalyticsDto {
  date: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  uniqueCustomers: number;
}

export interface UserAnalyticsDto {
  date: string;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  retentionRate: number;
  churnRate: number;
}

export interface OrderAnalyticsDto {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
  completionRate: number;
}

export interface LocationPerformanceDto {
  locationId: string;
  locationName: string;
  city: string;
  revenue: number;
  orderCount: number;
  uniqueCustomers: number;
  averageRating: number;
  reviewCount: number;
}

export interface MenuItemPopularityDto {
  menuItemId: string;
  itemName: string;
  categoryName: string;
  orderCount: number;
  revenue: number;
  averageRating: number;
  reviewCount: number;
  popularityScore: number;
}

export interface ReportGenerationRequestDto {
  reportType: string;
  startDate: string;
  endDate: string;
  format?: string;
  filters?: Record<string, string>;
}

export interface ReportDataDto {
  reportType: string;
  generatedAt: string;
  startDate: string;
  endDate: string;
  summary?: Record<string, unknown>;
  data?: Array<Record<string, unknown>>;
}
