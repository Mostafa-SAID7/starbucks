/**
 * Menu API Service
 * Handles all menu-related API calls to the backend
 */

import { apiService } from './index';
import { MenuCategory, MenuItem } from '@/lib/schemas';

export interface CategoriesResponse {
  items: MenuCategory[];
  totalCount: number;
}

/**
 * Get all menu categories
 */
export const getCategories = async (language: string = 'en'): Promise<MenuCategory[]> => {
  const response = await apiService.get<CategoriesResponse>(`/api/v1/Menu/categories?language=${language}`);
  return response.items;
};

/**
 * Get specific menu category by slug
 */
export const getCategory = async (slug: string, language: string = 'en'): Promise<MenuCategory> => {
  return apiService.get<MenuCategory>(`/api/v1/Menu/categories/${slug}?language=${language}`);
};

/**
 * Get menu item details
 */
export const getItem = async (itemId: string): Promise<MenuItem> => {
  return apiService.get<MenuItem>(`/api/v1/Menu/items/${itemId}`);
};

/**
 * Search menu items
 */
export const search = async (
  query: string,
  language: string = 'en'
): Promise<MenuItem[]> => {
  const params = new URLSearchParams();
  params.append('query', query);
  params.append('language', language);

  return apiService.get<MenuItem[]>(`/api/v1/Menu/search?${params.toString()}`);
};

/**
 * Menu service object
 */
export const menuService = {
  getCategories,
  getCategory,
  getItem,
  search,
};
