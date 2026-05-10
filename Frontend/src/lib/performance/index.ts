/**
 * Performance Monitoring Utilities
 */

export * from "./Monitor";
export * from "./hooks";
export * from "./utils";
export * from "./vitals";
export * from "./resources";
export * from "./events";
export * from "./bundleOptimization";

// Initialize development-only performance logging
if (import.meta.env.DEV) {
  const { performanceMonitor } = await import("./Monitor");
  
  const performanceLoggingInterval = setInterval(() => {
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

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      clearInterval(performanceLoggingInterval);
    });
  }
}
