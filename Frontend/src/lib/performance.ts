export { debounce, throttle } from "./utils";
import { performanceMonitor } from "./performanceMonitor";

/**
 * Web Vitals reporting for performance monitoring
 * Only runs in production and when analytics is configured
 */

import { BaseMetric, MetricCallback } from "@/types";

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
 * Preload a single resource
 */
export function preloadResource(href: string, as: "image" | "font" | "script" | "style", type?: string) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  if (as === "font") link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

/**
 * Preload critical resources for faster initial load
 */
export function preloadCriticalResources() {
  const resources: Array<{ href: string; as: "image" | "font"; type?: string }> = [
    { href: "/src/assets/fonts/cairo.woff2", as: "font", type: "font/woff2" },
  ];

  resources.forEach(({ href, as, type }) => preloadResource(href, as, type));
}


/**
 * Mark a custom performance event
 */
export function markPerformanceEvent(name: string) {
  performanceMonitor.startMeasure(name);
}

/**
 * End a custom performance event
 */
export function endPerformanceEvent(name: string) {
  performanceMonitor.endMeasure(name);
}
