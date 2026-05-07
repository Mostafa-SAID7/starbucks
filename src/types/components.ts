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

// Search Types
export interface SearchMenuItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  href: string;
  categoryTitle?: string;
  subcategoryTitle?: string;
}

export interface SearchSubcategory {
  id: string;
  title: string;
  image?: string;
  href?: string;
  items?: SearchMenuItem[];
}

export interface SearchCategory {
  id: string;
  title: string;
  description?: string;
  image?: string;
  href?: string;
  sidebarTitle?: string;
  subcategories?: SearchSubcategory[];
}

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

export interface VerticalCardAction {
  label: string;
  href: string;
  primary?: boolean;
}
