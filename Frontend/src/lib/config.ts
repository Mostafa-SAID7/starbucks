/**
 * Application Configuration
 * Centralized configuration management with environment-specific settings
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    retries: 3,
  },

  // App Information
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Starbucks Egypt',
    version: import.meta.env.VITE_APP_VERSION || '2.1.0',
    defaultLanguage: (import.meta.env.VITE_DEFAULT_LANGUAGE || 'ar') as 'ar' | 'en',
  },

  // Environment
  env: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  },

  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
    mockApi: import.meta.env.VITE_MOCK_API === 'true',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    serviceWorker: import.meta.env.VITE_ENABLE_SERVICE_WORKER !== 'false',
  },

  // External Services
  services: {
    googleMaps: {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    },
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
    },
  },

  // Cache Configuration
  cache: {
    version: import.meta.env.VITE_CACHE_VERSION || '1',
    defaultStaleTime: 5 * 60 * 1000, // 5 minutes
    defaultGcTime: 10 * 60 * 1000, // 10 minutes
  },

  // Performance Thresholds
  performance: {
    slowPageLoad: 3000, // 3 seconds
    slowQuery: 1000, // 1 second
    bundleSize: {
      warning: 5 * 1024 * 1024, // 5MB
      error: 10 * 1024 * 1024, // 10MB
    },
  },

  // Security
  security: {
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // UI Configuration
  ui: {
    animationDuration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
} as const;

/**
 * Validate required environment variables
 */
export function validateConfig() {
  const requiredVars = [
    'VITE_API_URL',
  ];

  const missing = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Get configuration for specific environment
 */
export function getEnvironmentConfig() {
  return {
    development: {
      logLevel: 'debug',
      enableDevTools: true,
      mockDelay: 500,
    },
    production: {
      logLevel: 'error',
      enableDevTools: false,
      mockDelay: 0,
    },
    test: {
      logLevel: 'silent',
      enableDevTools: false,
      mockDelay: 0,
    },
  }[config.env.nodeEnv] || {};
}

export default config;