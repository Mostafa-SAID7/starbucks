import { ApiService } from '../api/ApiService';
import { Location } from '@/lib/schemas';

export class LocationsService extends ApiService {
  private static instance: LocationsService;

  public static getInstance(): LocationsService {
    if (!LocationsService.instance) {
      LocationsService.instance = new LocationsService();
    }
    return LocationsService.instance;
  }

  public async getAllLocations(): Promise<Location[]> {
    return this.get<Location[]>('/admin/locations');
  }

  public async createLocation(request: unknown): Promise<Location> {
    return this.post<Location>('/admin/locations', request);
  }

  public async updateLocation(id: string, request: unknown): Promise<Location> {
    return this.put<Location>(`/admin/locations/${id}`, request);
  }

  public async deleteLocation(id: string): Promise<void> {
    return this.delete<void>(`/admin/locations/${id}`);
  }
}

export const locationsService = LocationsService.getInstance();
