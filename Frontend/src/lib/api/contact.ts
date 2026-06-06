import { simulateDelay } from "./client";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const contactFetchers = {
  async fetchContactInfo(language: string = 'en') {
    try {
      // Try Backend Resources API first
      const response = await fetch(
        `${API_URL}/v1/resources/localization/${language}/common`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.resources.contact) {
          return data.resources.contact;
        }
      }
    } catch (err) {
      console.warn('Backend contact API not available, using local data', err);
    }

    // Fallback to local JSON data
    await simulateDelay();
    const contactUs = await import("@/data/contact/contact-us.json");
    return contactUs.default;
  },
};
