import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// We will add translations here as we develop features
const resources = {
  ar: {
    translation: {
      "Welcome": "مرحباً",
      "Language": "English",
      "Menu": "القائمة"
    }
  },
  en: {
    translation: {
      "Welcome": "Welcome",
      "Language": "العربية",
      "Menu": "Menu"
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
