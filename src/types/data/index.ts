/**
 * Structural Data Types (Non-redundant)
 */

import { LocalizedText } from "../common";

/** Navigation Configuration */
export interface NavigationItem {
  id: string;
  href: string;
  icon?: string;
  slug?: string | null;
  isExternal?: boolean;
}

export interface NavigationConfig {
  navbar: {
    links: NavigationItem[];
  };
  footer: {
    sections: {
      id: string;
      links: NavigationItem[];
    }[];
    legal: NavigationItem[];
    socials: { name: string; href: string; icon?: string }[];
    app?: any;
    countries?: any;
  };
}

export type FooterLink = NavigationItem;
export type NavItem = NavigationItem;
export interface FooterSection {
  id: string;
  links: NavigationItem[];
}
export interface Country {
  id: string;
  name: string;
  flag: string;
  href: string;
}
export interface Social {
  name: string;
  href: string;
  icon?: string;
}

/** Menu Structure Types */
export interface MenuItem {
  id: string;
  href: string;
  image: string;
  isNew?: boolean;
}

export interface MenuSubcategory {
  id: string;
  href: string;
  image?: string;
  items?: MenuItem[];
}

export interface MenuCategory {
  id: string;
  href?: string;
  image?: string;
  subcategories?: MenuSubcategory[];
  [key: string]: any;
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
  allergyInfo?: AllergyInfoType;
  sidebar?: SidebarData;
  [key: string]: any;
}

/** Generic Page Structure Types */
export interface GenericSection {
  id: string;
  title?: string | LocalizedText;
  subtitle?: string | LocalizedText;
  paragraphs?: (string | LocalizedText)[];
  list?: (string | LocalizedText)[];
  image?: string | LocalizedText;
  layout?: "standard" | "split" | "centered";
  imagePosition?: "left" | "right";
  cta?: string | LocalizedText;
  ctaLink?: string;
  note?: string | LocalizedText;
  videoUrl?: string;
  imageGrid?: {
    images: string[];
    columns?: number;
  };
  [key: string]: any; 
}

export interface GenericPageData {
  slug: string;
  title?: string | LocalizedText;
  subtitle?: string | LocalizedText;
  lastUpdated?: string | LocalizedText;
  layoutType?: "sidebar" | "alternating" | "standard";
  sidebarImage?: string | LocalizedText;
  hideMainTitle?: boolean;
  hero?: {
    title: string | LocalizedText;
    description?: string | LocalizedText;
    image: string | LocalizedText;
    cta?: string | LocalizedText;
    ctaLink?: string;
  };
  intro?: {
    title?: string | LocalizedText;
    paragraphs?: (string | LocalizedText)[];
    image?: string | LocalizedText;
  };
  accordion?: {
    title?: string | LocalizedText;
    items: {
      title: string | LocalizedText;
      content: string | LocalizedText;
    }[];
  };
  sections: GenericSection[];
  [key: string]: any;
}

export interface GenericPageProps {
  slug?: string;
  data: GenericPageData;
  seoTitle?: string;
  showAccordion?: boolean;
  accordionTitle?: LocalizedText;
  accordionSectionIndices?: number[];
  useAccordionLayout?: boolean;
}

export interface GenericPageWrapperProps {
  slug: string;
  seoTitle?: string;
  showAccordion?: boolean;
  accordionTitle?: LocalizedText;
  accordionSectionIndices?: number[];
  useAccordionLayout?: boolean;
}

export interface GenericContactInfo {
  id: string;
  type: string;
  value: string;
  label?: string | LocalizedText;
  icon?: string;
  address?: string | LocalizedText;
  link?: string;
  email?: string;
  phone?: string;
  phoneTel?: string;
}

export interface GenericImageGrid {
  images: string[];
  columns?: number;
  aspectRatio?: "square" | "video" | "portrait";
}

export interface GenericGroup {
  title: LocalizedText;
  paragraphs: LocalizedText[];
}

export interface GenericSubsection {
  title?: LocalizedText;
  paragraphs?: (string | LocalizedText)[];
  list?: (string | LocalizedText)[];
}

export interface GenericTypeItem {
  id: string;
  label: LocalizedText;
  text: LocalizedText;
}

export interface GenericDefinition {
  term: LocalizedText;
  definition: LocalizedText;
}
