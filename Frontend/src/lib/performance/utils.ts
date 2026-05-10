import { PERFORMANCE_CONFIG } from '@/lib/core/constants';
import { performanceMonitor } from "./Monitor";

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

    descriptor.value = async function (...args: unknown[]) {
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

  return () => {};
}

/**
 * Check if performance meets targets
 */
export function checkPerformanceTargets() {
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
