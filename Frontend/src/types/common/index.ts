/**
 * Shared Global Types
 */

/** Language identifiers */
export type Language = "ar" | "en";

/** User Role Types */
export enum UserRole {
  Customer = "Customer",
  Admin = "Admin",
  SuperAdmin = "SuperAdmin"
}

/** User Types */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  phone?: string;
  dateOfBirth?: string;
  loyaltyPoints?: number;
  preferences?: {
    language: Language;
    notifications: boolean;
    theme: Theme;
  };
  createdAt?: string;
  updatedAt?: string;
}

/** UI Theme modes */
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

/** The universal bilingual string used throughout all pages */
export type LocalizedText = { ar: string; en: string };

/** I18n Types */
export type LocalizedValue = string | string[] | Record<string, unknown>;

export interface TranslationData {
  [key: string]: {
    ar: LocalizedValue;
    en: LocalizedValue;
  };
}

/** Generic status types */
export type Status = "idle" | "loading" | "success" | "error";

/** Performance monitoring types */
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: string;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalQueries: number;
}

export interface BundleMetrics {
  totalSize: number;
  gzipSize: number;
  chunks: Array<{
    name: string;
    size: number;
    gzipSize: number;
  }>;
}
