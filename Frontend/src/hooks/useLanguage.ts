import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

export type Language = "ar" | "en";

export interface UseLanguageReturn {
  lang: Language;
  isRTL: boolean;
  i18n: ReturnType<typeof useTranslation>["i18n"];
  changeLanguage: (lang: Language) => Promise<void>;
}

/**
 * Custom hook for language management
 * Centralizes language state derivation and prevents duplication
 * 
 * @returns Language state and utilities
 * 
 * @example
 * ```tsx
 * const { lang, isRTL } = useLanguage();
 * 
 * return <div dir={isRTL ? "rtl" : "ltr"}>{content}</div>;
 * ```
 */
export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation();
  const { lang: urlLang } = useParams<{ lang: string }>();

  const { lang, isRTL } = useMemo(() => {
    const computedLang = (
      urlLang && (urlLang === "ar" || urlLang === "en")
        ? urlLang
        : i18n.language === "ar"
          ? "ar"
          : "en"
    ) as Language;

    return {
      lang: computedLang,
      isRTL: computedLang === "ar",
    };
  }, [urlLang, i18n.language]);

  return {
    lang,
    isRTL,
    i18n,
    changeLanguage: (newLang: Language) => i18n.changeLanguage(newLang),
  };
}
