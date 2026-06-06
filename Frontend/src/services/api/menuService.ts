/**
 * Menu API Service
 * Handles all menu-related API calls to the backend.
 * All content endpoints accept a `language` parameter (en | ar) so the
 * Frontend never has to do manual en/ar field switching at the component
 * level — the API returns a single resolved string for the requested locale.
 */

import { apiService } from './index';
import { MenuCategory, MenuItem } from '@/lib/schemas';
import mockMenuData from '@/data/menu/menu.json';
import type { MenuData } from '@/lib/schemas/menu';

const typedMockData = mockMenuData as unknown as MenuData;

export interface CategoriesResponse {
  items: MenuCategory[];
  totalCount: number;
}

/**
 * Get all menu categories with subcategories and items.
 * Pass the active UI language so the API resolves LocalizedContent fields
 * into a single string for each locale before returning.
 */
export const getCategories = async (language: string = 'en'): Promise<MenuCategory[]> => {
  try {
    const response = await apiService.get<CategoriesResponse>(
      `/api/v1/Menu/categories?language=${language}`
    );
    return response.items;
  } catch (error) {
    console.warn('Falling back to mock menu data due to API failure', error);
    return typedMockData.categories;
  }
};

/**
 * Get specific menu category by slug.
 */
export const getCategory = async (slug: string, language: string = 'en'): Promise<MenuCategory> => {
  try {
    return await apiService.get<MenuCategory>(
      `/api/v1/Menu/categories/${slug}?language=${language}`
    );
  } catch (error) {
    console.warn('Falling back to mock category data due to API failure', error);
    const category = typedMockData.categories.find(c => c.id === slug);
    if (!category) throw error;
    return category;
  }
};

/**
 * Get menu item details by ID.
 */
export const getItem = async (itemId: string, language: string = 'en'): Promise<MenuItem> => {
  try {
    return await apiService.get<MenuItem>(
      `/api/v1/Menu/items/${itemId}?language=${language}`
    );
  } catch (error) {
    console.warn('Falling back to mock item data', error);
    for (const category of typedMockData.categories) {
      for (const sub of category.subcategories || []) {
        const item = sub.items?.find((i: MenuItem) => i.id === itemId);
        if (item) return item;
      }
    }
    throw error;
  }
};

/**
 * Search menu items by keyword.
 */
export const search = async (
  query: string,
  language: string = 'en'
): Promise<MenuItem[]> => {
  try {
    const params = new URLSearchParams({ query, language });
    return await apiService.get<MenuItem[]>(`/api/v1/Menu/search?${params.toString()}`);
  } catch (error) {
    console.warn('Falling back to mock search data', error);
    const results: MenuItem[] = [];
    const lowerQuery = query.toLowerCase();
    for (const category of typedMockData.categories) {
      for (const sub of category.subcategories || []) {
        for (const item of sub.items || []) {
          if (item.id.toLowerCase().includes(lowerQuery)) {
            results.push(item);
          }
        }
      }
    }
    return results;
  }
};

export const menuService = { getCategories, getCategory, getItem, search };
