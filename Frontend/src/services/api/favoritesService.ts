import { ApiService } from './ApiService';
import { MenuItem } from '@/lib/schemas';

export class FavoritesService extends ApiService {
  private static instance: FavoritesService;

  public static getInstance(): FavoritesService {
    if (!FavoritesService.instance) {
      FavoritesService.instance = new FavoritesService();
    }
    return FavoritesService.instance;
  }

  public async getFavorites(): Promise<MenuItem[]> {
    return this.get<MenuItem[]>('/favorites');
  }

  public async addToFavorites(menuItemId: string): Promise<void> {
    return this.post<void>(`/favorites/${menuItemId}`, {});
  }

  public async removeFromFavorites(menuItemId: string): Promise<void> {
    return this.delete<void>(`/favorites/${menuItemId}`);
  }
}

export const favoritesService = FavoritesService.getInstance();
