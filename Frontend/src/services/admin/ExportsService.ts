import { ApiService } from '../api/ApiService';

export class ExportsService extends ApiService {
  private static instance: ExportsService;

  public static getInstance(): ExportsService {
    if (!ExportsService.instance) {
      ExportsService.instance = new ExportsService();
    }
    return ExportsService.instance;
  }

  public async exportOrders(): Promise<Blob> {
    return this.getBlob('/admin/exports/orders');
  }

  public async exportUsers(): Promise<Blob> {
    return this.getBlob('/admin/exports/users');
  }

  private async getBlob(url: string): Promise<Blob> {
    const response = await this.getClient().get(url, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const exportsService = ExportsService.getInstance();
