import { ApiService } from './ApiService';
import { HomeBanner } from '@/lib/schemas';

export class BannersService extends ApiService {
  private static instance: BannersService;

  public static getInstance(): BannersService {
    if (!BannersService.instance) {
      BannersService.instance = new BannersService();
    }
    return BannersService.instance;
  }

  public async getActiveBanners(): Promise<HomeBanner[]> {
    return this.get<HomeBanner[]>('/banners');
  }
}

export const bannersService = BannersService.getInstance();
