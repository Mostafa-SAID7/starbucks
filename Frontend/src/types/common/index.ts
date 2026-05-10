/**
 * Shared Global Types
 * Re-exported from centralized Zod schemas for consistency
 */

import { 
  Language as LanguageType,
  Theme as ThemeType,
  Status as StatusType,
  LocalizedText as LocalizedTextType,
  User as UserType,
  UserRoleSchema
} from '@/lib/schemas';

/** Language identifiers */
export type Language = LanguageType;

/** User Role Types */
export enum UserRole {
  Customer = "Customer",
  Admin = "Admin",
  SuperAdmin = "SuperAdmin"
}

/** User Types */
export type User = UserType;

/** UI Theme modes */
export type Theme = ThemeType;

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

/** The universal bilingual string used throughout all pages */
export type LocalizedText = LocalizedTextType;

/** I18n Types */
export type LocalizedValue = string | string[] | Record<string, unknown>;

export interface TranslationData {
  [key: string]: {
    ar: LocalizedValue;
    en: LocalizedValue;
  };
}

/** Generic status types */
export type Status = StatusType;

/** Performance monitoring types (UI only) */
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
