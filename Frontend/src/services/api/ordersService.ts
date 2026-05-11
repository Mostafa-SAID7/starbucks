import { ApiService } from './ApiService';
import { Order } from '@/lib/schemas';

export class OrdersService extends ApiService {
  private static instance: OrdersService;

  public static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  public async getMyOrders(): Promise<Order[]> {
    return this.get<Order[]>('/orders/my');
  }

  public async getOrderById(id: string): Promise<Order> {
    return this.get<Order>(`/orders/${id}`);
  }

  public async createOrder(orderData: unknown): Promise<Order> {
    return this.post<Order>('/orders', orderData);
  }

  public async cancelOrder(id: string): Promise<void> {
    return this.post<void>(`/orders/${id}/cancel`, {});
  }
}

export const ordersService = OrdersService.getInstance();
