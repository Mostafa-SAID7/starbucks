/**
 * Admin Categories Hook
 * Manages category management operations and state
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
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
} from '@/services/admin/adminCategoryService';
import { usePagination } from '@/hooks/common/usePagination';
import {
  CategoryManagementDto,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  MenuItemManagementDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
} from '@/types/admin/category';

export interface UseAdminCategoriesOptions {
  pageSize?: number;
}

export interface UseAdminCategoriesReturn {
  // Categories
  categories: CategoryManagementDto[];
  pagination: any;
  isLoadingCategories: boolean;
  categoriesError: string | null;
  goToPage: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;

  // Category operations
  createCategoryMutation: any;
  updateCategoryMutation: any;
  deleteCategoryMutation: any;

  // Selected category
  selectedCategory: CategoryManagementDto | null;
  isLoadingCategoryDetails: boolean;
  selectCategory: (id: string) => Promise<void>;

  // Menu items
  menuItems: MenuItemManagementDto[];
  menuItemsPagination: any;
  isLoadingMenuItems: boolean;
  menuItemsError: string | null;
  loadCategoryMenuItems: (categoryId: string, pageNumber?: number, pageSize?: number) => Promise<void>;

  // Menu item operations
  createMenuItemMutation: any;
  updateMenuItemMutation: any;
  deleteMenuItemMutation: any;

  // Selected menu item
  selectedMenuItem: MenuItemManagementDto | null;
  selectMenuItem: (id: string) => Promise<void>;
}

/**
 * Hook for managing admin categories
 */
export function useAdminCategories(
  options: UseAdminCategoriesOptions = {}
): UseAdminCategoriesReturn {
  const { pageSize = 20 } = options;
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<CategoryManagementDto | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemManagementDto | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemManagementDto[]>([]);
  const [menuItemsPagination, setMenuItemsPagination] = useState<any>(null);

  // Pagination hook for categories
  const {
    items: categories,
    pagination,
    isLoading: isLoadingCategories,
    error: categoriesError,
    goToPage,
    setPageSize,
  } = usePagination((pageNumber, pageSize) => getCategories(pageNumber, pageSize), {
    initialPageSize: pageSize,
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryRequestDto) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequestDto }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setSelectedCategory(null);
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setSelectedCategory(null);
    },
  });

  // Get category details
  const {
    data: categoryDetailsData,
    isLoading: isLoadingCategoryDetails,
  } = useQuery({
    queryKey: ['admin-category-details', selectedCategory?.id],
    queryFn: () => (selectedCategory ? getCategoryDetails(selectedCategory.id) : null),
    enabled: !!selectedCategory,
  });

  const selectCategory = useCallback(async (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategory(category);
    }
  }, [categories]);

  // Load category menu items
  const loadCategoryMenuItems = useCallback(
    async (categoryId: string, pageNumber: number = 1, pageSize: number = 20) => {
      try {
        const result = await getCategoryMenuItems(categoryId, pageNumber, pageSize);
        setMenuItems(result.items);
        setMenuItemsPagination({
          pageNumber: result.pageNumber,
          pageSize: result.pageSize,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
        });
      } catch (error) {
        console.error('Failed to load category menu items:', error);
      }
    },
    []
  );

  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: (data: CreateMenuItemRequestDto) => createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      if (selectedCategory) {
        loadCategoryMenuItems(selectedCategory.id);
      }
    },
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemRequestDto }) =>
      updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      setSelectedMenuItem(null);
    },
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      setSelectedMenuItem(null);
    },
  });

  const selectMenuItem = useCallback(async (id: string) => {
    const item = menuItems.find((m) => m.id === id);
    if (item) {
      setSelectedMenuItem(item);
    }
  }, [menuItems]);

  return {
    categories,
    pagination,
    isLoadingCategories,
    categoriesError,
    goToPage,
    setPageSize,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    selectedCategory,
    isLoadingCategoryDetails,
    selectCategory,
    menuItems,
    menuItemsPagination,
    isLoadingMenuItems: false,
    menuItemsError: null,
    loadCategoryMenuItems,
    createMenuItemMutation,
    updateMenuItemMutation,
    deleteMenuItemMutation,
    selectedMenuItem,
    selectMenuItem,
  };
}
