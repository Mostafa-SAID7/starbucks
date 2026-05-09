import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface PerformanceMetrics {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
}

/**
 * usePerformanceMonitoring Hook
 * 
 * Monitors Web Vitals and sends metrics to monitoring service
 * 
 * Targets:
 * - LCP: < 2.5s (Good)
 * - FID: < 100ms (Good)
 * - CLS: < 0.1 (Good)
 * - FCP: < 1.8s (Good)
 * - TTFB: < 600ms (Good)
 */
export const usePerformanceMonitoring = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const metrics: PerformanceMetrics = {};

    // Largest Contentful Paint
    onLCP((metric: Metric) => {
      metrics.LCP = metric.value;
      logMetric('LCP', metric.value, 2500);
    });

    // First Input Delay (deprecated in Web Vitals v5, using INP instead)
    // onFID is no longer available - use INP (Interaction to Next Paint) instead
    // For now, we'll skip FID tracking

    // Cumulative Layout Shift
    onCLS((metric: Metric) => {
      metrics.CLS = metric.value;
      logMetric('CLS', metric.value, 0.1);
    });

    // First Contentful Paint
    onFCP((metric: Metric) => {
      metrics.FCP = metric.value;
      logMetric('FCP', metric.value, 1800);
    });

    // Time to First Byte
    onTTFB((metric: Metric) => {
      metrics.TTFB = metric.value;
      logMetric('TTFB', metric.value, 600);
    });

    // Send metrics to monitoring service
    if (window.location.hostname !== 'localhost') {
      sendMetricsToMonitoring(metrics);
    }
  }, [enabled]);
};

/**
 * Log metric with threshold comparison
 */
function logMetric(name: string, value: number, threshold: number) {
  const status = value <= threshold ? '✓' : '⚠';
  const color = value <= threshold ? 'color: green' : 'color: orange';
  
  console.log(
    `%c${status} ${name}: ${value.toFixed(2)}ms (threshold: ${threshold}ms)`,
    color
  );
}

/**
 * Send metrics to monitoring service (Sentry, DataDog, etc.)
 */
function sendMetricsToMonitoring(metrics: PerformanceMetrics) {
  try {
    // Send to Sentry if available
    const sentryWindow = window as unknown as unknown as Record<string, unknown>;
    if (sentryWindow.__SENTRY__) {
      const sentry = sentryWindow.__SENTRY__ as { captureMessage: (msg: string, opts: unknown) => void };
      sentry.captureMessage('Web Vitals', {
        level: 'info',
        contexts: {
          performance: metrics,
        },
      });
    }

    // Send to custom analytics endpoint
    if (navigator.sendBeacon) {
      const data = new FormData();
      Object.entries(metrics).forEach(([key, value]) => {
        if (value !== undefined) {
          data.append(key, value.toString());
        }
      });
      navigator.sendBeacon('/api/metrics', data);
    }
  } catch (error) {
    console.warn('Failed to send metrics:', error);
  }
}

/**
 * Measure component render time
 */
export const measureComponentRender = (componentName: string) => {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 100) {
      console.warn(
        `%c⚠ Slow render: ${componentName} took ${duration.toFixed(2)}ms`,
        'color: orange'
      );
    }
  };
};

/**
 * Measure function execution time
 */
export const measureFunction = async <T>(
  fn: () => Promise<T> | T,
  functionName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    
    if (duration > 1000) {
      console.warn(
        `%c⚠ Slow function: ${functionName} took ${duration.toFixed(2)}ms`,
        'color: orange'
      );
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(
      `%c✗ Function error: ${functionName} failed after ${duration.toFixed(2)}ms`,
      'color: red'
    );
    throw error;
  }
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) return null;

  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,
  };
};

/**
 * Monitor long tasks
 */
export const monitorLongTasks = (threshold = 50) => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > threshold) {
            console.warn(
              `%c⚠ Long task detected: ${entry.name} (${entry.duration.toFixed(2)}ms)`,
              'color: orange'
            );
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
      return observer;
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }
  }
};

// Extend window interface for Sentry
declare global {
  interface Window {
    __SENTRY__?: { captureMessage: (msg: string, opts: unknown) => void };
  }
}
