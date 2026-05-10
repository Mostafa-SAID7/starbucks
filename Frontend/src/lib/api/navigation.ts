import type { NavigationConfig } from "@/types";
import { simulateDelay } from "./client";

export const navigationFetchers = {
  async fetchNavigation(): Promise<NavigationConfig> {
    await simulateDelay();
    const navigation = await import("@/data/navigation/navigation.json");
    return navigation.default as unknown as NavigationConfig;
  },
};
