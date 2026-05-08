import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock translations
const resources = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      search: 'Search',
      menu: 'Menu',
      locations: 'Locations',
      home: 'Home',
    },
    navigation: {
      navbar: {
        menu: 'Menu',
        locations: 'Locations',
        about: 'About Us',
        sustainability: 'Sustainability',
        tooltips: {
          locations: 'Find Locations',
          language: 'Change Language',
          light_mode: 'Light Mode',
          dark_mode: 'Dark Mode',
          account: 'Account',
        },
      },
    },
    auth: {
      login_title: 'Sign In',
      login_email: 'Email Address',
      login_password: 'Password',
      login_submit: 'Sign In',
      register_title: 'Create Account',
      register_first_name: 'First Name',
      register_last_name: 'Last Name',
      register_email: 'Email Address',
      register_password: 'Password',
      register_submit: 'Create Account',
    },
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      error: 'خطأ',
      retry: 'إعادة المحاولة',
      search: 'بحث',
      menu: 'القائمة',
      locations: 'المواقع',
      home: 'الرئيسية',
    },
    navigation: {
      navbar: {
        menu: 'القائمة',
        locations: 'المواقع',
        about: 'من نحن',
        sustainability: 'الاستدامة',
        tooltips: {
          locations: 'العثور على المواقع',
          language: 'تغيير اللغة',
          light_mode: 'الوضع الفاتح',
          dark_mode: 'الوضع الداكن',
          account: 'الحساب',
        },
      },
    },
    auth: {
      login_title: 'تسجيل الدخول',
      login_email: 'البريد الإلكتروني',
      login_password: 'كلمة المرور',
      login_submit: 'تسجيل الدخول',
      register_title: 'إنشاء حساب',
      register_first_name: 'الاسم الأول',
      register_last_name: 'اسم العائلة',
      register_email: 'البريد الإلكتروني',
      register_password: 'كلمة المرور',
      register_submit: 'إنشاء حساب',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;