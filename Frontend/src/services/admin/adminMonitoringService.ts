/**
 * Admin Monitoring Service
 * Handles all system monitoring API calls
 */

import { apiService } from '@/services/api';
import { PagedResult } from '@/types/common/pagination';
import {
  SystemHealthDto,
  ErrorLogDto,
  AuditLogDto,
  PerformanceMetricsDto,
  ErrorLogFilterDto,
  AuditLogFilterDto,
  SystemMetricsSummaryDto,
} from '@/types/admin/monitoring';

/**
 * Get system health status
 */
export const getSystemHealth = async (): Promise<SystemHealthDto> => {
  return apiService.get('/admin/monitoring/health');
};

/**
 * Get error logs with pagination and filtering
 */
export const getErrorLogs = async (
  pageNumber: number = 1,
  pageSize: number = 20,
  filters?: ErrorLogFilterDto
): Promise<PagedResult<ErrorLogDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  if (filters) {
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.statusCode) params.append('statusCode', filters.statusCode.toString());
  }

  return apiService.get(`/admin/monitoring/errors?${params.toString()}`);
};

/**
 * Get audit logs with pagination and filtering
 */
export const getAuditLogs = async (
  pageNumber: number = 1,
  pageSize: number = 20,
  filters?: AuditLogFilterDto
): Promise<PagedResult<AuditLogDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  if (filters) {
    if (filters.action) params.append('action', filters.action);
    if (filters.entityType) params.append('entityType', filters.entityType);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
  }

  return apiService.get(`/admin/monitoring/audit?${params.toString()}`);
};

/**
 * Get performance metrics for a date range
 */
export const getPerformanceMetrics = async (
  startDate: string,
  endDate: string
): Promise<PerformanceMetricsDto[]> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);

  return apiService.get(`/admin/monitoring/performance?${params.toString()}`);
};

/**
 * Get performance metrics summary
 */
export const getPerformanceMetricsSummary = async (
  startDate: string,
  endDate: string
): Promise<SystemMetricsSummaryDto> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);

  return apiService.get(`/admin/monitoring/performance/summary?${params.toString()}`);
};

/**
 * Get error log details
 */
export const getErrorLogDetails = async (id: string): Promise<ErrorLogDto> => {
  return apiService.get(`/admin/monitoring/errors/${id}`);
};

/**
 * Get audit log details
 */
export const getAuditLogDetails = async (id: string): Promise<AuditLogDto> => {
  return apiService.get(`/admin/monitoring/audit/${id}`);
};

export const adminMonitoringService = {
  getSystemHealth,
  getErrorLogs,
  getAuditLogs,
  getPerformanceMetrics,
  getPerformanceMetricsSummary,
  getErrorLogDetails,
  getAuditLogDetails,
};
