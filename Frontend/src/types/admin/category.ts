/**
 * Admin Category Management Types
 */

export interface CategoryManagementDto {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryRequestDto {
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
  displayOrder?: number;
}

export interface UpdateCategoryRequestDto {
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface MenuItemManagementDto {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  categoryId: string;
  categoryName: string;
  image?: string;
  calories?: number;
  allergens?: string[];
  isAvailable: boolean;
  displayOrder: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMenuItemRequestDto {
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  categoryId: string;
  image?: string;
  calories?: number;
  allergens?: string[];
  displayOrder?: number;
}

export interface UpdateMenuItemRequestDto {
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price?: number;
  categoryId?: string;
  image?: string;
  calories?: number;
  allergens?: string[];
  isAvailable?: boolean;
  displayOrder?: number;
}

export interface BulkOperationRequestDto {
  operation: string;
  itemIds?: string[];
  parameters?: Record<string, unknown>;
}

export interface BulkOperationResultDto {
  operation: string;
  successCount: number;
  failureCount: number;
  errors?: string[];
  completedAt: string;
}
