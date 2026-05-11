/**
 * Admin Monitoring Hook
 * Manages system monitoring operations and state
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getSystemHealth,
  getErrorLogs,
  getAuditLogs,
  getPerformanceMetrics,
  getPerformanceMetricsSummary,
  getErrorLogDetails,
  getAuditLogDetails,
} from '@/services/monitoring';
import { usePagination } from '@/hooks/common/usePagination';
import {
  SystemHealthDto,
  ErrorLogDto,
  AuditLogDto,
  PerformanceMetricsDto,
  ErrorLogFilterDto,
  AuditLogFilterDto,
  SystemMetricsSummaryDto,
} from '@/types/admin/monitoring';

export interface UseMonitoringOptions {
  refetchInterval?: number;
  pageSize?: number;
}

export interface UseMonitoringReturn {
  // System health
  systemHealth: SystemHealthDto | null;
  isLoadingHealth: boolean;
  healthError: string | null;

  // Error logs
  errorLogs: ErrorLogDto[];
  errorLogsPagination: { pageNumber: number; pageSize: number; totalPages: number; totalCount: number };
  isLoadingErrorLogs: boolean;
  errorLogsError: string | null;
  goToErrorLogsPage: (pageNumber: number) => void;
  setErrorLogsPageSize: (pageSize: number) => void;
  loadErrorLogs: (filters?: ErrorLogFilterDto) => Promise<void>;

  // Audit logs
  auditLogs: AuditLogDto[];
  auditLogsPagination: { pageNumber: number; pageSize: number; totalPages: number; totalCount: number };
  isLoadingAuditLogs: boolean;
  auditLogsError: string | null;
  goToAuditLogsPage: (pageNumber: number) => void;
  setAuditLogsPageSize: (pageSize: number) => void;
  loadAuditLogs: (filters?: AuditLogFilterDto) => Promise<void>;

  // Performance metrics
  performanceMetrics: PerformanceMetricsDto[];
  isLoadingPerformanceMetrics: boolean;
  performanceMetricsError: string | null;
  loadPerformanceMetrics: (startDate: string, endDate: string) => Promise<void>;

  // Performance summary
  performanceSummary: SystemMetricsSummaryDto | null;
  isLoadingPerformanceSummary: boolean;
  performanceSummaryError: string | null;
  loadPerformanceSummary: (startDate: string, endDate: string) => Promise<void>;

  // Date range
  dateRange: { startDate: string; endDate: string };
  setDateRange: (startDate: string, endDate: string) => void;

  // Selected logs
  selectedErrorLog: ErrorLogDto | null;
  selectedAuditLog: AuditLogDto | null;
  selectErrorLog: (id: string) => Promise<void>;
  selectAuditLog: (id: string) => Promise<void>;
}

/**
 * Hook for managing admin monitoring
 */
export function useMonitoring(
  options: UseMonitoringOptions = {}
): UseMonitoringReturn {
  const { refetchInterval = 30000, pageSize = 20 } = options; // 30 seconds default

  const [dateRange, setDateRangeState] = useState(() => {
    const now = new Date();
    return {
      startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetricsDto[]>([]);
  const [performanceSummary, setPerformanceSummary] = useState<SystemMetricsSummaryDto | null>(
    null
  );
  const [selectedErrorLog, setSelectedErrorLog] = useState<ErrorLogDto | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogDto | null>(null);
  const [errorLogFilters, setErrorLogFilters] = useState<ErrorLogFilterDto | undefined>();
  const [auditLogFilters, setAuditLogFilters] = useState<AuditLogFilterDto | undefined>();

  // System health query
  const {
    data: systemHealth,
    isLoading: isLoadingHealth,
    error: healthError,
  } = useQuery({
    queryKey: ['admin-system-health'],
    queryFn: getSystemHealth,
    refetchInterval,
  });

  // Error logs pagination
  const {
    items: errorLogs,
    pagination: errorLogsPagination,
    isLoading: isLoadingErrorLogs,
    error: errorLogsError,
    goToPage: goToErrorLogsPage,
    setPageSize: setErrorLogsPageSize,
  } = usePagination(
    (pageNumber, pageSize) => getErrorLogs(pageNumber, pageSize, errorLogFilters),
    { initialPageSize: pageSize }
  );

  // Audit logs pagination
  const {
    items: auditLogs,
    pagination: auditLogsPagination,
    isLoading: isLoadingAuditLogs,
    error: auditLogsError,
    goToPage: goToAuditLogsPage,
    setPageSize: setAuditLogsPageSize,
  } = usePagination(
    (pageNumber, pageSize) => getAuditLogs(pageNumber, pageSize, auditLogFilters),
    { initialPageSize: pageSize }
  );

  // Load error logs with filters
  const loadErrorLogs = useCallback(async (filters?: ErrorLogFilterDto) => {
    setErrorLogFilters(filters);
    goToErrorLogsPage(1);
  }, [goToErrorLogsPage]);

  // Load audit logs with filters
  const loadAuditLogs = useCallback(async (filters?: AuditLogFilterDto) => {
    setAuditLogFilters(filters);
    goToAuditLogsPage(1);
  }, [goToAuditLogsPage]);

  // Load performance metrics
  const loadPerformanceMetrics = useCallback(async (startDate: string, endDate: string) => {
    try {
      const data = await getPerformanceMetrics(startDate, endDate);
      setPerformanceMetrics(data);
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
    }
  }, []);

  // Load performance summary
  const loadPerformanceSummary = useCallback(async (startDate: string, endDate: string) => {
    try {
      const data = await getPerformanceMetricsSummary(startDate, endDate);
      setPerformanceSummary(data);
    } catch (error) {
      console.error('Failed to load performance summary:', error);
    }
  }, []);

  // Get error log details
  const selectErrorLog = useCallback(async (id: string) => {
    try {
      const log = await getErrorLogDetails(id);
      setSelectedErrorLog(log);
    } catch (error) {
      console.error('Failed to load error log details:', error);
    }
  }, []);

  // Get audit log details
  const selectAuditLog = useCallback(async (id: string) => {
    try {
      const log = await getAuditLogDetails(id);
      setSelectedAuditLog(log);
    } catch (error) {
      console.error('Failed to load audit log details:', error);
    }
  }, []);

  const setDateRange = useCallback((startDate: string, endDate: string) => {
    setDateRangeState({ startDate, endDate });
  }, []);

  return {
    systemHealth: systemHealth || null,
    isLoadingHealth,
    healthError: healthError ? (healthError as Error).message : null,
    errorLogs,
    errorLogsPagination,
    isLoadingErrorLogs,
    errorLogsError,
    goToErrorLogsPage,
    setErrorLogsPageSize,
    loadErrorLogs,
    auditLogs,
    auditLogsPagination,
    isLoadingAuditLogs,
    auditLogsError,
    goToAuditLogsPage,
    setAuditLogsPageSize,
    loadAuditLogs,
    performanceMetrics,
    isLoadingPerformanceMetrics: false,
    performanceMetricsError: null,
    loadPerformanceMetrics,
    performanceSummary,
    isLoadingPerformanceSummary: false,
    performanceSummaryError: null,
    loadPerformanceSummary,
    dateRange,
    setDateRange,
    selectedErrorLog,
    selectedAuditLog,
    selectErrorLog,
    selectAuditLog,
  };
}
