/**
 * API Service Types
 * HTTP client and request configuration types
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: unknown;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  timeout?: number;
}