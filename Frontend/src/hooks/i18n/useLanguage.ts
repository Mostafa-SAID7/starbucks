import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { toast } from "sonner";

export type Language = "ar" | "en";

export interface UseLanguageReturn {
  lang: Language;
  isRTL: boolean;
  i18n: ReturnType<typeof useTranslation>["i18n"];
  changeLanguage: (lang: Language) => Promise<void>;
  toggleLanguage: () => void;
}

/**
 * Custom hook for comprehensive language management
 * Handles language state, RTL detection, and URL-synchronized toggling
 */
export function useLanguage(): UseLanguageReturn {
  const { i18n, t } = useTranslation();
  const { lang: urlLang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

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

  const changeLanguage = useCallback(async (newLang: Language) => {
    // Extract path without language prefix
    const pathParts = location.pathname.split("/");
    const pathWithoutLang = pathParts.slice(2).join("/");
    const newPath = `/${newLang}${pathWithoutLang ? "/" + pathWithoutLang : ""}${location.search}${location.hash}`;

    // Update i18n
    await i18n.changeLanguage(newLang);

    // Navigate to new path
    navigate(newPath, { replace: true });

    // Show success feedback
    const message = newLang === "ar" 
      ? "تم تغيير اللغة إلى العربية" 
      : "Language changed to English";
    
    toast.success(message);
  }, [i18n, location, navigate]);

  const toggleLanguage = useCallback(() => {
    const targetLang = lang === "ar" ? "en" : "ar";
    changeLanguage(targetLang);
  }, [lang, changeLanguage]);

  return {
    lang,
    isRTL,
    i18n,
    changeLanguage,
    toggleLanguage,
  };
}
