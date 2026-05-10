import { simulateDelay } from "./client";

export const locationFetchers = {
  async fetchLocations() {
    await simulateDelay();
    const locations = await import("@/data/locations/locations.json");
    return locations.default;
  },

  async fetchLocationsByRegion(region: string) {
    const locations = await this.fetchLocations();
    return locations.filter((loc: { slug: string }) => loc.slug === region);
  },
};
