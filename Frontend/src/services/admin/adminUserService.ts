/**
 * Admin User Service
 * Handles all user management API calls
 */

import { api } from '@/lib/api';
import { PagedResult } from '@/types/common/pagination';
import {
  UserManagementDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserActivityDto,
  UserLoginHistoryDto,
} from '@/types/admin/user';
import { UserRole } from '@/types';

/**
 * Get all users with pagination and filtering
 */
export const getUsers = async (
  pageNumber: number = 1,
  pageSize: number = 20,
  searchTerm?: string,
  role?: UserRole
): Promise<PagedResult<UserManagementDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());
  if (searchTerm) params.append('searchTerm', searchTerm);
  if (role) params.append('role', role);

  return api.get(`/admin/users?${params.toString()}`);
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<UserManagementDto> => {
  return api.get(`/admin/users/${id}`);
};

/**
 * Create a new user
 */
export const createUser = async (data: CreateUserRequestDto): Promise<UserManagementDto> => {
  return api.post('/admin/users', data);
};

/**
 * Update user information
 */
export const updateUser = async (
  id: string,
  data: UpdateUserRequestDto
): Promise<UserManagementDto> => {
  return api.put(`/admin/users/${id}`, data);
};

/**
 * Delete a user (soft delete)
 */
export const deleteUser = async (id: string): Promise<void> => {
  return api.delete(`/admin/users/${id}`);
};

/**
 * Disable user account
 */
export const disableUser = async (id: string): Promise<{ message: string }> => {
  return api.post(`/admin/users/${id}/disable`);
};

/**
 * Enable user account
 */
export const enableUser = async (id: string): Promise<{ message: string }> => {
  return api.post(`/admin/users/${id}/enable`);
};

/**
 * Reset user password
 */
export const resetPassword = async (
  id: string
): Promise<{ temporaryPassword: string }> => {
  return api.post(`/admin/users/${id}/reset-password`);
};

/**
 * Change user role
 */
export const changeUserRole = async (id: string, role: UserRole): Promise<UserManagementDto> => {
  return api.post(`/admin/users/${id}/role`, { role });
};

/**
 * Get user activity log
 */
export const getUserActivity = async (
  id: string,
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PagedResult<UserActivityDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  return api.get(`/admin/users/${id}/activity?${params.toString()}`);
};

/**
 * Get user login history
 */
export const getUserLoginHistory = async (
  id: string,
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PagedResult<UserLoginHistoryDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  return api.get(`/admin/users/${id}/login-history?${params.toString()}`);
};

export const adminUserService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  disableUser,
  enableUser,
  resetPassword,
  changeUserRole,
  getUserActivity,
  getUserLoginHistory,
};
