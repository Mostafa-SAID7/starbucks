import {
  performanceMonitor,
  checkPerformanceTargets,
} from "@/lib/performanceMonitor";
import { checkBundleTargets } from "@/lib/bundleOptimization";
import { PERFORMANCE_CONFIG, BUNDLE_TARGETS } from "@/lib/constants";
import { useEffect, useState } from "react";

/**
 * Performance Dashboard Component
 * Development-only component for monitoring performance metrics
 */
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState(performanceMonitor.generateReport());
  const [performanceTargets, setPerformanceTargets] = useState(
    checkPerformanceTargets(),
  );
  const [bundleTargets, setBundleTargets] = useState(checkBundleTargets());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.generateReport());
      setPerformanceTargets(checkPerformanceTargets());
      setBundleTargets(checkBundleTargets());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 px-3 py-2 bg-starbucks-green text-white rounded-lg shadow-lg hover:bg-starbucks-dark transition-colors"
        title="Toggle Performance Dashboard"
      >
        📊 Perf
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="bg-card border border-border rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Performance Dashboard
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-foreground/60 hover:text-foreground/80 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            {/* Cache Metrics */}
            <div>
              <h4 className="font-medium text-foreground mb-2">
                Cache Performance
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Hit Rate:</span>
                  <span
                    className={`font-medium ${
                      metrics.overallCacheHitRate >=
                      PERFORMANCE_CONFIG.TARGET_CACHE_HIT_RATE
                        ? "text-starbucks-green"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metrics.overallCacheHitRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Target:</span>
                  <span className="text-foreground">
                    {PERFORMANCE_CONFIG.TARGET_CACHE_HIT_RATE}%
                  </span>
                </div>
              </div>
            </div>

            {/* Page Load Metrics */}
            <div>
              <h4 className="font-medium text-foreground mb-2">
                Page Load Performance
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Avg Load:</span>
                  <span
                    className={`font-medium ${
                      performanceTargets.pageLoad
                        ? "text-starbucks-green"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metrics.averagePageLoad.toFixed(0)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Target:</span>
                  <span className="text-foreground">
                    &lt;{PERFORMANCE_CONFIG.SLOW_PAGE_LOAD}ms
                  </span>
                </div>
              </div>
            </div>

            {/* Query Performance */}
            <div>
              <h4 className="font-medium text-foreground mb-2">
                Query Performance
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Avg Query:</span>
                  <span
                    className={`font-medium ${
                      performanceTargets.queryTime
                        ? "text-starbucks-green"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metrics.averageQueryTime.toFixed(0)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Target:</span>
                  <span className="text-foreground">
                    &lt;{PERFORMANCE_CONFIG.SLOW_QUERY}ms
                  </span>
                </div>
              </div>
            </div>

            {/* Bundle Size */}
            <div>
              <h4 className="font-medium text-foreground mb-2">Bundle Size</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Total:</span>
                  <span
                    className={`font-medium ${
                      bundleTargets.totalSize
                        ? "text-starbucks-green"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {bundleTargets.totalSize ? "✅" : "❌"}
                    {(BUNDLE_TARGETS.TOTAL_SIZE / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Gzip:</span>
                  <span
                    className={`font-medium ${
                      bundleTargets.gzipSize
                        ? "text-starbucks-green"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {bundleTargets.gzipSize ? "✅" : "❌"}
                    {(BUNDLE_TARGETS.GZIP_SIZE / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Status */}
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">
                  Overall Status:
                </span>
                <span
                  className={`font-bold ${
                    performanceTargets.overall && bundleTargets.overall
                      ? "text-starbucks-green"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {performanceTargets.overall && bundleTargets.overall
                    ? "✅ GOOD"
                    : "⚠️ NEEDS WORK"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => performanceMonitor.clear()}
                  className="px-2 py-1 text-xs bg-card border border-border text-foreground/70 rounded hover:bg-foreground/5 transition-colors"
                >
                  Clear Metrics
                </button>
                <button
                  onClick={() => {
                    const report = performanceMonitor.exportMetrics();
                    console.log("Performance Report:", report);
                  }}
                  className="px-2 py-1 text-xs bg-starbucks-green/10 border border-starbucks-green/20 text-starbucks-green rounded hover:bg-starbucks-green/20 transition-colors"
                >
                  Export Report
                </button>
              </div>
            </div>

            {/* Recent Metrics Count */}
            <div className="text-xs text-foreground/50 text-center">
              {metrics.metrics.length} metrics recorded
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceDashboard;
