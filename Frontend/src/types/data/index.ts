/**
 * Structural Data Types (Non-redundant)
 * Re-exported from centralized Zod schemas for consistency
 */

import { 
  NavigationItem as NavItemSchemaType,
  NavigationConfig as NavConfigSchemaType,
  MenuData as MenuDataSchemaType,
  MenuCategory as MenuCategorySchemaType,
  MenuSubcategory as MenuSubcategorySchemaType,
  MenuItem as MenuItemSchemaType,
  GenericPageData as GenericPageDataSchemaType,
  GenericSection as GenericSectionSchemaType,
  GenericTypeItem as GenericTypeItemSchemaType,
  GenericDefinition as GenericDefinitionSchemaType,
  GenericSubsection as GenericSubsectionSchemaType,
  GenericGroup as GenericGroupSchemaType,
  GenericContactInfo as GenericContactInfoSchemaType,
  GenericImageGrid as GenericImageGridSchemaType,
  Location as LocationSchemaType,
  Order as OrderSchemaType,
  OrderItem as OrderItemSchemaType,
  OrderStatus as OrderStatusSchemaType
} from '@/lib/schemas';

// Re-export inferred types to maintain backward compatibility with components
export type NavigationItem = NavItemSchemaType;
export type NavigationConfig = NavConfigSchemaType;
export type NavItem = NavItemSchemaType;
export type FooterLink = NavItemSchemaType;

export interface FooterSection {
  id: string;
  links: NavigationItem[];
}

export type MenuData = MenuDataSchemaType;
export type MenuCategory = MenuCategorySchemaType;
export type MenuSubcategory = MenuSubcategorySchemaType;
export type MenuItem = MenuItemSchemaType;

export type GenericPageData = GenericPageDataSchemaType;
export type GenericSection = GenericSectionSchemaType;
export type GenericTypeItem = GenericTypeItemSchemaType;
export type GenericDefinition = GenericDefinitionSchemaType;
export type GenericSubsection = GenericSubsectionSchemaType;
export type GenericGroup = GenericGroupSchemaType;
export type GenericContactInfo = GenericContactInfoSchemaType;
export type GenericImageGrid = GenericImageGridSchemaType;

export interface GenericPageProps {
  slug?: string;
  data: GenericPageData;
  seoTitle?: string;
  showAccordion?: boolean;
  accordionTitle?: unknown; // Using unknown for LocalizedText to avoid circular dep if common.ts is tricky
  accordionSectionIndices?: number[];
  useAccordionLayout?: boolean;
}

export interface GenericPageWrapperProps {
  slug: string;
  seoTitle?: string;
  showAccordion?: boolean;
  accordionTitle?: unknown;
  accordionSectionIndices?: number[];
  useAccordionLayout?: boolean;
}

export type Location = LocationSchemaType;
export type Order = OrderSchemaType;
export type OrderItem = OrderItemSchemaType;
export type OrderStatus = OrderStatusSchemaType;

// Keep UI-specific interfaces that don't belong in the data schema domain
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

export interface Social {
  name: string;
  href: string;
  icon?: string;
}

export interface Country {
  name: string;
  href: string;
}
