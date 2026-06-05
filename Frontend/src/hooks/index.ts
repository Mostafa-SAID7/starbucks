/**
 * Centralized hooks export
 * All custom hooks should be exported from here to ensure consistent imports
 */

// Language and i18n hooks
export { useLanguage, type UseLanguageReturn, type Language } from "./i18n/useLanguage";

// Geolocation hooks
export { useGeolocation, type GeoStatus, type UseGeolocationReturn } from "./location/useGeolocation";

// Query hooks (Data Fetching)
export {
  useMenuData,
  useMenuCategory,
  useMenuItem,
} from "./queries/useMenuData";
export { usePageData } from "./queries/usePageData";
export { useNavigation } from "./queries/useNavigationData";
export { useLocations } from "./queries/useLocationData";
export { useFeaturedCards, useHero, useStatement } from "./queries/useFeaturedData";
export { useContactInfo } from "./queries/useContactData";

// Performance & Optimization hooks
export { usePrefetch } from "./performance/usePrefetch";
export { 
  usePerformanceMonitoring, 
  measureComponentRender, 
  measureFunction, 
  getPerformanceMetrics, 
  monitorLongTasks 
} from "./performance/usePerformanceMonitoring";

// Utility hooks
export { usePrevious } from "./common/usePrevious";
export { useOnlineStatus } from "./common/useOnlineStatus";
export { usePagination } from "./common/usePagination";
export {
  useInitialLoad,
  useStaleWhileRevalidate,
  useOptimisticUpdate,
  useRetryWithBackoff,
  type InitialLoadOptions,
} from "./common/useInitialLoad";

// UI & Interaction hooks
export { useAutoScroll, useScrollToTop, useScrollPosition } from "./ui/useAutoScroll";
export { useAccordion } from "./ui/useAccordion";
export { useTheme } from "./ui/useTheme";

// Accessibility hooks
export { useAnnounce } from "./accessibility/useAnnounce";
export { useFocusManagement } from "./accessibility/useFocusManagement";
export { useKeyboardNavigation, useFocusTrap, useArrowKeyNavigation } from "./accessibility/useKeyboardNavigation";

// Auth & Security hooks
export { useAuth } from "./auth/useAuth";

// Error monitoring hooks
export { useErrorHandling } from "./error/useErrorHandling";

// Form handling hooks
export { useFormHandler } from "./form/useFormHandler";
export { useFormValidation, useFieldValidation, useAsyncFormValidation } from "./form/useFormValidation";

// Business logic hooks
export { useOptimisticOrder } from "./business/useOptimisticOrder";
