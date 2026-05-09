import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useLanguage, Language } from "./useLanguage";

/**
 * Custom hook for language toggling
 * Handles language switching with URL navigation and i18n updates
 * 
 * @returns Function to toggle language
 * 
 * @example
 * ```tsx
 * const toggleLanguage = useLanguageToggle();
 * 
 * return (
 *   <button onClick={toggleLanguage}>
 *     {lang === 'ar' ? 'English' : 'العربية'}
 *   </button>
 * );
 * ```
 */
export function useLanguageToggle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { lang } = useLanguage();

  return useCallback(
    (newLang?: Language) => {
      const targetLang = newLang || (lang === "ar" ? "en" : "ar");

      // Extract path without language prefix
      const pathParts = location.pathname.split("/");
      const pathWithoutLang = pathParts.slice(2).join("/");
      const newPath = `/${targetLang}${pathWithoutLang ? "/" + pathWithoutLang : ""}`;

      // Update i18n
      i18n.changeLanguage(targetLang);

      // Navigate to new path
      navigate(newPath, { replace: false });

      // Show success message
      const message =
        targetLang === "ar"
          ? t("common:language_changed_ar", { defaultValue: "تم تغيير اللغة إلى العربية" })
          : t("common:language_changed_en", { defaultValue: "Language changed to English" });

      toast.success(message);
    },
    [lang, i18n, navigate, location.pathname, t]
  );
}
