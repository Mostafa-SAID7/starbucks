/**
 * Enterprise API Service Class
 * 
 * @deprecated Use the centralized API client from @/lib/api.ts instead
 * This class is kept for backward compatibility but should not be used for new code.
 * All API calls should go through the unified api client in lib/api.ts
 */

import axios, { AxiosInstance } from 'axios';
import { ServiceResponse, RequestConfig, ApiConfig } from '@/types/services';
import { DEFAULT_CONFIG } from './config';
import { ApiInterceptors } from './interceptors';
import { ApiCache } from './cache';
import { ApiRetry } from './retry';

export class ApiService {
  private client: AxiosInstance;
  private config: ApiConfig;
  private cache: ApiCache;
  private retry: ApiRetry;
  private interceptors: ApiInterceptors;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.client = this.createAxiosInstance();
    this.cache = new ApiCache();
    this.retry = new ApiRetry(this.client, this.config.retries);
    this.interceptors = new ApiInterceptors(this.client);
    this.interceptors.setup();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: this.config.headers,
    });
  }

  async request<T>(config: RequestConfig): Promise<ServiceResponse<T>> {
    try {
      // Check cache for GET requests
      if (config.method === 'GET') {
        const cached = this.cache.get(config.url);
        if (cached) {
          return {
            data: cached as T,
            success: true,
            message: 'Retrieved from cache',
          };
        }
      }

      const response = await this.client.request({
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
        headers: config.headers,
        timeout: config.timeout || this.config.timeout,
      });

      // Cache successful GET responses
      if (config.method === 'GET' && response.status === 200) {
        this.cache.set(config.url, response.data);
      }

      return {
        data: response.data,
        success: true,
        message: 'Request successful',
        metadata: {
          status: response.status,
          headers: response.headers,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async get<T>(url: string, params?: Record<string, string>): Promise<ServiceResponse<T>> {
    return this.request<T>({ method: 'GET', url, params });
  }

  async post<T>(url: string, data?: unknown): Promise<ServiceResponse<T>> {
    return this.request<T>({ method: 'POST', url, data });
  }

  async put<T>(url: string, data?: unknown): Promise<ServiceResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  async delete<T>(url: string): Promise<ServiceResponse<T>> {
    return this.request<T>({ method: 'DELETE', url });
  }

  async patch<T>(url: string, data?: unknown): Promise<ServiceResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data });
  }

  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ServiceResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async batch<T>(requests: RequestConfig[]): Promise<ServiceResponse<T[]>> {
    try {
      const promises = requests.map(config => this.request<T>(config));
      const results = await Promise.allSettled(promises);
      
      const data = results.map(result => 
        result.status === 'fulfilled' ? result.value.data : null
      ).filter(Boolean) as T[];

      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason.message);

      return {
        data,
        success: errors.length === 0,
        message: errors.length > 0 ? 'Some requests failed' : 'All requests successful',
        errors,
      };
    } catch (error) {
      throw error;
    }
  }

  async healthCheck(): Promise<ServiceResponse<{ status: string; timestamp: string }>> {
    return this.get('/health');
  }

  clearCache(): void {
    this.cache.clear();
  }

  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
    this.client.defaults.baseURL = this.config.baseUrl;
    this.client.defaults.timeout = this.config.timeout;
  }
}