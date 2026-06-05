import { locationsService } from "@/services/api/locationsService";
import type { Location } from "@/types";
import { mockStores } from "@/data/locations/mockStores";

export const locationFetchers = {
  /**
   * Fetch all locations from the API, fall back to local mock data if backend
   * is unreachable (e.g. development without a running backend).
   */
  async fetchLocations(): Promise<Location[]> {
    try {
      return await locationsService.getAll();
    } catch {
      console.warn('Falling back to mock store data due to API failure');
      return mockStores;
    }
  },
};
