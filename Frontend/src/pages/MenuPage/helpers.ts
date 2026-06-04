import type { MenuCategory } from "@/types";
import type { FlatItem } from "./types";

/**
 * Flattens all nested category → subcategory → item
 * structures into a single array of FlatItem objects.
 */
export function flattenItems(categories: MenuCategory[]): FlatItem[] {
  const result: FlatItem[] = [];

  for (const cat of categories) {
    for (const sub of cat.subcategories ?? []) {
      for (const item of sub.items ?? []) {
        const raw = item as unknown as Record<string, unknown>;
        result.push({
          id: String(item.id),
          name: (raw.name as string) || item.id,
          nameAr: raw.nameAr as string | undefined,
          description: (raw.description as string) || "",
          descriptionAr: raw.descriptionAr as string | undefined,
          price: (raw.price as number) || 0,
          image: item.image,
          href: String(raw.href ?? item.href ?? ""),
          category: (raw.category as string) || cat.id,
          categoryId: cat.id,
          isNew: item.isNew,
        });
      }
    }
  }

  return result;
}

/**
 * Returns a human-readable label for a category ID,
 * with RTL support.
 */
export function getCategoryLabel(catId: string, isRTL: boolean): string {
  if (catId === "drinks") return isRTL ? "المشروبات" : "Drinks";
  if (catId === "food") return isRTL ? "المأكولات" : "Food";
  return catId;
}
