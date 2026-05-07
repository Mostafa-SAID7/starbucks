/**
 * Web Vitals reporting for performance monitoring
 * Only runs in production and when analytics is configured
 */

import { performanceMonitor } from "./performanceMonitor";

// Use a flexible metric type that can accommodate web-vitals structure
interface BaseMetric {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
  delta?: number;
  entries?: PerformanceEntry[];
  id?: string;
  navigationType?: string;
}

type MetricCallback = (metric: BaseMetric) => void;

export function reportWebVitals(onPerfEntry?: MetricCallback) {
  if (onPerfEntry && import.meta.env.PROD) {
    import("web-vitals")
      .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        // Create a wrapper function that converts web-vitals metrics to our base type
        const createMetricHandler =
          (callback: MetricCallback) => (metric: unknown) => {
            const baseMetric = metric as BaseMetric;
            callback(baseMetric);
          };

        // Report to external service
        onCLS(createMetricHandler(onPerfEntry));
        onINP(createMetricHandler(onPerfEntry));
        onFCP(createMetricHandler(onPerfEntry));
        onLCP(createMetricHandler(onPerfEntry));
        onTTFB(createMetricHandler(onPerfEntry));

        // Also record in our performance monitor
        onCLS((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric(
            "CLS",
            baseMetric.value,
            "web-vitals",
          );
        });
        onINP((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric(
            "INP",
            baseMetric.value,
            "web-vitals",
          );
        });
        onFCP((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric(
            "FCP",
            baseMetric.value,
            "web-vitals",
          );
        });
        onLCP((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric(
            "LCP",
            baseMetric.value,
            "web-vitals",
          );
        });
        onTTFB((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric(
            "TTFB",
            baseMetric.value,
            "web-vitals",
          );
        });
      })
      .catch(() => {
        // web-vitals not available, skip reporting
      });
  }
}

/**
 * Preload critical resources for faster initial load
 */
export function preloadCriticalResources() {
  const resources = [
    { href: "/src/assets/fonts/cairo.woff2", as: "font", type: "font/woff2" },
  ];

  resources.forEach(({ href, as, type }) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

/**
 * Debounce function for performance-sensitive operations
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
