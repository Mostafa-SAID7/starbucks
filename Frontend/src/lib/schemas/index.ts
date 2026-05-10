/**
 * Centralized Zod Schemas
 * Single source of truth for data validation across the app
 */

import { z } from 'zod';

// ============================================================================
// Common Schemas
// ============================================================================

export const LocalizedTextSchema = z.object({
  en: z.string(),
  ar: z.string(),
});

export const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

// ============================================================================
// User Schemas
// ============================================================================

export const UserRoleSchema = z.enum(['Customer', 'Admin', 'SuperAdmin']);

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: UserRoleSchema,
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  loyaltyPoints: z.number().optional(),
  preferences: z.object({
    language: z.enum(['ar', 'en']),
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark']),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
});

// ============================================================================
// Menu Schemas
// ============================================================================

export const MenuItemSchema = z.object({
  id: z.string(),
  name: LocalizedTextSchema,
  description: LocalizedTextSchema.optional(),
  image: z.string().url(),
  href: z.string(),
  price: z.number().positive(),
  category: z.string(),
  allergens: z.array(z.string()).optional(),
  isVegan: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});

export const MenuSubcategorySchema = z.object({
  id: z.string(),
  name: LocalizedTextSchema,
  image: z.string().url(),
  href: z.string(),
  items: z.array(MenuItemSchema),
});

export const MenuCategorySchema = z.object({
  id: z.string(),
  name: LocalizedTextSchema,
  image: z.string().url(),
  href: z.string(),
  subcategories: z.array(MenuSubcategorySchema),
});

export const MenuDataSchema = z.object({
  categories: z.array(MenuCategorySchema),
});

// ============================================================================
// Location Schemas
// ============================================================================

export const OperatingHoursSchema = z.object({
  open: z.string(),
  close: z.string(),
});

export const LocationSchema = z.object({
  id: z.string(),
  name: LocalizedTextSchema,
  address: LocalizedTextSchema,
  city: z.string(),
  governorate: z.string(),
  coordinates: CoordinatesSchema,
  features: z.array(z.string()),
  operatingHours: z.record(OperatingHoursSchema),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  hasWifi: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  hasDriveThru: z.boolean().optional(),
  isWheelchairAccessible: z.boolean().optional(),
});

// ============================================================================
// Order Schemas
// ============================================================================

export const OrderStatusSchema = z.enum([
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Completed',
  'Cancelled',
]);

export const PaymentStatusSchema = z.enum([
  'Pending',
  'Completed',
  'Failed',
  'Refunded',
]);

export const OrderItemSchema = z.object({
  id: z.string(),
  menuItemId: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  specialInstructions: z.string().optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(OrderItemSchema),
  status: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  totalAmount: z.number().positive(),
  discountAmount: z.number().nonnegative().optional(),
  deliveryAddress: z.string().optional(),
  locationId: z.string().optional(),
  estimatedPrepTime: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateOrderRequestSchema = z.object({
  items: z.array(OrderItemSchema),
  deliveryAddress: z.string().optional(),
  locationId: z.string().optional(),
  specialInstructions: z.string().optional(),
});

// ============================================================================
// API Response Schemas
// ============================================================================

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.any().optional(),
  }).optional(),
  timestamp: z.string(),
});

export const PaginatedResponseSchema = z.object({
  items: z.array(z.any()),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuSubcategory = z.infer<typeof MenuSubcategorySchema>;
export type MenuCategory = z.infer<typeof MenuCategorySchema>;
export type MenuData = z.infer<typeof MenuDataSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type OperatingHours = z.infer<typeof OperatingHoursSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;
