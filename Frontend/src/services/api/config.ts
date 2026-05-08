/**
 * API Configuration
 */

import { ApiConfig } from '@/types/services';

export const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};