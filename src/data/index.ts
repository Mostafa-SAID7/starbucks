// Centralized data exports - using core structure where available
// This eliminates duplications and provides a single source of truth

// Core data imports (preferred structure)
import coreMenu from "./core/menu.json";
import corePages from "./core/pages.json";
import coreNavigation from "./core/navigation.json";
import coreFeatured from "./core/featured.json";
import coreContact from "./core/contact.json";
import coreLocations from "./core/locations.json";

// Individual imports (for backward compatibility)
import individualMenu from "./menu.json";
import individualNavbar from "./navbar.json";
import individualFooter from "./footer.json";
import individualHero from "./hero.json";
import individualStatement from "./statement.json";
import individualFeaturedCards from "./featured-cards.json";
import individualPages from "./pages.json";
import cookies from "./cookies.json";
import aboutUs from "./about-us.json";
import sustainability from "./sustainability.json";
import middleEast from "./middle-east.json";
import termsOfUse from "./terms-of-use.json";
import privacyStatement from "./privacy-statement.json";
import delivery from "./delivery.json";
import communityImpact from "./community-impact.json";
import newEra from "./new-era.json";
import ourCoffees from "./our-coffees.json";

// Use individual files for now (they have the complete structure with translations)
// TODO: Migrate to core structure gradually
export {
  // Main exports (using individual files for backward compatibility)
  individualMenu as menu,
  individualNavbar as navbar,
  individualFooter as footer,
  individualHero as hero,
  individualStatement as statement,
  individualFeaturedCards as featuredCards,
  individualPages as pages,

  // Contact uses core (already updated)
  coreContact as contactUs,

  // Individual page exports
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

  // Core exports (for future use)
  coreMenu,
  corePages,
  coreNavigation,
  coreFeatured,
  coreContact,
  coreLocations,
};
