import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const homeBannerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  title: LocalizedTextSchema,
  subtitle: LocalizedTextSchema.optional(),
  imageUrl: z.string().url(),
  mobileImageUrl: z.string().url().optional(),
  actionUrl: z.string().optional(),
  actionText: LocalizedTextSchema.optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

export type HomeBanner = z.infer<typeof homeBannerSchema>;

export const createBannerSchema = homeBannerSchema.omit({ id: true });
export type CreateBannerRequest = z.infer<typeof createBannerSchema>;

export const updateBannerSchema = createBannerSchema.partial();
export type UpdateBannerRequest = z.infer<typeof updateBannerSchema>;
