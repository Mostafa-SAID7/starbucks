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
  id: string | number
  title: string
  description?: string
  image: string
  imageAlt: string
  cta: string
  ctaLink: string
  secondaryCta?: string
  secondaryCtaLink?: string
  theme?: 'Green' | 'Gray' | string | null
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

// Search Types
export interface SearchResult {
  id: string
  title: string
  description?: string
  category: string
  href: string
  image?: string
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price?: number
  calories?: number
  image: string
  category: string
  allergens?: string[]
}
