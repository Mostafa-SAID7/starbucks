import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common', 'navigation', 'auth'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    // In tests, return the key itself so tests can assert on keys
    // e.g. t('auth.login') returns 'auth.login'
    resources: {},
    parseMissingKeyHandler: (key) => key,
    appendNamespaceToMissingKey: true
  });

export default i18n;