import { menuService } from "@/services/api/menuService";
import type { MenuData, MenuCategory } from "@/types";
import { AppError, ErrorType } from '@/lib/error';

export const menuFetchers = {
  /**
   * Fetch all menu categories (structural)
   */
  async fetchMenuData(): Promise<MenuData> {
    const categories = await menuService.getCategories();
    return { categories };
  },

  /**
   * Fetch specific menu category by slug (or ID)
   */
  async fetchMenuCategory(slug: string): Promise<MenuCategory> {
    return menuService.getCategory(slug);
  },

  /**
   * Fetch specific menu item details
   */
  async fetchMenuItemDetails(categoryId: string, itemId: string) {
    const category = await this.fetchMenuCategory(categoryId);
    
    // Search in subcategories
    for (const subcategory of category.subcategories || []) {
      const item = subcategory.items?.find((i) => i.id === itemId);
      if (item) return { category, subcategory, item };
    }
    
    throw new AppError(`Item not found: ${itemId}`, ErrorType.NOT_FOUND, 404);
  },

  /**
   * Backward compatibility for older item fetch pattern
   */
  async fetchMenuItem(categoryId: string, subcategoryId: string) {
     const category = await this.fetchMenuCategory(categoryId);
     const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
     
     if (!category || !subcategory) {
       throw new AppError(`Subcategory not found: ${subcategoryId}`, ErrorType.NOT_FOUND, 404);
     }
     return { category, subcategory };
  }
};
