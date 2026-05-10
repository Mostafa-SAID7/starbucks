import { z } from 'zod';

/**
 * Navigation validation schemas
 */

export const NavigationItemSchema = z.object({
  id: z.string(),
  href: z.string(),
  icon: z.string().optional(),
  slug: z.string().nullable().optional(),
  isExternal: z.boolean().optional(),
});

export const NavigationConfigSchema = z.object({
  navbar: z.object({
    links: z.array(NavigationItemSchema),
  }),
  footer: z.object({
    sections: z.array(z.object({
      id: z.string(),
      links: z.array(NavigationItemSchema),
    })),
    legal: z.array(NavigationItemSchema),
    socials: z.array(z.object({
      name: z.string(),
      href: z.string(),
      icon: z.string().optional(),
    })),
    app: z.any().optional(),
    countries: z.any().optional(),
  }),
});

export type NavigationItem = z.infer<typeof NavigationItemSchema>;
export type NavigationConfig = z.infer<typeof NavigationConfigSchema>;
