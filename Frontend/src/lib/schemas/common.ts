import { z } from 'zod';

/**
 * Common validation fragments used across schemas
 */

export const LanguageSchema = z.enum(['ar', 'en']);
export const ThemeSchema = z.enum(['light', 'dark']);
export const StatusSchema = z.enum(['idle', 'loading', 'success', 'error']);

export const EmailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const PhoneSchema = z
  .string()
  .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number');

export const NameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters');

/**
 * Common data structures
 */

export const LocalizedTextSchema = z.object({
  en: z.string(),
  ar: z.string(),
});

export const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export type Language = z.infer<typeof LanguageSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
