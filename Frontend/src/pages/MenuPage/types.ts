import type { LocalizedContent } from "@/lib/schemas";

/* ── Flat item shape used across all MenuPage sub-components ────── */
export interface FlatItem {
  id: string;
  name: LocalizedContent; // Now uses { English, Arabic } instead of nameAr
  description: LocalizedContent;
  price: number;
  image: string;
  href: string;
  category: string;
  categoryId: string;
  isNew?: boolean;
}
