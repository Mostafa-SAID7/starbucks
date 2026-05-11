import { ApiService } from '../api/ApiService';
import { HomeBanner, CreateBannerRequest, UpdateBannerRequest } from '@/lib/schemas';

export class BannersService extends ApiService {
  private static instance: BannersService;

  public static getInstance(): BannersService {
    if (!BannersService.instance) {
      BannersService.instance = new BannersService();
    }
    return BannersService.instance;
  }

  public async getAllBanners(): Promise<HomeBanner[]> {
    return this.get<HomeBanner[]>('/admin/banners');
  }

  public async createBanner(request: CreateBannerRequest): Promise<HomeBanner> {
    return this.post<HomeBanner>('/admin/banners', request);
  }

  public async updateBanner(id: string, request: UpdateBannerRequest): Promise<HomeBanner> {
    return this.put<HomeBanner>(`/admin/banners/${id}`, request);
  }

  public async deleteBanner(id: string): Promise<void> {
    return this.delete<void>(`/admin/banners/${id}`);
  }
}

export const bannersService = BannersService.getInstance();
