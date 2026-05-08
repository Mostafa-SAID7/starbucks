/**
 * Cache Service Types
 * Caching and storage related types
 */

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  strategy: 'LRU' | 'FIFO' | 'TTL';
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  ttl: number;
  createdAt: number;
  accessedAt: number;
}

export interface StorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
  remove(key: string): void;
  clear(): void;
  keys(): string[];
}