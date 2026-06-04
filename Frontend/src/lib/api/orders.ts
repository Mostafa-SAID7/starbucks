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
    try {
      const response = await apiClient.post<{ data: Order }>('/api/orders', order);
      return response.data.data;
    } catch (error) {
      console.warn('Falling back to mock order creation due to API failure', error);
      return {
        id: `mock-${Date.now()}`,
        orderNumber: `SBUX-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: 'current-user',
        items: (order.items || []) as any,
        total: order.total || 0,
        status: 'pending',
        locationId: order.locationId || 'default',
        orderType: order.orderType || 'pickup',
        paymentMethod: order.paymentMethod || 'cash',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Fetch order history for the current user
   */
  fetchOrders: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get<{ data: Order[] }>('/api/orders');
      return response.data.data;
    } catch (error) {
      console.warn('Falling back to empty orders list on API failure', error);
      return [];
    }
  },

  /**
   * Fetch a specific order by ID
   */
  fetchOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<{ data: Order }>(`/api/orders/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn('Generating mock order details for ID', id, error);
      return {
        id,
        orderNumber: `SBUX-${id.slice(-6).toUpperCase()}`,
        userId: 'current-user',
        items: [],
        total: 0,
        status: 'pending',
        locationId: 'default',
        orderType: 'pickup',
        paymentMethod: 'cash',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },
};
