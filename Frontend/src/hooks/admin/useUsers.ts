/**
 * Admin Users Hook
 * Manages user management operations and state
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import {
  adminUserService,
} from '@/services/admin';

const {
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
} = adminUserService;
import { queryKeys } from '@/lib/api/queryKeys';
import { usePagination } from '@/hooks/common/usePagination';
import {
  UserManagementDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from '@/types/admin/user';
import { UserRole } from '@/types';

export interface UseUsersOptions {
  pageSize?: number;
}

export interface UseUsersReturn {
  // User list
  users: UserManagementDto[];
  pagination: { pageNumber: number; pageSize: number; totalPages: number; totalCount: number };
  isLoadingUsers: boolean;
  usersError: string | null;
  goToPage: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
  searchUsers: (searchTerm: string, role?: UserRole) => Promise<void>;

  // User operations
  createUserMutation: UseMutationResult<UserManagementDto, Error, CreateUserRequestDto>;
  updateUserMutation: UseMutationResult<UserManagementDto, Error, { id: string; data: UpdateUserRequestDto }>;
  deleteUserMutation: UseMutationResult<void, Error, string>;
  disableUserMutation: UseMutationResult<{ message: string }, Error, string>;
  enableUserMutation: UseMutationResult<{ message: string }, Error, string>;
  resetPasswordMutation: UseMutationResult<{ temporaryPassword: string }, Error, string>;
  changeUserRoleMutation: UseMutationResult<UserManagementDto, Error, { id: string; role: UserRole }>;

  // User details
  selectedUser: UserManagementDto | null;
  isLoadingUserDetails: boolean;
  selectUser: (id: string) => Promise<void>;

  // Activity and history
  userActivity: unknown;
  userLoginHistory: unknown;
  isLoadingActivity: boolean;
  isLoadingLoginHistory: boolean;
  loadUserActivity: (userId: string, pageNumber?: number, pageSize?: number) => Promise<void>;
  loadUserLoginHistory: (userId: string, pageNumber?: number, pageSize?: number) => Promise<void>;
}

/**
 * Hook for managing admin user operations
 */
export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const { pageSize = 20 } = options;
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<UserManagementDto | null>(null);
  const [userActivity, setUserActivity] = useState<unknown>(null);
  const [userLoginHistory, setUserLoginHistory] = useState<unknown>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>();

  // Pagination hook for user list
  const {
    items: users,
    pagination,
    isLoading: isLoadingUsers,
    error: usersError,
    goToPage,
    setPageSize,
  } = usePagination(
    (pageNumber, pageSize) =>
      getUsers(pageNumber, pageSize, searchTerm || undefined, selectedRole),
    { initialPageSize: pageSize }
  );

  // Search users
  const searchUsers = useCallback(async (term: string, role?: UserRole) => {
    setSearchTerm(term);
    setSelectedRole(role);
    goToPage(1);
  }, [goToPage]);

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserRequestDto) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequestDto }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
      if (selectedUser) {
        setSelectedUser(null);
      }
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
      setSelectedUser(null);
    },
  });

  // Disable user mutation
  const disableUserMutation = useMutation({
    mutationFn: (id: string) => disableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
    },
  });

  // Enable user mutation
  const enableUserMutation = useMutation({
    mutationFn: (id: string) => enableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (id: string) => resetPassword(id),
  });

  // Change user role mutation
  const changeUserRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
    },
  });

  // Get user details
  const {
    isLoading: isLoadingUserDetails,
  } = useQuery({
    queryKey: ['admin-user-details', selectedUser?.id],
    queryFn: () => (selectedUser ? getUserById(selectedUser.id) : null),
    enabled: !!selectedUser,
  });

  const selectUser = useCallback(async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
    }
  }, [users]);

  // Get user activity
  const loadUserActivity = useCallback(
    async (userId: string, pageNumber: number = 1, pageSize: number = 20) => {
      try {
        const activity = await getUserActivity(userId, pageNumber, pageSize);
        setUserActivity(activity);
      } catch (error) {
        console.error('Failed to load user activity:', error);
      }
    },
    []
  );

  // Get user login history
  const loadUserLoginHistory = useCallback(
    async (userId: string, pageNumber: number = 1, pageSize: number = 20) => {
      try {
        const history = await getUserLoginHistory(userId, pageNumber, pageSize);
        setUserLoginHistory(history);
      } catch (error) {
        console.error('Failed to load user login history:', error);
      }
    },
    []
  );

  return {
    users,
    pagination,
    isLoadingUsers,
    usersError,
    goToPage,
    setPageSize,
    searchUsers,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    disableUserMutation,
    enableUserMutation,
    resetPasswordMutation,
    changeUserRoleMutation,
    selectedUser,
    isLoadingUserDetails,
    selectUser,
    userActivity,
    userLoginHistory,
    isLoadingActivity: false,
    isLoadingLoginHistory: false,
    loadUserActivity,
    loadUserLoginHistory,
  };
}
