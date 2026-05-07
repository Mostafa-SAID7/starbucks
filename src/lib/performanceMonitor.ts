/**
 * Performance Monitoring Utilities
 * Measures and tracks application performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: string;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalQueries: number;
}

interface BundleMetrics {
  totalSize: number;
  gzipSize: number;
  chunks: Array<{
    name: string;
    size: number;
    gzipSize: number;
  }>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private cacheMetrics: Map<string, CacheMetrics> = new Map();
  private startTimes: Map<string, number> = new Map();

  /**
   * Start measuring a performance metric
   */
  startMeasure(name: string, context?: string): void {
    const startTime = performance.now();
    this.startTimes.set(name, startTime);

    if (import.meta.env.DEV) {
      console.log(
        `🚀 Performance: Started measuring "${name}"${context ? ` (${context})` : ""}`,
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
        `✅ Performance: "${name}" took ${duration.toFixed(2)}ms${context ? ` (${context})` : ""}`,
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

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
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
  getCacheMetrics(): Map<string, CacheMetrics> {
    return new Map(this.cacheMetrics);
  }

  /**
   * Get overall cache hit rate
   */
  getOverallCacheHitRate(): number {
    let totalHits = 0;
    let totalQueries = 0;

    for (const metrics of this.cacheMetrics.values()) {
      totalHits += metrics.hits;
      totalQueries += metrics.totalQueries;
    }

    return totalQueries > 0 ? (totalHits / totalQueries) * 100 : 0;
  }

  /**
   * Get average metric value
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Get Web Vitals metrics
   */
  getWebVitals(): Promise<{
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  }> {
    return new Promise((resolve) => {
      const vitals: any = {};

      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName(
        "first-contentful-paint",
      )[0] as PerformanceEntry;
      if (fcpEntry) {
        vitals.fcp = fcpEntry.startTime;
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        vitals.ttfb =
          navigationEntry.responseStart - navigationEntry.requestStart;
      }

      // Use web-vitals library if available
      if (typeof window !== "undefined" && "webVitals" in window) {
        // This would require installing web-vitals package
        // For now, we'll return what we have
      }

      resolve(vitals);
    });
  }

  /**
   * Measure bundle size (client-side estimation)
   */
  async estimateBundleSize(): Promise<BundleMetrics> {
    const scripts = Array.from(document.querySelectorAll("script[src]"));

    const chunks: Array<{ name: string; size: number; gzipSize: number }> = [];
    let totalSize = 0;

    // This is a rough estimation - in production, you'd get this from build tools
    for (const script of scripts) {
      const src = (script as HTMLScriptElement).src;
      if (src && src.includes("/assets/")) {
        const name = src.split("/").pop() || "unknown";
        // Rough size estimation based on typical compression ratios
        const estimatedSize = 100000; // 100KB average
        const estimatedGzipSize = estimatedSize * 0.3; // ~30% compression

        chunks.push({
          name,
          size: estimatedSize,
          gzipSize: estimatedGzipSize,
        });

        totalSize += estimatedSize;
      }
    }

    return {
      totalSize,
      gzipSize: totalSize * 0.3,
      chunks,
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): {
    metrics: PerformanceMetric[];
    cacheMetrics: Map<string, CacheMetrics>;
    overallCacheHitRate: number;
    averagePageLoad: number;
    averageQueryTime: number;
    webVitals?: any;
  } {
    return {
      metrics: this.getMetrics(),
      cacheMetrics: this.getCacheMetrics(),
      overallCacheHitRate: this.getOverallCacheHitRate(),
      averagePageLoad: this.getAverageMetric("page-load"),
      averageQueryTime: this.getAverageMetric("query-time"),
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.cacheMetrics.clear();
    this.startTimes.clear();
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    const report = this.generateReport();
    return JSON.stringify(
      {
        ...report,
        cacheMetrics: Object.fromEntries(report.cacheMetrics),
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    );
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook to measure component render time
 */
export function useMeasureRender(componentName: string) {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    performanceMonitor.recordMetric(
      `render-${componentName}`,
      renderTime,
      "component",
    );
  };
}

/**
 * Decorator to measure function execution time
 */
export function measureExecution(name: string) {
  return function (
    _target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      performanceMonitor.startMeasure(`${name}-${propertyKey}`);
      try {
        const result = await originalMethod.apply(this, args);
        performanceMonitor.endMeasure(`${name}-${propertyKey}`);
        return result;
      } catch (error) {
        performanceMonitor.endMeasure(`${name}-${propertyKey}`);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Measure page load time
 */
export function measurePageLoad(pageName: string) {
  performanceMonitor.startMeasure("page-load", pageName);

  // Measure when page is fully loaded
  if (document.readyState === "complete") {
    performanceMonitor.endMeasure("page-load", pageName);
  } else {
    window.addEventListener("load", () => {
      performanceMonitor.endMeasure("page-load", pageName);
    });
  }
}

/**
 * Measure query execution time
 */
export function measureQuery(queryKey: string, isFromCache: boolean) {
  performanceMonitor.recordCacheMetric(queryKey, isFromCache);

  if (!isFromCache) {
    performanceMonitor.startMeasure("query-time", queryKey);

    return () => {
      performanceMonitor.endMeasure("query-time", queryKey);
    };
  }

  return () => {}; // No-op for cached queries
}

/**
 * Performance monitoring configuration
 */
export const PERFORMANCE_CONFIG = {
  // Thresholds for performance warnings
  SLOW_PAGE_LOAD: 3000, // 3 seconds
  SLOW_QUERY: 1000, // 1 second
  SLOW_RENDER: 16, // 16ms (60fps)

  // Cache performance targets
  TARGET_CACHE_HIT_RATE: 80, // 80%

  // Bundle size targets
  TARGET_BUNDLE_SIZE: 7 * 1024 * 1024, // 7MB
  TARGET_GZIP_SIZE: 2 * 1024 * 1024, // 2MB
};

/**
 * Check if performance meets targets
 */
export function checkPerformanceTargets(): {
  pageLoad: boolean;
  cacheHitRate: boolean;
  queryTime: boolean;
  overall: boolean;
} {
  const avgPageLoad = performanceMonitor.getAverageMetric("page-load");
  const avgQueryTime = performanceMonitor.getAverageMetric("query-time");
  const cacheHitRate = performanceMonitor.getOverallCacheHitRate();

  const results = {
    pageLoad: avgPageLoad < PERFORMANCE_CONFIG.SLOW_PAGE_LOAD,
    cacheHitRate: cacheHitRate >= PERFORMANCE_CONFIG.TARGET_CACHE_HIT_RATE,
    queryTime: avgQueryTime < PERFORMANCE_CONFIG.SLOW_QUERY,
    overall: false,
  };

  results.overall =
    results.pageLoad && results.cacheHitRate && results.queryTime;

  return results;
}

// Development-only performance logging
if (import.meta.env.DEV) {
  // Log performance summary every 30 seconds
  setInterval(() => {
    const report = performanceMonitor.generateReport();
    if (report.metrics.length > 0) {
      console.group("📊 Performance Summary");
      console.log(`Cache Hit Rate: ${report.overallCacheHitRate.toFixed(1)}%`);
      console.log(`Average Page Load: ${report.averagePageLoad.toFixed(1)}ms`);
      console.log(
        `Average Query Time: ${report.averageQueryTime.toFixed(1)}ms`,
      );
      console.log(`Total Metrics: ${report.metrics.length}`);
      console.groupEnd();
    }
  }, 30000);
}
