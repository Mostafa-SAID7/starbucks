// Navigation Types
export interface MenuItem {
  label: string
  href: string
}

export interface NavbarData {
  menuItems: MenuItem[]
  actions: {
    location: string
    cart: string
    login: string
    findStore: string
  }
}

// Hero Banner Types
export interface HeroBannerData {
  title: string
  description: string
  ctaText: string
  ctaLink: string
  imageUrl: string
  imageAlt: string
}

// Statement Section Types
export interface StatementData {
  title: string
  subtitle: string
  paragraphs: string[]
  ctaText: string
  ctaLink: string
}

// Featured Card Types
export interface FeaturedCard {
  id: number
  title: string
  description?: string
  image: string
  imageAlt: string
  cta: string
  ctaLink: string
  secondaryCta?: string
  secondaryCtaLink?: string
  theme?: 'Green' | 'Gray' | null
}

export interface FeaturedCardsData {
  cards: FeaturedCard[]
}

// Footer Types
export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterData {
  sections: {
    [key: string]: FooterSection
  }
  countries: string[]
  copyright: string
  locationSelector: string
}

// Theme Types
export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}
