/**
 * Centralized Cache Constants
 */
export const CACHE_TIMES = {
  /** Menu data changes infrequently (1 hour) */
  MENU_STALE: 60 * 60 * 1000,
  MENU_GC: 2 * 60 * 60 * 1000,
  
  /** Static page content changes very rarely (24 hours) */
  PAGE_STALE: 24 * 60 * 60 * 1000,
  PAGE_GC: 48 * 60 * 60 * 1000,
  
  /** Store locations (30 minutes) */
  LOCATION_STALE: 30 * 60 * 1000,
  LOCATION_GC: 60 * 60 * 1000,
  
  /** Navigation and header data (4 hours) */
  NAV_STALE: 4 * 60 * 60 * 1000,
  NAV_GC: 8 * 60 * 60 * 1000,
  
  /** Featured content (10 minutes) */
  FEATURED_STALE: 10 * 60 * 1000,
  FEATURED_GC: 20 * 60 * 1000,
  
  /** Default global settings */
  DEFAULT_STALE: 5 * 60 * 1000,
  DEFAULT_GC: 10 * 60 * 1000,
};

/**
 * Cache Cleanup Configuration
 */
export const CLEANUP_CONFIG = {
  INTERVAL: 5 * 60 * 1000, // 5 minutes
  STALE_AGE: 10 * 60 * 1000, // 10 minutes
  UNUSED_AGE: 15 * 60 * 1000, // 15 minutes
};

/**
 * API Constants
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "https://api.starbucks.eg",
  TIMEOUT: 10000,
  SIMULATED_DELAY: 500, // For development/mocking
};

/**
 * Shared Animation Constants
 */
export const ANIMATION_CONFIG = {
  /** Standard durations in ms (for CSS) */
  DURATION_MS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },

  /** Standard durations in seconds (for Framer Motion) */
  DURATION_SEC: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.5,
  },

  /** Standard easing */
  EASING: "cubic-bezier(0.4, 0, 0.2, 1)",

  /** Common framer-motion transitions */
  TRANSITIONS: {
    SPRING: { type: "spring", stiffness: 300, damping: 30 },
    BOUNCE: { type: "spring", stiffness: 400, damping: 10 },
    SMOOTH: { type: "tween", ease: "easeInOut", duration: 0.3 },
    ACCORDION: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
    QUICK_ROTATE: { duration: 0.3, ease: "circOut" },
    QUICK: { duration: 0.2, ease: "easeOut" },
  },

  /** Common animation variants */
  VARIANTS: {
    FADE_IN: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    SLIDE_UP: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    SCALE_IN: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    DIALOG: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 },
    },
    SLIDE_IN_RIGHT: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
    SLIDE_IN_LEFT: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
    },
  },
} as const;

/**
 * Performance Monitoring Thresholds & Targets
 */
export const PERFORMANCE_CONFIG = {
  // Thresholds for performance warnings (in ms)
  SLOW_PAGE_LOAD: 3000, // 3 seconds
  SLOW_QUERY: 1000, // 1 second
  SLOW_RENDER: 16, // 16ms (60fps)

  // Cache performance targets
  TARGET_CACHE_HIT_RATE: 80, // 80%

  // Bundle size targets (in bytes)
  TARGET_BUNDLE_SIZE: 7 * 1024 * 1024, // 7MB
  TARGET_GZIP_SIZE: 2 * 1024 * 1024, // 2MB
  TARGET_INITIAL_CHUNK: 1 * 1024 * 1024, // 1MB

  // Specific bundle budgets
  BUDGET: {
    FIRST_LOAD_JS: 512 * 1024, // 512KB
    ROUTE_CHUNK: 256 * 1024, // 256KB
    IMAGE_SIZE: 500 * 1024, // 500KB per image
    FONT_SIZE: 100 * 1024, // 100KB per font
  },
};
