import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const rewardOfferSchema = z.object({
  id: z.string().uuid(),
  title: LocalizedTextSchema,
  description: LocalizedTextSchema,
  pointsCost: z.number().int().positive(),
  voucherCode: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean(),
});

export type RewardOffer = z.infer<typeof rewardOfferSchema>;

export const userRewardSchema = z.object({
  id: z.string().uuid(),
  rewardOfferId: z.string().uuid(),
  redeemedAt: z.string().datetime(),
  isUsed: z.boolean(),
  usedAt: z.string().datetime().optional().nullable(),
  offer: rewardOfferSchema.optional(),
});

export type UserReward = z.infer<typeof userRewardSchema>;
