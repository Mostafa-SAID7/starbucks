import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks';
import { TALABAT_URL } from './constants';

export function PromoCards() {
  const { t } = useTranslation(['pages']);
  const { lang } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
      {/* Card 1 — Joy of Coffee */}
      <div className="group bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
        <div className="aspect-4/3 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=800"
            alt={t('pages:locations.promo.joy.title')}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="p-8 flex flex-col flex-1">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            {t('pages:locations.promo.joy.title')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-6 line-clamp-2 flex-1">
            {t('pages:locations.promo.joy.desc')}
          </p>
          <Link
            to={`/${lang}/our-coffees`}
            className="inline-flex items-center justify-center px-6 py-2 border-2 border-starbucks-green text-starbucks-green font-black rounded-full hover:bg-starbucks-green hover:text-white transition-all w-fit"
          >
            {t('pages:locations.promo.joy.cta')}
          </Link>
        </div>
      </div>

      {/* Card 2 — Starbucks Delivers */}
      <div className="group bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
        <div className="aspect-4/3 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
            alt={t('pages:locations.promo.delivery.title')}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="p-8 flex flex-col flex-1">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            {t('pages:locations.promo.delivery.title')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-6 line-clamp-2 flex-1">
            {t('pages:locations.promo.delivery.desc')}
          </p>
          <a
            href={TALABAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 border-2 border-starbucks-green text-starbucks-green font-black rounded-full hover:bg-starbucks-green hover:text-white transition-all w-fit"
          >
            {t('pages:locations.promo.delivery.cta')}
          </a>
        </div>
      </div>
    </div>
  );
}
