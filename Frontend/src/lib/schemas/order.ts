import { z } from 'zod';

/**
 * Order validation schemas
 */

export const OrderItemSchema = z.object({
  id: z.string(),
  menuItemId: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  customizations: z.record(z.string(), z.any()).optional(),
});

export const OrderStatusSchema = z.enum([
  'pending', 
  'confirmed', 
  'preparing', 
  'ready', 
  'completed', 
  'cancelled'
]);

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(OrderItemSchema),
  status: OrderStatusSchema,
  total: z.number(),
  locationId: z.string(),
  orderType: z.enum(['pickup', 'delivery']),
  paymentMethod: z.string(),
  specialInstructions: z.string().optional(),
  scheduledTime: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type Order = z.infer<typeof OrderSchema>;
