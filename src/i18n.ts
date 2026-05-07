import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import ar from "./locales/ar";

// Detect language from URL immediately (before React renders)
const urlLangMatch = window.location.pathname.match(/^\/(ar|en)(\/|$)/);
const initialLang = urlLangMatch ? urlLangMatch[1] : "ar";

// Apply direction synchronously so first React render is already correct
document.documentElement.setAttribute(
  "dir",
  initialLang === "ar" ? "rtl" : "ltr",
);
document.documentElement.setAttribute("lang", initialLang);

const resources = {
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
