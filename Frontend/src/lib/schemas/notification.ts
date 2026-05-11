import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const notificationSchema = z.object({
  id: z.string().uuid(),
  title: LocalizedTextSchema,
  message: LocalizedTextSchema,
  type: z.enum(['Info', 'Promotion', 'System', 'Alert']),
  isRead: z.boolean(),
  createdAt: z.string().datetime(),
  actionUrl: z.string().optional(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const broadcastNotificationSchema = z.object({
  title: LocalizedTextSchema,
  message: LocalizedTextSchema,
  type: z.enum(['Info', 'Promotion', 'System', 'Alert']),
  actionUrl: z.string().optional(),
});

export type BroadcastNotificationRequest = z.infer<typeof broadcastNotificationSchema>;
