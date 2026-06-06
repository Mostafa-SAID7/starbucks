import { z } from 'zod';

/**
 * Menu and Product validation schemas
 */

/**
 * LocalizedContent schema — matches Backend DTOs
 * Returned by API with both English and Arabic values.
 * Frontend reads the active language and displays accordingly.
 */
export const LocalizedContentSchema = z.object({
  English: z.string(),
  Arabic: z.string(),
});

export const MenuItemSchema = z.object({
  id: z.string(),
  href: z.string(),
  image: z.string(),
  name: LocalizedContentSchema,
  description: LocalizedContentSchema.optional(),
  shortDescription: LocalizedContentSchema.optional(),
  isNew: z.boolean().optional(),
});

export const MenuSubcategorySchema = z.object({
  id: z.string(),
  href: z.string().optional(),
  image: z.string().optional(),
  name: LocalizedContentSchema.optional(),
  description: LocalizedContentSchema.optional(),
  items: z.array(MenuItemSchema).optional(),
});

export const MenuCategorySchema = z.object({
  id: z.string(),
  name: LocalizedContentSchema.optional(),
  description: LocalizedContentSchema.optional(),
  href: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
  subcategories: z.array(MenuSubcategorySchema).optional(),
});

export const SidebarActionSchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  href: z.string(),
  primary: z.boolean().optional(),
  variant: z.enum(['primary', 'secondary']).optional(),
});

export const SidebarDataSchema = z.object({
  image: z.string(),
  actions: z.array(SidebarActionSchema),
});

export const AllergyInfoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  link: z.string(),
  linkLabel: z.string().optional(),
});

export const MenuDataSchema = z.object({
  categories: z.array(MenuCategorySchema),
  items: z.array(MenuItemSchema).optional(),
  allergyInfo: AllergyInfoSchema.optional(),
  sidebar: SidebarDataSchema.optional(),
});

export type LocalizedContent = z.infer<typeof LocalizedContentSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuSubcategory = z.infer<typeof MenuSubcategorySchema>;
export type MenuCategory = z.infer<typeof MenuCategorySchema>;
export type SidebarAction = z.infer<typeof SidebarActionSchema>;
export type SidebarData = z.infer<typeof SidebarDataSchema>;
export type MenuData = z.infer<typeof MenuDataSchema>;
export type AllergyInfo = z.infer<typeof AllergyInfoSchema>;
