/**
 * Validation Schemas
 * Zod schemas for form validation matching backend validators
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 * Requirements: minimum 8 characters
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form schema
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'First name must be less than 100 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(100, 'Last name must be less than 100 characters'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.string().datetime().optional().or(z.literal('')),
  preferences: z
    .object({
      language: z.enum(['en', 'ar']).optional(),
      notifications: z.boolean().optional(),
    })
    .optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

/**
 * Password change schema
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

/**
 * Admin user creation schema
 */
export const adminCreateUserSchema = z.object({
  email: emailSchema,
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  role: z.enum(['Customer', 'Employee', 'Manager', 'Admin', 'SuperAdmin']),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
});

export type AdminCreateUserFormData = z.infer<typeof adminCreateUserSchema>;

/**
 * Category creation schema
 */
export const categorySchema = z.object({
  nameEn: z
    .string()
    .min(1, 'English name is required')
    .max(100, 'Name must be less than 100 characters'),
  nameAr: z
    .string()
    .min(1, 'Arabic name is required')
    .max(100, 'Name must be less than 100 characters'),
  descriptionEn: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  descriptionAr: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

/**
 * Menu item schema
 */
export const menuItemSchema = z.object({
  nameEn: z
    .string()
    .min(1, 'English name is required')
    .max(100, 'Name must be less than 100 characters'),
  nameAr: z
    .string()
    .min(1, 'Arabic name is required')
    .max(100, 'Name must be less than 100 characters'),
  descriptionEn: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  descriptionAr: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  price: z.number().positive('Price must be greater than 0'),
  categoryId: z.string().uuid('Invalid category ID'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  calories: z.number().nonnegative('Calories must be non-negative').optional(),
  allergens: z.array(z.string()).optional(),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;

/**
 * Search query schema
 */
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters'),
  language: z.enum(['en', 'ar']).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;
