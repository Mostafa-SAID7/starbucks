// ─── Shared Menu Types ────────────────────────────────────────────────────────
export interface MenuItem {
  id: string
  title: string
  description: string
  image: string
  href: string
}

export interface MenuSubcategory {
  id: string
  title: string
  image?: string
  href: string
  /** Present on item-level pages */
  items?: MenuItem[]
}

export interface MenuCategory {
  id: string
  title: string
  description?: string
  sidebarTitle?: string
  image?: string
  subcategories?: MenuSubcategory[]
}

export interface MenuData {
  title: string
  description: string
  categories: MenuCategory[]
  allergyInfo: {
    title: string
    description: string
    link: string
    linkLabel: string
  }
  sidebar: {
    title: string
    image: string
    actions: {
      label: string
      href: string
      primary: boolean
    }[]
  }
}
