import { LocalizedText } from "./index";

export interface GenericSection {
  id: string;
  title?: LocalizedText;
  subtitle?: LocalizedText;
  paragraphs?: LocalizedText[];
  list?: (LocalizedText & { link?: string })[];
  subsections?: {
    title?: LocalizedText;
    paragraphs?: LocalizedText[];
    list?: LocalizedText[];
  }[];
  types?: {
    id: string;
    label: LocalizedText;
    text: LocalizedText;
  }[];
  contactInfo?: {
    email: string;
    phone: string;
    phoneTel: string;
    address?: LocalizedText;
  };
  contactNote?: LocalizedText;
  definitions?: {
    term: LocalizedText;
    definition: LocalizedText;
  }[];
  groups?: {
    title: LocalizedText;
    paragraphs: LocalizedText[];
  }[];
  imageGrid?: {
    images: string[];
    columns?: 2 | 3 | 4;
    aspectRatio?: "square" | "video" | "portrait";
  };
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
    items?: {
      title: LocalizedText | string;
      content: LocalizedText | string;
    }[];
  };
}

export interface GenericPageData {
  title: LocalizedText;
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
