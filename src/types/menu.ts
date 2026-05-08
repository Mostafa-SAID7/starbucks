/**
 * Structural Menu Types (Localized labels are handled via i18next namespaces)
 */

export interface MenuItem {
  id: string;
  image: string;
  href: string;
}

export interface MenuSubcategory {
  id: string;
  image?: string;
  href: string;
  /** Present on item-level pages */
  items?: MenuItem[];
}

export interface MenuCategory {
  id: string;
  image?: string;
  href?: string;
  subcategories?: MenuSubcategory[];
}

export interface AllergyInfoType {
  title?: string;
  description?: string;
  link: string;
  linkLabel?: string;
}

export interface SidebarAction {
  id?: string;
  label?: string;
  href: string;
  primary?: boolean;
  variant?: "primary" | "secondary";
}

export interface SidebarData {
  image: string;
  actions: SidebarAction[];
}

export interface MenuData {
  categories: MenuCategory[];
  allergyInfo: AllergyInfoType;
  sidebar: SidebarData;
}

/**
 * Legacy type for transition support if needed
 * @deprecated Use MenuData and i18next namespaces instead
 */
export interface MenuDataWithLanguages {
  ar: MenuData;
  en: MenuData;
}
