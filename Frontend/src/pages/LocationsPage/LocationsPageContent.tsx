import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/ui';
import { ANIMATION_CONFIG } from '@/lib/core/constants';
import { SEO, QueryErrorBoundary } from '@/components';
import { useLanguage } from '@/hooks';
import type { Location } from '@/types';
import { LocationCard } from './LocationCard';
import { LocationsHero } from './LocationsHero';
import { PromoCards } from './PromoCards';

interface LocationsPageContentProps {
  locations: Location[];
}

export function LocationsPageContent({ locations }: LocationsPageContentProps) {
  const { lang, isRTL } = useLanguage();
  const { t } = useTranslation(['pages']);

  const [search, setSearch] = useState('');
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': lang } }
          );
          const data = await res.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.suburb ||
            '';
          if (city) {
            setSearch(city);
          }
          setGeoStatus('idle');
        } catch {
          setGeoStatus('error');
        }
      },
      () => {
        setGeoStatus('error');
      },
      { timeout: 8000 }
    );
  }, [lang]);

  const filteredCities = useMemo(() => {
    return locations.filter((city: Location) => {
      const c = city as Location & { nameAr: string };
      return (
        search === '' ||
        String(c.name).toLowerCase().includes(search.toLowerCase()) ||
        (c.nameAr && c.nameAr.includes(search))
      );
    });
  }, [locations, search]);

  return (
    <div
      className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO title={t('pages:locations.title')} />

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className={cn('flex flex-col lg:flex-row gap-12 lg:gap-16', isRTL && 'lg:flex-row-reverse')}>
          
          <LocationsHero
            search={search}
            onSearchChange={setSearch}
            onUseMyLocation={handleUseMyLocation}
            geoStatus={geoStatus}
          />

          <div className="lg:w-[60%]">
            <div className={`mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                {t('pages:locations.content.title')}
              </h2>
              <p className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-12">
                {t('pages:locations.content.subtitle')}
              </p>

              <PromoCards />

              <div className="border-t border-gray-100 dark:border-white/10 pt-12">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
                  {t('pages:locations.content.all_cities')}
                </h3>

                <QueryErrorBoundary variant="compact">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={ANIMATION_CONFIG.VARIANTS.STAGGER_CONTAINER}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {filteredCities.length === 0 ? (
                      <p className="col-span-full py-8 text-gray-400 font-bold text-center italic">
                        {t('pages:locations.content.no_results')}
                      </p>
                    ) : (
                      filteredCities.map((city: Location) => (
                        <motion.div
                          key={city.slug}
                          variants={ANIMATION_CONFIG.VARIANTS.STAGGER_ITEM}
                        >
                          <LocationCard city={city} isRTL={isRTL} t={t} />
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </QueryErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
