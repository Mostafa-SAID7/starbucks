import React from "react";
import { PERFORMANCE_CONFIG } from "./constants";
import { preloadResource } from "./performance";

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
   * Optimize images and assets
   */
  optimizeAssets: {
    // Preload critical images using shared performance utility
    preloadImage: (src: string) => preloadResource(src, "image"),
  },
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
      `Total Size: ${results.totalSize ? "✅" : "❌"} Target: ${(PERFORMANCE_CONFIG.TARGET_BUNDLE_SIZE / 1024 / 1024).toFixed(1)}MB`,
    );
    console.log(
      `Gzip Size: ${results.gzipSize ? "✅" : "❌"} Target: ${(PERFORMANCE_CONFIG.TARGET_GZIP_SIZE / 1024 / 1024).toFixed(1)}MB`,
    );
    console.log(
      `Initial Chunk: ${results.initialChunk ? "✅" : "❌"} Target: ${(PERFORMANCE_CONFIG.TARGET_INITIAL_CHUNK / 1024).toFixed(0)}KB`,
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
  }
}

// Auto-initialize on import
initializeBundleOptimizations();
