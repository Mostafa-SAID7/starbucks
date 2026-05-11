/**
 * Admin Category Service
 * Handles all category management API calls
 */

import { apiService } from '@/services/api';
import { PagedResult } from '@/types/common/pagination';
import {
  CategoryManagementDto,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  MenuItemManagementDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
} from '@/types/admin/category';

/**
 * Get all categories with pagination
 */
export const getCategories = async (
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PagedResult<CategoryManagementDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  return apiService.get(`/api/v1/admin/categories?${params.toString()}`);
};

/**
 * Get category details by ID
 */
export const getCategoryDetails = async (id: string): Promise<CategoryManagementDto> => {
  return apiService.get(`/api/v1/admin/categories/${id}`);
};

/**
 * Create a new category
 */
export const createCategory = async (
  data: CreateCategoryRequestDto
): Promise<CategoryManagementDto> => {
  return apiService.post('/api/v1/admin/categories', data);
};

/**
 * Update category information
 */
export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequestDto
): Promise<CategoryManagementDto> => {
  return apiService.put(`/api/v1/admin/categories/${id}`, data);
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  return apiService.delete(`/api/v1/admin/categories/${id}`);
};

/**
 * Get menu items for a category
 */
export const getCategoryMenuItems = async (
  categoryId: string,
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PagedResult<MenuItemManagementDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  return apiService.get(`/api/v1/admin/categories/${categoryId}/items?${params.toString()}`);
};

/**
 * Create a new menu item
 */
export const createMenuItem = async (
  data: CreateMenuItemRequestDto
): Promise<MenuItemManagementDto> => {
  return apiService.post('/api/v1/admin/menu-items', data);
};

/**
 * Update menu item information
 */
export const updateMenuItem = async (
  id: string,
  data: UpdateMenuItemRequestDto
): Promise<MenuItemManagementDto> => {
  return apiService.put(`/api/v1/admin/menu-items/${id}`, data);
};

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (id: string): Promise<void> => {
  return apiService.delete(`/api/v1/admin/menu-items/${id}`);
};

/**
 * Get menu item details
 */
export const getMenuItemDetails = async (id: string): Promise<MenuItemManagementDto> => {
  return apiService.get(`/api/v1/admin/menu-items/${id}`);
};

export const categoryService = {
  getCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemDetails,
};
