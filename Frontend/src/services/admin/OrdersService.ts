import { ApiService } from '../api/ApiService';
import { Order } from '@/lib/schemas';

export class OrdersService extends ApiService {
  private static instance: OrdersService;

  public static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  public async getAllOrders(): Promise<Order[]> {
    return this.get<Order[]>('/admin/orders');
  }

  public async updateOrderStatus(id: string, status: string): Promise<Order> {
    return this.put<Order>(`/admin/orders/${id}/status`, { status });
  }

  public async getOrderDetails(id: string): Promise<Order> {
    return this.get<Order>(`/admin/orders/${id}`);
  }
}

export const ordersService = OrdersService.getInstance();
