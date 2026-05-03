// Navigation Types
export interface NavItem {
  label: string
  href: string
}

export interface NavbarData {
  menuItems: NavItem[]
  actions: {
    location: string
    cart: string
    login: string
    findStore: string
  }
}
