import { AppError, ErrorType } from '@/lib/error';
import type { MenuData, MenuCategory, MenuSubcategory } from "@/types";
import { simulateDelay } from "./client";

export const menuFetchers = {
  async fetchMenuData(): Promise<MenuData> {
    await simulateDelay();
    const menu = await import("@/data/menu/menu.json");
    return menu.default as MenuData;
  },

  async fetchMenuCategory(categoryId: string): Promise<MenuData["categories"][0]> {
    await simulateDelay();
    const menu = await import("@/data/menu/menu.json");
    const menuData = menu.default as MenuData;
    const category = menuData.categories?.find((c) => c.id === categoryId);

    if (!category) {
      throw new AppError(`Category not found: ${categoryId}`, ErrorType.NOT_FOUND, 404);
    }
    return category;
  },

  async fetchMenuItem(categoryId: string, subcategoryId: string): Promise<{ category: MenuCategory; subcategory: MenuSubcategory }> {
    await simulateDelay();
    const menu = await import("@/data/menu/menu.json");
    const menuData = menu.default as MenuData;
    const category = menuData.categories?.find((c) => c.id === categoryId);
    const subcategory = category?.subcategories?.find((s) => s.id === subcategoryId);

    if (!category || !subcategory) {
      throw new AppError(`Item not found: ${categoryId}/${subcategoryId}`, ErrorType.NOT_FOUND, 404);
    }
    return { category, subcategory };
  },

  async fetchMenuItemDetails(categoryId: string, itemId: string) {
    await simulateDelay();
    const category = await this.fetchMenuCategory(categoryId);
    for (const subcategory of category.subcategories || []) {
      const item = subcategory.items?.find((i) => i.id === itemId);
      if (item) return { category, subcategory, item };
    }
    throw new AppError(`Item not found: ${itemId}`, ErrorType.NOT_FOUND, 404);
  },
};
