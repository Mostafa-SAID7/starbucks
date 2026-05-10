/**
 * Locations API Service
 * Handles all location-related API calls
 */

import { apiService } from './index';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface OperatingHours {
  [day: string]: {
    open: string;
    close: string;
  };
}

export interface Location {
  id: string;
  name: { en: string; ar: string };
  address: { en: string; ar: string };
  city: string;
  governorate: string;
  coordinates: Coordinates;
  features: string[];
  operatingHours: OperatingHours;
  phone?: string;
}

export interface LocationsResponse {
  locations: Location[];
}

/**
 * Get all locations
 */
export const getAll = async (): Promise<LocationsResponse> => {
  return apiService.get<LocationsResponse>('/locations');
};

/**
 * Get locations by city
 */
export const getByCity = async (city: string): Promise<LocationsResponse> => {
  const params = new URLSearchParams();
  params.append('city', city);

  return apiService.get<LocationsResponse>(`/locations?${params.toString()}`);
};

/**
 * Get nearby locations
 */
export const getNearby = async (
  lat: number,
  lng: number,
  radius: number = 10
): Promise<LocationsResponse> => {
  const params = new URLSearchParams();
  params.append('lat', lat.toString());
  params.append('lng', lng.toString());
  params.append('radius', radius.toString());

  return apiService.get<LocationsResponse>(`/locations/nearby?${params.toString()}`);
};

/**
 * Locations service object
 */
export const locationsService = {
  getAll,
  getByCity,
  getNearby,
};
