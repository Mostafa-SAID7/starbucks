/**
 * Health Check API Service
 * Handles API health check calls
 */

import { apiService } from './index';

export interface HealthResponse {
  status: string;
  timestamp: string;
}

/**
 * Check API health status
 */
export const check = async (): Promise<HealthResponse> => {
  return apiService.get<HealthResponse>('/health');
};

/**
 * Health service object
 */
export const healthService = {
  check,
};
