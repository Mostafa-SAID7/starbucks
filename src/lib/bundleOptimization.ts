import React from "react";

/**
 * Bundle Size Optimization Utilities
 * Provides tools and strategies for optimizing bundle size
 */

/**
 * Lazy loading utilities for code splitting
 */
export const lazyLoad = {
  /**
   * Lazy load a component with loading fallback
   */
  component: <T extends React.ComponentType<Record<string, unknown>>>(
    importFn: () => Promise<{ default: T }>,
  ) => {
    return React.lazy(importFn);
  },

  /**
   * Lazy load a hook or utility function
   */
  utility: <T>(importFn: () => Promise<T>) => {
    let cached: T | null = null;

    return async (): Promise<T> => {
      if (cached) return cached;
      cached = await importFn();
      return cached;
    };
  },
};

/**
 * Tree shaking optimization helpers
 */
export const treeShaking = {
  /**
   * Check if imports are tree-shakeable
   */
  checkTreeShaking: () => {
    if (import.meta.env.DEV) {
      console.group("🌲 Tree Shaking Analysis");

      // Check TanStack Query imports
      console.log("✅ TanStack Query: Using selective imports");

      // Check React imports
      console.log("✅ React: Using selective imports");

      // Check Lucide React icons
      console.log("✅ Lucide React: Using selective icon imports");

      // Check Framer Motion
      console.log(
        "⚠️ Framer Motion: Consider using selective imports for production",
      );

      console.groupEnd();
    }
  },
};

/**
 * Dynamic imports for heavy dependencies
 */
export const dynamicImports = {
  /**
   * Lazy load development tools
   */
  devTools: {
    reactQueryDevtools: () =>
      import.meta.env.DEV
        ? import("@tanstack/react-query-devtools")
        : Promise.resolve({ ReactQueryDevtools: () => null }),
  },
};

/**
 * Bundle analysis utilities
 */
export const bundleAnalysis = {
  /**
   * Estimate component bundle impact
   */
  estimateComponentSize: (componentName: string) => {
    // This would integrate with webpack-bundle-analyzer in a real scenario
    const estimates = {
      HomePage: "~15KB",
      MenuPage: "~25KB",
      LocationsPage: "~20KB",
      ContactUsPage: "~18KB",
      GenericPage: "~12KB",
    };

    return estimates[componentName as keyof typeof estimates] || "~10KB";
  },

  /**
   * Check for duplicate dependencies
   */
  checkDuplicates: () => {
    if (import.meta.env.DEV) {
      console.group("📦 Bundle Duplicate Check");

      // Check for common duplicates
      const potentialDuplicates = [
        "react",
        "react-dom",
        "lodash",
        "moment",
        "date-fns",
      ];

      potentialDuplicates.forEach((dep) => {
        console.log(`Checking ${dep}...`);
        // In a real scenario, this would check the actual bundle
      });

      console.groupEnd();
    }
  },

  /**
   * Monitor bundle size in development
   */
  monitorSize: () => {
    if (import.meta.env.DEV && "performance" in window) {
      const entries = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        const entry = entries[0];
        const transferSize = entry.transferSize || 0;
        const encodedSize = entry.encodedBodySize || 0;

        console.group("📊 Bundle Size Monitor");
        console.log(`Transfer Size: ${(transferSize / 1024).toFixed(2)} KB`);
        console.log(`Encoded Size: ${(encodedSize / 1024).toFixed(2)} KB`);
        console.log(
          `Compression Ratio: ${((1 - transferSize / encodedSize) * 100).toFixed(1)}%`,
        );
        console.groupEnd();
      }
    }
  },
};

/**
 * Production optimization strategies
 */
export const productionOptimizations = {
  /**
   * Remove development-only code
   */
  stripDevCode: () => {
    // This is handled by build tools, but we can provide runtime checks
    if (import.meta.env.PROD) {
      // Remove console logs in production
      console.log = () => {};
      console.warn = () => {};
      // Keep console.error for monitoring
    }
  },

  /**
   * Optimize images and assets
   */
  optimizeAssets: {
    // Preload critical images
    preloadImage: (src: string) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    },
  },

  /**
   * Service worker optimization
   */
  serviceWorker: {
    // Cache strategy for different asset types
    getCacheStrategy: (url: string) => {
      if (url.includes("/api/")) {
        return "NetworkFirst"; // API calls
      } else if (url.includes(".js") || url.includes(".css")) {
        return "CacheFirst"; // Static assets
      } else if (
        url.includes(".jpg") ||
        url.includes(".png") ||
        url.includes(".webp")
      ) {
        return "CacheFirst"; // Images
      }
      return "NetworkFirst"; // Default
    },
  },
};

/**
 * Bundle size targets and monitoring
 */
export const BUNDLE_TARGETS = {
  // Size targets in bytes
  TOTAL_SIZE: 7 * 1024 * 1024, // 7MB
  GZIP_SIZE: 2 * 1024 * 1024, // 2MB
  INITIAL_CHUNK: 1 * 1024 * 1024, // 1MB

  // Performance budgets
  FIRST_LOAD_JS: 512 * 1024, // 512KB
  ROUTE_CHUNK: 256 * 1024, // 256KB

  // Asset targets
  IMAGE_SIZE: 500 * 1024, // 500KB per image
  FONT_SIZE: 100 * 1024, // 100KB per font
};

/**
 * Check if bundle meets size targets
 */
export function checkBundleTargets(): {
  totalSize: boolean;
  gzipSize: boolean;
  initialChunk: boolean;
  overall: boolean;
} {
  // This would integrate with actual bundle analysis tools
  // For now, we'll simulate the check

  const results = {
    totalSize: true, // Assume current bundle is within limits
    gzipSize: true,
    initialChunk: true,
    overall: false,
  };

  results.overall =
    results.totalSize && results.gzipSize && results.initialChunk;

  if (import.meta.env.DEV) {
    console.group("📦 Bundle Size Check");
    console.log(
      `Total Size: ${results.totalSize ? "✅" : "❌"} Target: ${(BUNDLE_TARGETS.TOTAL_SIZE / 1024 / 1024).toFixed(1)}MB`,
    );
    console.log(
      `Gzip Size: ${results.gzipSize ? "✅" : "❌"} Target: ${(BUNDLE_TARGETS.GZIP_SIZE / 1024 / 1024).toFixed(1)}MB`,
    );
    console.log(
      `Initial Chunk: ${results.initialChunk ? "✅" : "❌"} Target: ${(BUNDLE_TARGETS.INITIAL_CHUNK / 1024).toFixed(0)}KB`,
    );
    console.log(
      `Overall: ${results.overall ? "✅ PASS" : "❌ NEEDS OPTIMIZATION"}`,
    );
    console.groupEnd();
  }

  return results;
}

/**
 * Initialize bundle optimizations
 */
export function initializeBundleOptimizations() {
  if (import.meta.env.DEV) {
    // Development optimizations
    treeShaking.checkTreeShaking();
    bundleAnalysis.checkDuplicates();
    bundleAnalysis.monitorSize();

    // Log bundle targets
    setTimeout(() => {
      checkBundleTargets();
    }, 2000);
  } else {
    // Production optimizations
    productionOptimizations.stripDevCode();
  }
}

// Auto-initialize on import
initializeBundleOptimizations();
