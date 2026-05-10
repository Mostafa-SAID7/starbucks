import { AppError, ErrorType } from '@/lib/error';
import type { GenericPageData } from "@/types";
import { simulateDelay } from "./client";

export const pageFetchers = {
  async fetchPageBySlug(slug: string): Promise<GenericPageData> {
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
