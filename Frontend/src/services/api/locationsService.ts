/**
 * Locations API Service
 * All endpoints pass the active UI language so bilingual fields in
 * LocationDto (DisplayName, LocalizedAddress) are resolved server-side.
 */

import { apiService } from './index';
import { Location } from '@/lib/schemas';

export interface LocationsResponse {
  items: Location[];
  totalCount: number;
}

export interface CityInfo {
  city: string;
  locationCount: number;
  displayName: { english: string; arabic: string };
}

/**
 * Get all locations, resolved for a specific language.
 */
export const getAll = async (language: string = 'en'): Promise<Location[]> => {
  const response = await apiService.get<LocationsResponse>(
    `/api/v1/Locations?language=${language}`
  );
  return response.items;
};

/**
 * Get nearby locations.
 */
export const getNearby = async (
  lat: number,
  lng: number,
  radius: number = 10,
  language: string = 'en'
): Promise<Location[]> => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    radius: radius.toString(),
    language,
  });
  return apiService.get<Location[]>(`/api/v1/Locations/nearby?${params.toString()}`);
};

/**
 * Get all cities with bilingual display names.
 * Returns CityInfoDto[] which now includes { displayName: { english, arabic } }.
 */
export const getCities = async (): Promise<CityInfo[]> => {
  return apiService.get<CityInfo[]>('/api/v1/Locations/cities');
};

export const locationsService = { getAll, getNearby, getCities };
