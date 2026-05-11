import { ApiService } from './ApiService';
import { Notification } from '@/lib/schemas';

export class NotificationsService extends ApiService {
  private static instance: NotificationsService;

  public static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  public async getMyNotifications(): Promise<Notification[]> {
    return this.get<Notification[]>('/notifications');
  }

  public async markAsRead(id: string): Promise<void> {
    return this.post<void>(`/notifications/${id}/read`, {});
  }

  public async markAllAsRead(): Promise<void> {
    return this.post<void>('/notifications/read-all', {});
  }
}

export const notificationsService = NotificationsService.getInstance();
