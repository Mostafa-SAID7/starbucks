/**
 * User API Service
 * Handles all user profile-related API calls
 */

import { apiService } from './index';

export interface UserPreferences {
  language: 'en' | 'ar';
  notifications: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  loyaltyPoints: number;
  preferences: UserPreferences;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<UserProfile> => {
  return apiService.get<UserProfile>('/user/profile');
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  return apiService.put<UserProfile>('/user/profile', data);
};

/**
 * User service object
 */
export const userService = {
  getProfile,
  updateProfile,
};
