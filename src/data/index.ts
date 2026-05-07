// Centralized data exports — single source of truth
// Translations live in src/locales/ (i18next)
// Structural data (URLs, images, content) lives here

import menu from "./menu.json";
import navigation from "./navigation.json";
import hero from "./hero.json";
import statement from "./statement.json";
import featuredCards from "./featured-cards.json";
import aboutUs from "./about-us.json";
import sustainability from "./sustainability.json";
import middleEast from "./middle-east.json";
import termsOfUse from "./terms-of-use.json";
import privacyStatement from "./privacy-statement.json";
import delivery from "./delivery.json";
import cookies from "./cookies.json";
import communityImpact from "./community-impact.json";
import newEra from "./new-era.json";
import ourCoffees from "./our-coffees.json";
import contactUs from "./contact-us.json";

export {
  // Navigation — structural data (URLs, socials, countries)
  navigation,

  // Menu — categories with items, images, hrefs (bilingual labels inside)
  menu,

  // Home page sections
  hero,
  statement,
  featuredCards,

  // Generic pages — bilingual structured content by slug
  aboutUs,
  sustainability,
  middleEast,
  termsOfUse,
  privacyStatement,
  delivery,
  cookies,
  communityImpact,
  newEra,
  ourCoffees,

  // Contact — contact form data and info
  contactUs,
};
