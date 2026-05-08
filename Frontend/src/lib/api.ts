import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { createFetchError, logError } from './errorUtils';

/**
 * API Configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add authentication token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logError(error, 'API Request');
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and token refresh
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('auth_token', token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Log error for monitoring
    logError(error, 'API Response');

    // Convert axios error to our custom error format
    if (error.response) {
      throw createFetchError(
        new Response(null, {
          status: error.response.status,
          statusText: error.response.statusText,
        }),
        error.config?.url
      );
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then((response) => response.data),

  /**
   * POST request
   */
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then((response) => response.data),

  /**
   * PUT request
   */
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then((response) => response.data),

  /**
   * DELETE request
   */
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then((response) => response.data),

  /**
   * PATCH request
   */
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then((response) => response.data),
};

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login user
   */
  login: (credentials: { email: string; password: string }) =>
    api.post<{
      token: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }>('/auth/login', credentials),

  /**
   * Register user
   */
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) =>
    api.post<{
      token: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }>('/auth/register', userData),

  /**
   * Refresh token
   */
  refresh: (refreshToken: string) =>
    api.post<{ token: string }>('/auth/refresh', { refreshToken }),

  /**
   * Logout user
   */
  logout: () => api.post('/auth/logout'),
};

/**
 * Menu API
 */
export const menuApi = {
  /**
   * Get all menu categories
   */
  getCategories: () =>
    api.get<{
      categories: Array<{
        id: string;
        name: { en: string; ar: string };
        description: { en: string; ar: string };
        image: string;
        subcategories: Array<{
          id: string;
          name: { en: string; ar: string };
          description: { en: string; ar: string };
          image: string;
          items: Array<{
            id: string;
            name: { en: string; ar: string };
            description: { en: string; ar: string };
            image: string;
            price: number;
            calories?: number;
            allergens?: string[];
          }>;
        }>;
      }>;
    }>('/menu/categories'),

  /**
   * Get specific menu category
   */
  getCategory: (categoryId: string) =>
    api.get(`/menu/categories/${categoryId}`),

  /**
   * Get menu item details
   */
  getItem: (itemId: string) =>
    api.get(`/menu/items/${itemId}`),

  /**
   * Search menu items
   */
  search: (query: string, language: 'en' | 'ar' = 'en') =>
    api.get(`/menu/search?q=${encodeURIComponent(query)}&lang=${language}`),
};

/**
 * Locations API
 */
export const locationsApi = {
  /**
   * Get all locations
   */
  getAll: () =>
    api.get<{
      locations: Array<{
        id: string;
        name: { en: string; ar: string };
        address: { en: string; ar: string };
        city: string;
        governorate: string;
        coordinates: { lat: number; lng: number };
        features: string[];
        operatingHours: Record<string, { open: string; close: string }>;
        phone?: string;
      }>;
    }>('/locations'),

  /**
   * Get locations by city
   */
  getByCity: (city: string) =>
    api.get(`/locations?city=${encodeURIComponent(city)}`),

  /**
   * Get nearby locations
   */
  getNearby: (lat: number, lng: number, radius: number = 10) =>
    api.get(`/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

/**
 * User API
 */
export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: () =>
    api.get<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      dateOfBirth?: string;
      loyaltyPoints: number;
      preferences: {
        language: 'en' | 'ar';
        notifications: boolean;
      };
    }>('/user/profile'),

  /**
   * Update user profile
   */
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    preferences?: {
      language?: 'en' | 'ar';
      notifications?: boolean;
    };
  }) => api.put('/user/profile', data),
};

/**
 * Health check API
 */
export const healthApi = {
  /**
   * Check API health
   */
  check: () => api.get<{ status: string; timestamp: string }>('/health'),
};

export default api;