import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.string().uuid(),
  menuItemId: z.string().uuid(),
  userId: z.string().uuid(),
  userName: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
  isApproved: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof reviewSchema>;

export const createReviewSchema = z.object({
  menuItemId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type CreateReviewRequest = z.infer<typeof createReviewSchema>;
