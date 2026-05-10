import { PerformanceMetric, CacheMetrics, BundleMetrics } from "@/types";
import { errorMonitor } from "@/lib/error";
import { PERFORMANCE_CONFIG } from "@/lib/core/constants";

/**
 * Core performance monitoring class
 * Tracks metrics, cache hits, and reports anomalies
 */
export class PerformanceMonitor {
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
    
    // Add breadcrumb to error monitor for context in case of later crashes
    errorMonitor.addBreadcrumb(`Performance start: ${name}`, 'performance', 'info', { context });
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

    // Report to error monitor if duration exceeds threshold
    this.reportIfSlow(name, duration, context);

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

    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  /**
   * Report to monitoring service if the metric is suspiciously slow
   */
  private reportIfSlow(name: string, duration: number, context?: string): void {
    let isSlow = false;
    let threshold = 0;

    if (name === 'page-load' && duration > PERFORMANCE_CONFIG.SLOW_PAGE_LOAD) {
      isSlow = true;
      threshold = PERFORMANCE_CONFIG.SLOW_PAGE_LOAD;
    } else if (name === 'query-time' && duration > PERFORMANCE_CONFIG.SLOW_QUERY) {
      isSlow = true;
      threshold = PERFORMANCE_CONFIG.SLOW_QUERY;
    }

    if (isSlow) {
      errorMonitor.captureMessage(
        `Slow performance detected: ${name} took ${duration.toFixed(0)}ms (Threshold: ${threshold}ms)`,
        'warning',
        { duration, name, context }
      );
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
    
    // Periodically report low hit rates to monitoring
    if (existing.totalQueries >= 10 && existing.hitRate < PERFORMANCE_CONFIG.TARGET_CACHE_HIT_RATE) {
        errorMonitor.addBreadcrumb(
            `Low cache hit rate for ${queryKey}: ${existing.hitRate.toFixed(1)}%`,
            'performance',
            'warning'
        );
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name);
    }
    return [...this.metrics];
  }

  getCacheMetrics(): Map<string, CacheMetrics> {
    return new Map(this.cacheMetrics);
  }

  getOverallCacheHitRate(): number {
    let totalHits = 0;
    let totalQueries = 0;

    for (const metrics of this.cacheMetrics.values()) {
      totalHits += metrics.hits;
      totalQueries += metrics.totalQueries;
    }

    return totalQueries > 0 ? (totalHits / totalQueries) * 100 : 0;
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  async estimateBundleSize(): Promise<BundleMetrics> {
    const scripts = Array.from(document.querySelectorAll("script[src]"));
    const chunks: Array<{ name: string; size: number; gzipSize: number }> = [];
    let totalSize = 0;

    for (const script of scripts) {
      const src = (script as HTMLScriptElement).src;
      if (src && src.includes("/assets/")) {
        const name = src.split("/").pop() || "unknown";
        const estimatedSize = 100000;
        const estimatedGzipSize = estimatedSize * 0.3;

        chunks.push({ name, size: estimatedSize, gzipSize: estimatedGzipSize });
        totalSize += estimatedSize;
      }
    }

    return { totalSize, gzipSize: totalSize * 0.3, chunks };
  }

  generateReport() {
    return {
      metrics: this.getMetrics(),
      cacheMetrics: this.getCacheMetrics(),
      overallCacheHitRate: this.getOverallCacheHitRate(),
      averagePageLoad: this.getAverageMetric("page-load"),
      averageQueryTime: this.getAverageMetric("query-time"),
    };
  }

  clear(): void {
    this.metrics = [];
    this.cacheMetrics.clear();
    this.startTimes.clear();
  }

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

export const performanceMonitor = new PerformanceMonitor();
