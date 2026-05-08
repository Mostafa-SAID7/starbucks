/**
 * Component-specific Prop Types
 */

import { LocalizedText } from '../common';

// Hero Banner Types
export interface HeroBannerData {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imageAlt: string;
  secondaryImageUrls?: Record<string, string>;
}

// Statement Section Types
export interface StatementData {
  title: string;
  subtitle: string;
  paragraphs: string[];
  ctaText: string;
  ctaLink: string;
}

// Featured Card Types
export interface FeaturedCard {
  id: string | number;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  cta: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  theme?: "Green" | "Gray" | string | null;
}

export interface FeaturedCardData {
  id: string;
  image: string;
  theme?: "Green" | "Gray" | string;
  ctaLink: string;
  secondaryCtaLink?: string;
}

export interface FeaturedCardsData {
  cards: FeaturedCard[] | FeaturedCardData[];
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
  id: string;
  title: string;
  description?: string;
  category: string;
  href: string;
  image?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  calories?: number;
  image: string;
  category: string;
  allergens?: string[];
}

// Card Action Types
export interface VerticalCardAction {
  id?: string;
  label: string;
  href: string;
  primary?: boolean;
  variant?: "primary" | "secondary";
}

// UI Component Props
export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LiveRegionProps {
  message?: string;
  politeness?: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all";
}

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface SectionBackgroundProps {
  className?: string;
  variant?: "green" | "neutral" | "default";
}

export interface VerticalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  actions?: VerticalCardAction[];
  className?: string;
}

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CookiePreferences {
  functional: boolean;
  advertising: boolean;
}

export interface MenuGridProps {
  categories: any[]; // Use proper MenuCategory type from data types
}

export interface FeaturedCardProps {
  id: string;
  image: string;
  theme?: "Green" | "Gray" | string;
  ctaLink: string;
  secondaryCtaLink?: string;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface StaticSectionProps {
  title?: LocalizedText;
  children: React.ReactNode;
}

export interface StaticPageLayoutProps {
  title: LocalizedText;
  headerSubtitle?: LocalizedText;
  children: React.ReactNode;
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  variant?: "full" | "compact";
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  variant?: "full" | "compact";
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

// Generic Section Component Props
export interface SectionTypesProps {
  types: any[]; // Use proper GenericTypeItem type from data types
  lang: "ar" | "en";
}

export interface SectionDefinitionsProps {
  definitions: any[]; // Use proper GenericDefinition type from data types
  lang: "ar" | "en";
}

export interface SectionSubsectionsProps {
  subsections: any[]; // Use proper GenericSubsection type from data types
  lang: "ar" | "en";
}

export interface SectionParagraphsProps {
  paragraphs: (LocalizedText | string)[];
  lang: "ar" | "en";
}

export interface SectionRendererProps {
  section: any; // Use proper GenericSection type from data types
  lang: "ar" | "en";
}

export interface SectionListProps {
  list: ((LocalizedText & { link?: string }) | string)[];
  lang: "ar" | "en";
}

export interface SectionGroupsProps {
  groups: any[]; // Use proper GenericGroup type from data types
  lang: "ar" | "en";
}

export interface SectionContactInfoProps {
  contactInfo: any; // Use proper GenericContactInfo type from data types
  contactNote?: LocalizedText;
}

export interface SectionImageGridProps {
  imageGrid: any; // Use proper GenericImageGrid type from data types
  pageTitle: string;
}
