import { BaseMetric, MetricCallback } from "@/types";
import { performanceMonitor } from "./Monitor";

/**
 * Web Vitals reporting for performance monitoring
 * Only runs in production and when analytics is configured
 */
export function reportWebVitals(onPerfEntry?: MetricCallback) {
  if (onPerfEntry && import.meta.env.PROD) {
    import("web-vitals")
      .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        const createMetricHandler =
          (callback: MetricCallback) => (metric: unknown) => {
            const baseMetric = metric as BaseMetric;
            callback(baseMetric);
          };

        onCLS(createMetricHandler(onPerfEntry));
        onINP(createMetricHandler(onPerfEntry));
        onFCP(createMetricHandler(onPerfEntry));
        onLCP(createMetricHandler(onPerfEntry));
        onTTFB(createMetricHandler(onPerfEntry));

        onCLS((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric("CLS", baseMetric.value, "web-vitals");
        });
        onINP((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric("INP", baseMetric.value, "web-vitals");
        });
        onFCP((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric("FCP", baseMetric.value, "web-vitals");
        });
        onLCP((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric("LCP", baseMetric.value, "web-vitals");
        });
        onTTFB((metric: unknown) => {
          const baseMetric = metric as BaseMetric;
          performanceMonitor.recordMetric("TTFB", baseMetric.value, "web-vitals");
        });
      })
      .catch(() => {
        // web-vitals not available
      });
  }
}
