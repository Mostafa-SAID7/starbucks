import { z } from 'zod';
import { 
  LoginRequestSchema, 
  RegisterRequestSchema 
} from '@/lib/schemas';
import { 
  EmailSchema, 
  NameSchema, 
  PhoneSchema, 
  PasswordSchema,
  EmailSchema as RequiredEmail,
  NameSchema as RequiredName
} from '@/lib/schemas/common';

/**
 * Form Schemas
 * Re-exports domain schemas for use in UI forms, 
 * adding UI-only fields or constraints where necessary.
 */

export const formSchemas = {
  /**
   * Login form schema (Domain aligned)
   */
  login: LoginRequestSchema,

  /**
   * Register form schema (Domain aligned)
   */
  register: RegisterRequestSchema,

  /**
   * Contact form schema (UI Specific)
   */
  contact: z.object({
    name: RequiredName,
    email: RequiredEmail,
    phone: PhoneSchema.optional(),
    subject: z.string().min(1, 'This field is required'),
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be at most 1000 characters'),
  }),

  /**
   * Profile update form schema
   */
  profileUpdate: z.object({
    firstName: RequiredName,
    lastName: RequiredName,
    email: RequiredEmail,
    phone: PhoneSchema.optional(),
    bio: z
      .string()
      .max(500, 'Bio must be at most 500 characters')
      .optional(),
  }),

  /**
   * Newsletter subscription schema
   */
  newsletter: z.object({
    email: RequiredEmail,
    preferences: z.object({
      promotions: z.boolean().optional(),
      newProducts: z.boolean().optional(),
      events: z.boolean().optional(),
    }).optional(),
  }),
};

// Re-export validation primitives for ad-hoc form use
export {
  EmailSchema,
  PasswordSchema,
  PhoneSchema,
  NameSchema
};
