/**
 * Web Vitals reporting for performance monitoring
 * Only runs in production and when analytics is configured
 */

type MetricCallback = (metric: unknown) => void;

export function reportWebVitals(onPerfEntry?: MetricCallback) {
  if (onPerfEntry && import.meta.env.PROD) {
    import("web-vitals")
      .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(onPerfEntry);
        onINP(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
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
