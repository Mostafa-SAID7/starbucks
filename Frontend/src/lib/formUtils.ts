/**
 * Form Utilities
 * Helpers for form handling and validation
 * 
 * Ready for React Hook Form integration
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */
export const validationSchemas = {
  /**
   * Email validation
   */
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  /**
   * Password validation
   * - At least 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
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
  url: z
    .string()
    .url('Invalid URL'),

  /**
   * Required string
   */
  requiredString: z
    .string()
    .min(1, 'This field is required'),

  /**
   * Optional string
   */
  optionalString: z
    .string()
    .optional(),

  /**
   * Number validation
   */
  number: z
    .number()
    .min(0, 'Must be a positive number'),

  /**
   * Date validation
   */
  date: z
    .date()
    .refine((date) => date > new Date(), 'Date must be in the future'),
};

/**
 * Common form schemas
 */
export const formSchemas = {
  /**
   * Login form schema
   */
  login: z.object({
    email: validationSchemas.email,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),

  /**
   * Register form schema
   */
  register: z.object({
    email: validationSchemas.email,
    password: validationSchemas.password,
    confirmPassword: z.string(),
    firstName: validationSchemas.name,
    lastName: validationSchemas.name,
    agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),

  /**
   * Contact form schema
   */
  contact: z.object({
    name: validationSchemas.name,
    email: validationSchemas.email,
    phone: validationSchemas.phone.optional(),
    subject: validationSchemas.requiredString,
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be at most 1000 characters'),
  }),

  /**
   * Profile update form schema
   */
  profileUpdate: z.object({
    firstName: validationSchemas.name,
    lastName: validationSchemas.name,
    email: validationSchemas.email,
    phone: validationSchemas.phone.optional(),
    bio: z
      .string()
      .max(500, 'Bio must be at most 500 characters')
      .optional(),
  }),

  /**
   * Newsletter subscription schema
   */
  newsletter: z.object({
    email: validationSchemas.email,
    preferences: z.object({
      promotions: z.boolean().optional(),
      newProducts: z.boolean().optional(),
      events: z.boolean().optional(),
    }).optional(),
  }),
};

/**
 * Form error handler
 */
export function getFormError(
  errors: Record<string, any>,
  fieldName: string
): string | undefined {
  const error = errors[fieldName];
  return error?.message;
}

/**
 * Form field helper
 */
export function getFormFieldProps(
  register: any,
  fieldName: string,
  options?: any
) {
  return register(fieldName, options);
}

/**
 * Form submission handler
 */
export async function handleFormSubmit<T>(
  data: T,
  onSubmit: (data: T) => Promise<void>,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    await onSubmit(data);
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
    throw error;
  }
}

/**
 * Form reset helper
 */
export function resetForm(reset: any, defaultValues?: any): void {
  reset(defaultValues);
}

/**
 * Async field validation
 */
export async function validateFieldAsync(
  fieldName: string,
  value: any,
  validator: (value: any) => Promise<boolean>
): Promise<string | undefined> {
  try {
    const isValid = await validator(value);
    return isValid ? undefined : `${fieldName} is invalid`;
  } catch (error) {
    return `Error validating ${fieldName}`;
  }
}

/**
 * Form state helper
 */
export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, any>;
}

export function getFormState(formState: any): FormState {
  return {
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    errors: formState.errors,
  };
}
