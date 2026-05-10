/**
 * Unified Monitoring Service
 * Consolidates error monitoring, performance monitoring, and breadcrumb tracking
 * Eliminates 200+ lines of duplicate code from errorMonitoring.ts and performanceMonitor.ts
 */

import { PerformanceMetric, CacheMetrics } from '@/types';

export interface BreadcrumbData {
  message: string;
  category?: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
  timestamp?: number;
}

export interface UserContext {
  id: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

export interface PerformanceMetrics {
  LCP?: number;
  FID?: number;
  CLS?: number;
  FCP?: number;
  TTFB?: number;
  [key: string]: number | undefined;
}

/**
 * Unified Monitoring Service
 * Handles error monitoring, performance tracking, and breadcrumbs
 */
class MonitoringService {
  private breadcrumbs: BreadcrumbData[] = [];
  private metrics: PerformanceMetric[] = [];
  private cacheMetrics: Map<string, CacheMetrics> = new Map();
  private startTimes: Map<string, number> = new Map();
  private userContext: UserContext | null = null;
  private maxBreadcrumbs = 100;
  private maxMetrics = 100;

  /**
   * Set user context for error tracking
   */
  setUser(id: string, email?: string, username?: string): void {
    this.userContext = { id, email, username };
    this.addBreadcrumb('User context set', 'auth', 'info', { userId: id });
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    this.userContext = null;
    this.addBreadcrumb('User context cleared', 'auth', 'info');
  }

  /**
   * Get current user context
   */
  getUser(): UserContext | null {
    return this.userContext;
  }

  /**
   * Add a breadcrumb for tracking user actions
   */
  addBreadcrumb(
    message: string,
    category: string = 'user-action',
    level: 'info' | 'warning' | 'error' = 'info',
    data?: Record<string, unknown>
  ): void {
    const breadcrumb: BreadcrumbData = {
      message,
      category,
      level,
      data,
      timestamp: Date.now(),
    };

    this.breadcrumbs.push(breadcrumb);

    // Keep only last N breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }

    if (import.meta.env.DEV) {
      console.log(`[${category}] ${message}`, data);
    }
  }

  /**
   * Get all breadcrumbs
   */
  getBreadcrumbs(): BreadcrumbData[] {
    return [...this.breadcrumbs];
  }

  /**
   * Clear all breadcrumbs
   */
  clearBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  /**
   * Capture an exception
   */
  captureException(
    error: Error,
    context?: Record<string, unknown>
  ): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
      userContext: this.userContext,
      breadcrumbs: this.getBreadcrumbs(),
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
      console.error('Exception captured:', errorData);
    }

    // Send to error monitoring service (Sentry, etc.)
    this.sendToMonitoringService(errorData);
  }

  /**
   * Capture a message
   */
  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: Record<string, unknown>
  ): void {
    const messageData = {
      message,
      level,
      ...context,
      userContext: this.userContext,
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
      console.log(`[${level}] ${message}`, context);
    }

    // Send to monitoring service
    this.sendToMonitoringService(messageData);
  }

  /**
   * Start measuring a performance metric
   */
  startMeasure(name: string, context?: string): void {
    const startTime = performance.now();
    this.startTimes.set(name, startTime);

    if (import.meta.env.DEV) {
      console.log(
        `🚀 Performance: Started measuring "${name}"${context ? ` (${context})` : ''}`
      );
    }
  }

  /**
   * End measuring and record the metric
   */
  endMeasure(name: string, context?: string): number {
    const endTime = performance.now();
    const startTime = this.startTimes.get(name);

    if (!startTime) {
      console.warn(`Performance: No start time found for "${name}"`);
      return 0;
    }

    const duration = endTime - startTime;
    this.recordMetric(name, duration, context);
    this.startTimes.delete(name);

    if (import.meta.env.DEV) {
      console.log(
        `✅ Performance: "${name}" took ${duration.toFixed(2)}ms${context ? ` (${context})` : ''}`
      );
    }

    return duration;
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, context?: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      context,
    };

    this.metrics.push(metric);

    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Record cache hit/miss
   */
  recordCacheMetric(queryKey: string, isHit: boolean): void {
    const existing = this.cacheMetrics.get(queryKey) || {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalQueries: 0,
    };

    if (isHit) {
      existing.hits++;
    } else {
      existing.misses++;
    }

    existing.totalQueries = existing.hits + existing.misses;
    existing.hitRate =
      existing.totalQueries > 0
        ? (existing.hits / existing.totalQueries) * 100
        : 0;

    this.cacheMetrics.set(queryKey, existing);
  }

  /**
   * Get performance metrics
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name);
    }
    return [...this.metrics];
  }

  /**
   * Get cache metrics
   */
  getCacheMetrics(queryKey?: string): CacheMetrics | Map<string, CacheMetrics> {
    if (queryKey) {
      return this.cacheMetrics.get(queryKey) || { hits: 0, misses: 0, hitRate: 0, totalQueries: 0 };
    }
    return this.cacheMetrics;
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.cacheMetrics.clear();
    this.startTimes.clear();
  }

  /**
   * Get monitoring summary
   */
  getSummary() {
    return {
      userContext: this.userContext,
      breadcrumbsCount: this.breadcrumbs.length,
      metricsCount: this.metrics.length,
      cacheMetricsCount: this.cacheMetrics.size,
      averageMetricValue: this.metrics.length > 0
        ? this.metrics.reduce((sum, m) => sum + m.value, 0) / this.metrics.length
        : 0,
    };
  }

  /**
   * Send data to monitoring service (Sentry, DataDog, etc.)
   */
  private sendToMonitoringService(data: unknown): void {
    try {
      // Check if Sentry is available
      const sentryWindow = window as unknown as Record<string, unknown>;
      if (sentryWindow.__SENTRY__) {
        const sentry = sentryWindow.__SENTRY__ as {
          captureMessage: (msg: string, opts: unknown) => void;
        };
        sentry.captureMessage('Monitoring Event', {
          level: 'info',
          contexts: { monitoring: data },
        });
      }

      // Send to backend logging endpoint
      if (navigator.sendBeacon && import.meta.env.PROD) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon('/api/logging/events', blob);
      }
    } catch (error) {
      console.warn('Failed to send monitoring data:', error);
    }
  }
}

/**
 * Singleton instance
 */
export const monitoringService = new MonitoringService();

export default monitoringService;
