/**
 * API Service Module
 */

export { ApiService } from './ApiService';
export { DEFAULT_CONFIG } from './config';
export { ApiCache } from './cache';
export { ApiRetry } from './retry';
export { ApiInterceptors } from './interceptors';

import { ApiService } from './ApiService';
import { ApiConfig } from '@/types/services';

/**
 * Default API service instance
 */
export const apiService = new ApiService();

/**
 * Create a new API service instance with custom configuration
 */
export const createApiService = (config: Partial<ApiConfig>): ApiService => {
  return new ApiService(config);
};