/**
 * Admin User Management Types
 */

import { UserRole } from '@/types';

export interface UserManagementDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  dateOfBirth?: string;
  lastLoginAt?: string;
  isLocked: boolean;
  lockoutEnd?: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
}

export interface CreateUserRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  dateOfBirth?: string;
}

export interface UpdateUserRequestDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  dateOfBirth?: string;
}

export interface UserActivityDto {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
}

export interface UserLoginHistoryDto {
  id: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress?: string;
  userAgent?: string;
  isSuccessful: boolean;
}

export interface UserFilterDto {
  searchTerm?: string;
  role?: UserRole;
  isEmailVerified?: boolean;
  isLocked?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

export interface ChangeUserRoleRequestDto {
  role: UserRole;
}
