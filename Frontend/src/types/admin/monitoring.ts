/**
 * Admin System Monitoring Types
 */

export interface SystemHealthDto {
  status: string;
  checkedAt: string;
  apiHealth?: ApiHealthDto;
  databaseHealth?: DatabaseHealthDto;
  cacheHealth?: CacheHealthDto;
  services?: ServiceHealthDto[];
}

export interface ApiHealthDto {
  status: string;
  averageResponseTime: number;
  errorRate: number;
  requestsPerSecond: number;
  lastChecked: string;
}

export interface DatabaseHealthDto {
  status: string;
  activeConnections: number;
  maxConnections: number;
  connectionPoolUsage: number;
  averageQueryTime: number;
  lastChecked: string;
}

export interface CacheHealthDto {
  status: string;
  hitRate: number;
  memoryUsage: number;
  maxMemory: number;
  keyCount: number;
  lastChecked: string;
}

export interface ServiceHealthDto {
  serviceName: string;
  status: string;
  message?: string;
  lastChecked: string;
}

export interface ErrorLogDto {
  id: string;
  message: string;
  stackTrace?: string;
  severity: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  statusCode?: number;
  requestPath?: string;
  httpMethod?: string;
}

export interface AuditLogDto {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: string;
  newValues?: string;
  timestamp: string;
  ipAddress?: string;
  notes?: string;
}

export interface PerformanceMetricsDto {
  timestamp: string;
  apiResponseTime: number;
  databaseQueryTime: number;
  cacheHitRate: number;
  errorRate: number;
  activeUsers: number;
  requestsPerSecond: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface ErrorLogFilterDto {
  severity?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  statusCode?: number;
}

export interface AuditLogFilterDto {
  action?: string;
  entityType?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface SystemMetricsSummaryDto {
  averageApiResponseTime: number;
  averageDatabaseQueryTime: number;
  averageCacheHitRate: number;
  averageErrorRate: number;
  peakActiveUsers: number;
  peakRequestsPerSecond: number;
  peakMemoryUsage: number;
  peakCpuUsage: number;
  startDate: string;
  endDate: string;
}
