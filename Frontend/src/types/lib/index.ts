export enum ErrorType {
  NETWORK = "network",
  TIMEOUT = "timeout",
  SERVER = "server",
  NOT_FOUND = "not_found",
  UNAUTHORIZED = "unauthorized",
  VALIDATION = "validation",
  GENERAL = "general",
}

/**
 * Library-related types for performance, caching, and utilities
 */

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
 * Cache Invalidation types
 */
export interface InvalidationOptions {
  refetchType?: "active" | "inactive" | "all";
  exact?: boolean;
  predicate?: (query: unknown) => boolean;
}
