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
  'pending', 'Pending',
  'confirmed', 'Confirmed',
  'preparing', 'Preparing',
  'ready', 'Ready',
  'completed', 'Completed',
  'cancelled', 'Cancelled',
  'shipped', 'Shipped',
  'delivered', 'Delivered'
]);

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  userId: z.string(),
  items: z.array(OrderItemSchema),
  status: OrderStatusSchema,
  total: z.number(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  deliveryFee: z.number().optional(),
  discount: z.number().optional(),
  locationId: z.string().optional(),
  orderType: z.enum(['pickup', 'delivery']).optional(),
  paymentMethod: z.string(),
  notes: z.string().optional(),
  deliveryAddress: z.string().optional(),
  scheduledTime: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type Order = z.infer<typeof OrderSchema>;
