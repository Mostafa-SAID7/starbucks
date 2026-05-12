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
 * Get locations by city
 */
export const getByCity = async (city: string): Promise<Location[]> => {
  const response = await apiService.get<LocationsResponse>(`/api/v1/Locations/cities/${city}`);
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
 * Get city info
 */
export const getCities = async (): Promise<string[]> => {
  return apiService.get<string[]>('/api/v1/Locations/cities');
};

/**
 * Locations service object
 */
export const locationsService = {
  getAll,
  getByCity,
  getNearby,
  getCities,
};
