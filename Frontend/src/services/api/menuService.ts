/**
 * Menu API Service
 * Handles all menu-related API calls to the backend
 */

import { apiService } from './index';
import { MenuCategory, MenuItem } from '@/lib/schemas';
import mockMenuData from '@/data/menu/menu.json';

export interface CategoriesResponse {
  items: MenuCategory[];
  totalCount: number;
}

/**
 * Get all menu categories
 */
export const getCategories = async (language: string = 'en'): Promise<MenuCategory[]> => {
  try {
    const response = await apiService.get<CategoriesResponse>(`/api/v1/Menu/categories?language=${language}`);
    return response.items;
  } catch (error) {
    console.warn('Falling back to mock menu data due to API failure', error);
    return mockMenuData.categories as unknown as MenuCategory[];
  }
};

/**
 * Get specific menu category by slug
 */
export const getCategory = async (slug: string, language: string = 'en'): Promise<MenuCategory> => {
  try {
    return await apiService.get<MenuCategory>(`/api/v1/Menu/categories/${slug}?language=${language}`);
  } catch (error) {
    console.warn('Falling back to mock category data due to API failure', error);
    const category = mockMenuData.categories.find(c => c.id === slug);
    if (!category) throw error;
    return category as unknown as MenuCategory;
  }
};

/**
 * Get menu item details
 */
export const getItem = async (itemId: string): Promise<MenuItem> => {
  try {
    return await apiService.get<MenuItem>(`/api/v1/Menu/items/${itemId}`);
  } catch (error) {
    console.warn('Falling back to mock item data', error);
    for (const category of mockMenuData.categories) {
      for (const sub of category.subcategories || []) {
        const item = sub.items?.find((i: any) => i.id === itemId);
        if (item) return item as unknown as MenuItem;
      }
    }
    throw error;
  }
};

/**
 * Search menu items
 */
export const search = async (
  query: string,
  language: string = 'en'
): Promise<MenuItem[]> => {
  try {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('language', language);

    return await apiService.get<MenuItem[]>(`/api/v1/Menu/search?${params.toString()}`);
  } catch (error) {
    console.warn('Falling back to mock search data', error);
    const results: MenuItem[] = [];
    const lowerQuery = query.toLowerCase();
    
    for (const category of mockMenuData.categories) {
      for (const sub of category.subcategories || []) {
        for (const item of sub.items || []) {
          if (item.id.toLowerCase().includes(lowerQuery)) {
            results.push(item as unknown as MenuItem);
          }
        }
      }
    }
    return results;
  }
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
