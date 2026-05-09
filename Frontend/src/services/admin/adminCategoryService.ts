/**
 * Admin Category Service
 * Handles all category management API calls
 */

import { api } from '@/lib/api';
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

  return api.get(`/admin/categories?${params.toString()}`);
};

/**
 * Get category details by ID
 */
export const getCategoryDetails = async (id: string): Promise<CategoryManagementDto> => {
  return api.get(`/admin/categories/${id}`);
};

/**
 * Create a new category
 */
export const createCategory = async (
  data: CreateCategoryRequestDto
): Promise<CategoryManagementDto> => {
  return api.post('/admin/categories', data);
};

/**
 * Update category information
 */
export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequestDto
): Promise<CategoryManagementDto> => {
  return api.put(`/admin/categories/${id}`, data);
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  return api.delete(`/admin/categories/${id}`);
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

  return api.get(`/admin/categories/${categoryId}/items?${params.toString()}`);
};

/**
 * Create a new menu item
 */
export const createMenuItem = async (
  data: CreateMenuItemRequestDto
): Promise<MenuItemManagementDto> => {
  return api.post('/admin/menu-items', data);
};

/**
 * Update menu item information
 */
export const updateMenuItem = async (
  id: string,
  data: UpdateMenuItemRequestDto
): Promise<MenuItemManagementDto> => {
  return api.put(`/admin/menu-items/${id}`, data);
};

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (id: string): Promise<void> => {
  return api.delete(`/admin/menu-items/${id}`);
};

/**
 * Get menu item details
 */
export const getMenuItemDetails = async (id: string): Promise<MenuItemManagementDto> => {
  return api.get(`/admin/menu-items/${id}`);
};

export const adminCategoryService = {
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
