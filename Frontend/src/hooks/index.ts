/**
 * Centralized hooks export
 * All custom hooks should be exported from here
 */

// Language and i18n hooks
export { useLanguage, type UseLanguageReturn, type Language } from "./useLanguage";
export { useLanguageToggle } from "./useLanguageToggle";

// Geolocation hooks
export { useGeolocation, type GeoStatus, type UseGeolocationReturn } from "./useGeolocation";

// Query hooks
export {
  useMenuData,
  useMenuCategory,
  useMenuItem,
} from "./queries/useMenuData";
export { usePageData } from "./queries/usePageData";
export { useNavigation } from "./queries/useNavigationData";
export { useLocations, useLocationsByRegion } from "./queries/useLocationData";
export { useFeaturedCards, useHero, useStatement } from "./queries/useFeaturedData";
export { useContactInfo } from "./queries/useContactData";

// Query prefetch hooks
export {
  usePrefetchMenuCategory,
  usePrefetchMenuItem,
  usePrefetchPage,
} from "./queries/usePrefetchMenuCategory";

// Utility hooks
export { usePrevious } from "./usePrevious";
export { useAutoScroll, useScrollToTop, useScrollPosition } from "./useAutoScroll";
export { useAccordion } from "./useAccordion";

// Auth hooks
export { useAuth } from "./auth/useAuth";

// Theme hooks (if exists)
// export { useTheme } from "./useTheme";
