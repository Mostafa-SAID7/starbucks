/* ── Flat item shape used across all MenuPage sub-components ────── */
export interface FlatItem {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  image: string;
  href: string;
  category: string;
  categoryId: string;
  isNew?: boolean;
}
