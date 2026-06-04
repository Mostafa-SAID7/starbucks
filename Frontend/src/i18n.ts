import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import ar from "./locales/ar";

// Detect language from URL immediately (before React renders)
const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
const urlLangMatch = typeof window !== 'undefined' && window.location ? window.location.pathname.match(/^\/(ar|en)(\/|$)/) : null;
const initialLang = urlLangMatch ? urlLangMatch[1] : (isTest ? "en" : "ar");

// Apply direction synchronously so first React render is already correct
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute(
    "dir",
    initialLang === "ar" ? "rtl" : "ltr",
  );
  document.documentElement.setAttribute("lang", initialLang);
}

const resources = {
  ar: {
    ...ar,
  },
  en: {
    ...en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
