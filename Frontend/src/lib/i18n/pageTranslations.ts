import i18n from 'i18next';

const loadedKeys = new Set<string>();

const EN_PAGE_LOADERS = import.meta.glob<{ default: Record<string, unknown> }>(
  '../../locales/en/pages/*.json'
);
const AR_PAGE_LOADERS = import.meta.glob<{ default: Record<string, unknown> }>(
  '../../locales/ar/pages/*.json'
);

const URL_TO_SLUG: Record<string, string> = {
  '': 'home',
  'menu': 'menu',
  'delivery': 'delivery',
  'locations': 'locations',
  'contact-us': 'contact',
  'social-impact-sustainability': 'sustainability',
  'starbucks-middle-east': 'middle-east',
  'about-us': 'about-us',
  'our-coffees': 'our-coffees',
  'privacy-statement': 'privacy-statement',
  'terms-of-use': 'terms-of-use',
  'cookie-notice': 'cookies',
  'checkout': 'checkout',
  'profile': 'profile',
  'community-impact': 'community-impact',
  'new-era': 'new-era',
};

export function getPageSlug(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const segment = (parts[0] === 'ar' || parts[0] === 'en')
    ? (parts[1] || '')
    : (parts[0] || '');
  return URL_TO_SLUG[segment] ?? segment;
}

export async function loadPageTranslations(lang: 'en' | 'ar', slug: string): Promise<void> {
  const key = `${lang}:${slug}`;
  if (loadedKeys.has(key)) return;
  loadedKeys.add(key);

  const loaders = lang === 'en' ? EN_PAGE_LOADERS : AR_PAGE_LOADERS;
  const loaderKey = Object.keys(loaders).find(k => k.endsWith(`/${slug}.json`));

  if (!loaderKey) return;

  try {
    const module = await loaders[loaderKey]();
    const existing = (i18n.getResourceBundle(lang, 'pages') as Record<string, unknown>) ?? {};
    i18n.addResourceBundle(lang, 'pages', { ...existing, [slug]: module.default }, true, true);
  } catch {
    // Translation file not found — page may not have page-specific translations
  }
}
