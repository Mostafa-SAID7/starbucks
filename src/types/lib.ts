export enum ErrorType {
  NETWORK = "network",
  TIMEOUT = "timeout",
  SERVER = "server",
  NOT_FOUND = "not_found",
  UNAUTHORIZED = "unauthorized",
  GENERAL = "general",
}

/**
 * Library-related types for performance, caching, and utilities
 */

/**
 * Performance Metric types
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: string;
}

export interface BaseMetric {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
  delta?: number;
  entries?: PerformanceEntry[];
  id?: string;
  navigationType?: string;
}

export type MetricCallback = (metric: BaseMetric) => void;

/**
 * Cache and Monitoring types
 */
export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalQueries: number;
}

export interface BundleMetrics {
  totalSize: number;
  gzipSize: number;
  chunks: Array<{
    name: string;
    size: number;
    gzipSize: number;
  }>;
}

/**
 * Cache Invalidation types
 */
export interface InvalidationOptions {
  refetchType?: "active" | "inactive" | "all";
  exact?: boolean;
  predicate?: (query: unknown) => boolean;
}
