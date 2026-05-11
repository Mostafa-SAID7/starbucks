import { z } from 'zod';

export const systemSettingSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.string(),
  description: z.string().optional(),
  lastModified: z.string().datetime().optional(),
});

export type SystemSetting = z.infer<typeof systemSettingSchema>;

export const updateSettingSchema = z.object({
  value: z.string(),
});

export type UpdateSettingRequest = z.infer<typeof updateSettingSchema>;
