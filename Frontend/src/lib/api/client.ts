import axios from 'axios';
import { API_CONFIG } from '@/lib/core/constants';
import { captureError, addBreadcrumb } from '@/lib/error/errorMonitoring';

/**
 * Standard API Client with interceptors for error monitoring
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add breadcrumb for outgoing requests
    addBreadcrumb(
      `API Request: ${config.method?.toUpperCase()} ${config.url}`,
      'http',
      'info'
    );
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Report API errors to monitor
    captureError(error, {
      context: 'API_RESPONSE_ERROR',
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

/**
 * Simulated delay for development (mimics network latency)
 */
export const simulateDelay = (ms: number = API_CONFIG.SIMULATED_DELAY) =>
  new Promise((_resolve) => setTimeout(_resolve, ms));
