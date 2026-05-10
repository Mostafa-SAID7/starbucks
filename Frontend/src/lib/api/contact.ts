import { simulateDelay } from "./client";

export const contactFetchers = {
  async fetchContactInfo() {
    await simulateDelay();
    const contactUs = await import("@/data/contact/contact-us.json");
    return contactUs.default;
  },
};
