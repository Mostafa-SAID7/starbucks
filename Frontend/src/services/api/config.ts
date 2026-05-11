import { ApiConfig } from '@/types/services';

/**
 * Default API configuration
 */
export const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
};
