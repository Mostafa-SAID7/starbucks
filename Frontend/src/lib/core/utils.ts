/**
 * Core utility functions
 */
/**
 * Debounce function for performance-sensitive operations
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
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
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends object>(target: T, source: object): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const k = key as keyof T;
      if (isObject(source[key as keyof object])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key as keyof object] });
        } else {
          output[k] = deepMerge(target[k] as object, source[key as keyof object] as object) as T[keyof T];
        }
      } else {
        Object.assign(output, { [key]: source[key as keyof object] });
      }
    });
  }
  return output;
}

function isObject(item: unknown): item is object {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}
