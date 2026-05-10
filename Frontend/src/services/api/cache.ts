/**
 * API Cache utility
 * Handles caching of API responses
 */

interface CacheEntry {
  data: unknown;
  timestamp: number;
  duration: number;
}

export class ApiCache {
  private cache: Map<string, CacheEntry> = new Map();

  /**
   * Get cached data
   */
  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.duration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache data
   */
  set(key: string, data: unknown, duration: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration,
    });
  }

  /**
   * Clear specific cache entry
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.duration;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}
