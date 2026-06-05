/**
 * Locations API Service
 * Handles all location-related API calls to the backend
 */

import { apiService } from './index';
import { Location } from '@/lib/schemas';

export interface LocationsResponse {
  items: Location[];
  totalCount: number;
}

/**
 * Get all locations
 */
export const getAll = async (): Promise<Location[]> => {
  const response = await apiService.get<LocationsResponse>('/api/v1/Locations');
  return response.items;
};

/**
 * Get nearby locations
 */
export const getNearby = async (
  lat: number,
  lng: number,
  radius: number = 10
): Promise<Location[]> => {
  const params = new URLSearchParams();
  params.append('latitude', lat.toString());
  params.append('longitude', lng.toString());
  params.append('radius', radius.toString());

  return apiService.get<Location[]>(`/api/v1/Locations/nearby?${params.toString()}`);
};

/**
 * Locations service object
 */
export const locationsService = {
  getAll,
  getNearby,
};
