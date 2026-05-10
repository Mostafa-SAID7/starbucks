import { useEffect, useRef } from "react";

/**
 * Custom hook to track previous value
 * Useful for comparing current and previous values
 * 
 * @param value - The value to track
 * @returns The previous value
 * 
 * @example
 * ```tsx
 * const prevPathname = usePrevious(location.pathname);
 * 
 * useEffect(() => {
 *   if (prevPathname !== location.pathname) {
 *     // Route changed
 *   }
 * }, [location.pathname, prevPathname]);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
