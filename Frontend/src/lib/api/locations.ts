import { locationsService } from "@/services/api/locationsService";
import type { Location } from "@/types";

export const locationFetchers = {
  /**
   * Fetch all locations from the API
   */
  async fetchLocations(): Promise<Location[]> {
    return locationsService.getAll();
  },

  /**
   * Fetch locations filtered by region/slug
   */
  async fetchLocationsByRegion(region: string): Promise<Location[]> {
    return locationsService.getByCity(region);
  },

  /**
   * Fetch unique cities where stores are located
   */
  async fetchCities(): Promise<string[]> {
    return locationsService.getCities();
  },
};
