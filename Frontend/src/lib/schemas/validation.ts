/**
 * Unified Validation Module
 * Single source of truth for all validation schemas and functions
 * Consolidates validation from: validation.ts, formUtils.ts, validation/schemas.ts
 */

import { z, ZodSchema, ZodError } from 'zod';
import { AppError, ErrorType } from '@/lib/errorUtils';

/**
 * Common validation schemas
 */
export const commonSchemas = {
  /**
   * Email validation
   */
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  /**
   * Password validation
   * Requirements: minimum 8 characters, uppercase, lowercase, number
   */
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  /**
   * Phone number validation
   */
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number'),

  /**
   * Name validation
   */
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),

  /**
   * URL validation
   */
  url: z.string().url('Invalid URL'),

  /**
   * Date validation
   */
  date: z.string().datetime('Invalid date format'),
};

/**
 * Form validation schemas
 */
export const formSchemas = {
  /**
   * Login form schema
   */
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),

  /**
   * Register form schema
   */
  register: z
    .object({
      email: commonSchemas.email,
      password: commonSchemas.password,
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
    }),

  /**
   * Profile update form schema
   */
  profileUpdate: z.object({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    phone: commonSchemas.phone.optional(),
    dateOfBirth: commonSchemas.date.optional(),
  }),

  /**
   * Contact form schema
   */
  contact: z.object({
    name: commonSchemas.name,
    email: commonSchemas.email,
    phone: commonSchemas.phone.optional(),
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters'),
  }),
};

/**
 * API request/response validation schemas
 */
export const apiSchemas = {
  /**
   * Paginated response schema
   */
  paginatedResponse: <T extends ZodSchema>(itemSchema: T) =>
    z.object({
      items: z.array(itemSchema),
      pageNumber: z.number(),
      pageSize: z.number(),
      totalCount: z.number(),
      totalPages: z.number(),
    }),

  /**
   * Error response schema
   */
  errorResponse: z.object({
    message: z.string(),
    statusCode: z.number().optional(),
    errorType: z.string().optional(),
    errors: z.record(z.array(z.string())).optional(),
    timestamp: z.string().optional(),
    traceId: z.string().optional(),
  }),
};

/**
 * Validate data against a Zod schema
 * Throws AppError on validation failure
 */
export function validateData<T>(
  data: unknown,
  schema: ZodSchema,
  context?: string
): T {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');

      throw new AppError(
        `Validation failed${context ? ` (${context})` : ''}: ${message}`,
        ErrorType.VALIDATION,
        400,
        'Bad Request'
      );
    }
    throw error;
  }
}

/**
 * Safely validate data without throwing
 * Returns validation result with errors
 */
export function safeValidateData<T>(
  data: unknown,
  schema: ZodSchema
): { success: boolean; data?: T; errors?: string[] } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData as T };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map(
        issue => `${issue.path.join('.')}: ${issue.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Extract field errors from validation error
 */
export function extractFieldErrors(
  error: unknown
): Record<string, string> {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      fieldErrors[path] = issue.message;
    });
    return fieldErrors;
  }
  return {};
}

/**
 * Create a validated API response handler
 */
export function createValidatedResponseHandler<T>(schema: ZodSchema) {
  return (response: unknown): T => {
    return validateData<T>(response, schema, 'API Response');
  };
}

/**
 * Type exports for form data
 */
export type LoginFormData = z.infer<typeof formSchemas.login>;
export type RegisterFormData = z.infer<typeof formSchemas.register>;
export type ProfileUpdateFormData = z.infer<typeof formSchemas.profileUpdate>;
export type ContactFormData = z.infer<typeof formSchemas.contact>;
