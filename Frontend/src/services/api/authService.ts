/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiService } from './index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return apiService.post<AuthResponse>('/auth/login', credentials);
};

/**
 * Register new user
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  return apiService.post<AuthResponse>('/auth/register', userData);
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  return apiService.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  return apiService.post('/auth/logout');
};

/**
 * Auth service object
 */
export const authService = {
  login,
  register,
  refreshToken,
  logout,
};
