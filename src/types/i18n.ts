// I18n Types
export type LocalizedValue = string | string[] | Record<string, unknown>

export interface TranslationData {
  [key: string]: {
    ar: LocalizedValue
    en: LocalizedValue
  }
}

/** The universal bilingual string used throughout all pages */
export type LocalizedText = { ar: string; en: string }
