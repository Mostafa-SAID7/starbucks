import { apiClient } from './client';
import type { Order } from '@/lib/schemas';

/**
 * Order-related API fetchers
 */
export const orderFetchers = {
  /**
   * Create a new order
   */
  createOrder: async (order: Partial<Order>): Promise<Order> => {
    const response = await apiClient.post<{ data: Order }>('/api/orders', order);
    return response.data.data;
  },

  /**
   * Fetch order history for the current user
   */
  fetchOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<{ data: Order[] }>('/api/orders');
    return response.data.data;
  },

  /**
   * Fetch a specific order by ID
   */
  fetchOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<{ data: Order }>(`/api/orders/${id}`);
    return response.data.data;
  },
};
