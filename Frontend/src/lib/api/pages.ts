import { AppError, ErrorType } from '@/lib/error';
import type { GenericPageData } from "@/types";
import { simulateDelay } from "./client";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const pageFetchers = {
  async fetchPageBySlug(slug: string, language: string = 'en'): Promise<GenericPageData> {
    try {
      // Try Backend Resources API first (if page content is stored there)
      const response = await fetch(
        `${API_URL}/v1/resources/localization/${language}/pages/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        return data.resources as GenericPageData;
      }
    } catch (err) {
      console.warn(`Backend page API not available for ${slug}, trying local data`, err);
    }

    // Fallback to local JSON data
    await simulateDelay();

    const pageMap: Record<string, () => Promise<{ default: GenericPageData }>> = {
      "about-us": () => import("@/data/pages/about-us.json") as unknown as Promise<{ default: GenericPageData }>,
      sustainability: () => import("@/data/pages/sustainability.json") as unknown as Promise<{ default: GenericPageData }>,
      "community-impact": () => import("@/data/pages/community-impact.json") as unknown as Promise<{ default: GenericPageData }>,
      "new-era": () => import("@/data/pages/new-era.json") as unknown as Promise<{ default: GenericPageData }>,
      "our-coffees": () => import("@/data/pages/our-coffees.json") as unknown as Promise<{ default: GenericPageData }>,
      "terms-of-use": () => import("@/data/pages/terms-of-use.json") as unknown as Promise<{ default: GenericPageData }>,
      "privacy-statement": () => import("@/data/pages/privacy-statement.json") as unknown as Promise<{ default: GenericPageData }>,
      cookies: () => import("@/data/pages/cookies.json") as unknown as Promise<{ default: GenericPageData }>,
      delivery: () => import("@/data/pages/delivery.json") as unknown as Promise<{ default: GenericPageData }>,
      "middle-east": () => import("@/data/pages/middle-east.json") as unknown as Promise<{ default: GenericPageData }>,
    };

    const fetcher = pageMap[slug];
    if (!fetcher) {
      throw new AppError(`Page not found: ${slug}`, ErrorType.NOT_FOUND, 404);
    }

    const data = await fetcher();
    return data.default as GenericPageData;
  },
};
