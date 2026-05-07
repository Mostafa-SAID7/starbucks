// ─── Shared Menu Types ────────────────────────────────────────────────────────
export interface MenuItem {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface MenuSubcategory {
  id: string;
  title: string;
  image?: string;
  href: string;
  /** Present on item-level pages */
  items?: MenuItem[];
}

export interface MenuCategory {
  id: string;
  title: string;
  description?: string;
  sidebarTitle?: string;
  image?: string;
  href?: string;
  subcategories?: MenuSubcategory[];
}

export interface AllergyInfoType {
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

export interface SidebarAction {
  label: string;
  href: string;
  primary: boolean;
}

export interface SidebarData {
  title: string;
  image: string;
  actions: SidebarAction[];
}

export interface MenuData {
  title: string;
  description: string;
  categories: MenuCategory[];
  allergyInfo: AllergyInfoType;
  sidebar: SidebarData;
}
