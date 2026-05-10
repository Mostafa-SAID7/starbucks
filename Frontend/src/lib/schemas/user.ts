import { z } from 'zod';
import { EmailSchema, PasswordSchema, PhoneSchema, NameSchema } from './common';

/**
 * User and Authentication validation schemas
 */

export const UserRoleSchema = z.enum(['Customer', 'Admin', 'SuperAdmin']);

export const UserSchema = z.object({
  id: z.string(),
  email: EmailSchema,
  firstName: z.string(),
  lastName: z.string(),
  role: UserRoleSchema,
  phone: PhoneSchema.optional(),
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
  email: EmailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const RegisterRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: z.string(),
  firstName: NameSchema,
  lastName: NameSchema,
  phone: PhoneSchema.optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
