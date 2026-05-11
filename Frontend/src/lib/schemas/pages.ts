import { z } from 'zod';
import { LocalizedTextSchema } from './common';

/**
 * Generic Page and Section validation schemas
 */

const LocalizedOrString = z.union([z.string(), LocalizedTextSchema]);

export const GenericContactInfoSchema = z.object({
  id: z.string(),
  type: z.string(),
  value: z.string(),
  label: LocalizedOrString.optional(),
  icon: z.string().optional(),
  address: LocalizedOrString.optional(),
  link: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  phoneTel: z.string().optional(),
});

export const GenericSubsectionSchema = z.object({
  title: LocalizedTextSchema.optional(),
  paragraphs: z.array(LocalizedOrString).optional(),
  list: z.array(LocalizedOrString).optional(),
});

export const GenericTypeItemSchema = z.object({
  id: z.string(),
  label: LocalizedTextSchema,
  text: LocalizedTextSchema,
});

export const GenericDefinitionSchema = z.object({
  term: LocalizedTextSchema,
  definition: LocalizedTextSchema,
});

export const GenericGroupSchema = z.object({
  title: LocalizedTextSchema,
  paragraphs: z.array(LocalizedTextSchema),
});

export const GenericImageGridSchema = z.object({
  images: z.array(z.string()),
  columns: z.number().optional(),
  aspectRatio: z.string().optional(),
});

export const GenericSectionSchema = z.object({
  id: z.string(),
  title: LocalizedOrString.optional(),
  subtitle: LocalizedOrString.optional(),
  paragraphs: z.array(LocalizedOrString).optional(),
  list: z.array(LocalizedOrString).optional(),
  image: LocalizedOrString.optional(),
  layout: z.enum(['standard', 'split', 'centered']).optional(),
  imagePosition: z.enum(['left', 'right']).optional(),
  cta: LocalizedOrString.optional(),
  ctaLink: z.string().optional(),
  note: LocalizedOrString.optional(),
  videoUrl: z.string().optional(),
  imageGrid: GenericImageGridSchema.optional(),
  contactInfo: GenericContactInfoSchema.optional(),
  subsections: z.array(GenericSubsectionSchema).optional(),
  types: z.array(GenericTypeItemSchema).optional(),
  definitions: z.array(GenericDefinitionSchema).optional(),
  groups: z.array(GenericGroupSchema).optional(),
  contactNote: LocalizedOrString.optional(),
  hideSideBorder: z.boolean().optional(),
});

export const GenericPageDataSchema = z.object({
  slug: z.string(),
  title: LocalizedOrString.optional(),
  subtitle: LocalizedOrString.optional(),
  lastUpdated: LocalizedOrString.optional(),
  layoutType: z.enum(['sidebar', 'alternating', 'standard']).optional(),
  sidebarImage: LocalizedOrString.optional(),
  hideMainTitle: z.boolean().optional(),
  hero: z.object({
    title: LocalizedOrString,
    description: LocalizedOrString.optional(),
    image: LocalizedOrString,
    cta: LocalizedOrString.optional(),
    ctaLink: z.string().optional(),
  }).optional(),
  intro: z.object({
    title: LocalizedOrString.optional(),
    paragraphs: z.array(LocalizedOrString).optional(),
    image: LocalizedOrString.optional(),
  }).optional(),
  accordion: z.object({
    title: LocalizedOrString.optional(),
    items: z.array(z.object({
      title: LocalizedOrString,
      content: LocalizedOrString,
    })),
  }).optional(),
  sections: z.array(GenericSectionSchema),
  updateNote: LocalizedOrString.optional(),
});

export type GenericSection = z.infer<typeof GenericSectionSchema>;
export type GenericPageData = z.infer<typeof GenericPageDataSchema>;
export type GenericContactInfo = z.infer<typeof GenericContactInfoSchema>;
export type GenericSubsection = z.infer<typeof GenericSubsectionSchema>;
export type GenericTypeItem = z.infer<typeof GenericTypeItemSchema>;
export type GenericDefinition = z.infer<typeof GenericDefinitionSchema>;
export type GenericGroup = z.infer<typeof GenericGroupSchema>;
export type GenericImageGrid = z.infer<typeof GenericImageGridSchema>;
