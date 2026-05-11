/**
 * Admin Categories Hook
 * Manages category management operations and state
 * Now uses unified useAdminCRUD hook - eliminates 150+ lines of duplicate code
 */

import { useCallback } from 'react';
import {
  categoryService,
} from '@/services/admin';
import { queryKeys } from '@/lib/api/queryKeys';
import { useCRUD } from '@/hooks/admin/useCRUD';
import {
  CategoryManagementDto,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  MenuItemManagementDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
} from '@/types/admin/category';

export interface UseCategoriesOptions {
  pageSize?: number;
}

/**
 * Hook for managing admin categories
 * Uses unified useAdminCRUD for CRUD operations
 */
export function useCategories(options: UseCategoriesOptions = {}) {
  const { pageSize = 20 } = options;

  const {
    getCategories,
    getCategoryDetails,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = categoryService;

  // Use generic CRUD hook for categories
  const categories = useCRUD<
    CategoryManagementDto,
    CreateCategoryRequestDto,
    UpdateCategoryRequestDto
  >(
    {
      fetchList: (pageNumber: number, pageSize: number) => getCategories(pageNumber, pageSize),
      fetchDetails: getCategoryDetails,
      create: createCategory,
      update: updateCategory,
      delete: deleteCategory,
    },
    { 
      pageSize,
      invalidationKeys: [queryKeys.menu.all()]
    }
  );

  // Use generic CRUD hook for menu items
  const menuItems = useCRUD<
    MenuItemManagementDto,
    CreateMenuItemRequestDto,
    UpdateMenuItemRequestDto
  >(
    {
      fetchList: (pageNumber: number, pageSize: number) => 
        getCategoryMenuItems(categories.selectedItem?.id || '', pageNumber, pageSize),
      fetchDetails: () => Promise.resolve({} as MenuItemManagementDto),
      create: createMenuItem,
      update: updateMenuItem,
      delete: deleteMenuItem,
    },
    { 
      pageSize,
      invalidationKeys: [queryKeys.menu.all()]
    }
  );

  // Load menu items when category is selected
  const selectCategory = useCallback(
    async (id: string) => {
      const category = categories.items.find((c) => c.id === id);
      if (category) {
        categories.selectItem(category);
        // Load menu items for this category
        await menuItems.loadItems(1, pageSize);
      }
    },
    [categories, menuItems, pageSize]
  );

  return {
    // Categories
    categories: categories.items,
    pagination: categories.pagination,
    isLoadingCategories: categories.isLoading,
    categoriesError: categories.error,
    goToPage: categories.goToPage,
    setPageSize: categories.setPageSize,

    // Category operations
    createCategoryMutation: categories.createMutation,
    updateCategoryMutation: categories.updateMutation,
    deleteCategoryMutation: categories.deleteMutation,

    // Selected category
    selectedCategory: categories.selectedItem,
    isLoadingCategoryDetails: categories.isLoadingDetails,
    selectCategory,

    // Menu items
    menuItems: menuItems.items,
    menuItemsPagination: menuItems.pagination,
    isLoadingMenuItems: menuItems.isLoading,
    menuItemsError: menuItems.error,
    loadCategoryMenuItems: menuItems.loadItems,

    // Menu item operations
    createMenuItemMutation: menuItems.createMutation,
    updateMenuItemMutation: menuItems.updateMutation,
    deleteMenuItemMutation: menuItems.deleteMutation,

    // Selected menu item
    selectedMenuItem: menuItems.selectedItem,
    selectMenuItem: menuItems.selectItem,
  };
}
