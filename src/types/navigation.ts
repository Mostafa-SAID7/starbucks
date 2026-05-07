// Navigation Types
export interface NavItem {
  id: string;
  href: string;
  slug?: string | null;
}

export interface FooterLink {
  id: string;
  href: string;
}

export interface FooterSection {
  id: string;
  links: FooterLink[];
}

export interface Social {
  name: string;
  href: string;
}

export interface Country {
  name: string;
  href: string;
}

export interface NavbarData {
  links: NavItem[];
}

export interface FooterData {
  sections: FooterSection[];
  legal: FooterLink[];
  app: {
    appStore: string;
    googlePlay: string;
  };
  socials: Social[];
  countries: Country[];
}

export interface NavigationConfig {
  navbar: NavbarData;
  footer: FooterData;
}
