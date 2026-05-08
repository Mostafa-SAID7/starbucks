import { LocalizedText } from "./index";

export interface GenericSubsection {
  title?: LocalizedText;
  paragraphs?: LocalizedText[];
  list?: LocalizedText[];
}

export interface GenericTypeItem {
  id: string;
  label: LocalizedText;
  text: LocalizedText;
}

export interface GenericContactInfo {
  email: string;
  phone: string;
  phoneTel: string;
  address?: LocalizedText;
}

export interface GenericDefinition {
  term: LocalizedText;
  definition: LocalizedText;
}

export interface GenericGroup {
  title: LocalizedText;
  paragraphs: LocalizedText[];
}

export interface GenericImageGrid {
  images: string[];
  columns?: 2 | 3 | 4;
  aspectRatio?: "square" | "video" | "portrait";
}

export interface GenericAccordionItem {
  title: LocalizedText | string;
  content: LocalizedText | string;
}

export interface GenericSection {
  id: string;
  title?: LocalizedText;
  subtitle?: LocalizedText;
  paragraphs?: LocalizedText[];
  list?: (LocalizedText & { link?: string })[];
  subsections?: GenericSubsection[];
  types?: GenericTypeItem[];
  contactInfo?: GenericContactInfo;
  contactNote?: LocalizedText;
  definitions?: GenericDefinition[];
  groups?: GenericGroup[];
  imageGrid?: GenericImageGrid;
  // New layout options
  layout?: "standard" | "split" | "centered";
  image?: string | LocalizedText;
  imagePosition?: "left" | "right";
  cta?: LocalizedText;
  ctaLink?: string;
  videoUrl?: string;
  note?: LocalizedText;
  hideSideBorder?: boolean;
  accordion?: {
    title?: LocalizedText;
    items?: GenericAccordionItem[];
  };
}

export interface GenericPageData {
  slug?: string;
  title?: LocalizedText;
  subtitle?: LocalizedText;
  lastUpdated?: LocalizedText;
  updateNote?: LocalizedText;
  hero?: {
    title: LocalizedText;
    description?: LocalizedText;
    image: string | LocalizedText;
    cta?: LocalizedText;
    ctaLink?: string;
  };
  intro?: {
    title?: LocalizedText;
    paragraphs?: LocalizedText[];
    image?: string | LocalizedText;
  };
  sections: GenericSection[];
  accordion?: {
    title?: LocalizedText;
    items?: {
      title: LocalizedText | string;
      content: LocalizedText | string;
    }[];
  };
  sidebarImage?: string | LocalizedText;
  layoutType?: "sidebar" | "alternating" | "standard";
  hideMainTitle?: boolean;
}

export interface GenericPageProps {
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
  accordionTitle?: { ar: string; en: string };
  accordionSectionIndices?: number[];
  useAccordionLayout?: boolean;
}
