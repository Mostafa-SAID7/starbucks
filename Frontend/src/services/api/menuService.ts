/**
 * Menu API Service
 * Handles all menu-related API calls
 */

import { apiService } from './index';

export interface MenuItem {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  price: number;
  calories?: number;
  allergens?: string[];
}

export interface MenuSubcategory {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  items: MenuItem[];
}

export interface MenuCategory {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  subcategories: MenuSubcategory[];
}

export interface CategoriesResponse {
  categories: MenuCategory[];
}

export interface SearchResponse {
  items: MenuItem[];
  total: number;
}

/**
 * Get all menu categories
 */
export const getCategories = async (): Promise<CategoriesResponse> => {
  return apiService.get<CategoriesResponse>('/menu/categories');
};

/**
 * Get specific menu category
 */
export const getCategory = async (categoryId: string): Promise<MenuCategory> => {
  return apiService.get<MenuCategory>(`/menu/categories/${categoryId}`);
};

/**
 * Get menu item details
 */
export const getItem = async (itemId: string): Promise<MenuItem> => {
  return apiService.get<MenuItem>(`/menu/items/${itemId}`);
};

/**
 * Search menu items
 */
export const search = async (
  query: string,
  language: 'en' | 'ar' = 'en'
): Promise<SearchResponse> => {
  const params = new URLSearchParams();
  params.append('q', query);
  params.append('lang', language);

  return apiService.get<SearchResponse>(`/menu/search?${params.toString()}`);
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
