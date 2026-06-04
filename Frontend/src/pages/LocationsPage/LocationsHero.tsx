import { motion } from 'framer-motion';
import { Search, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks';

import { ANIMATION_CONFIG } from '@/lib/core/constants';

interface LocationsHeroProps {
  search: string;
  onSearchChange: (value: string) => void;
  onUseMyLocation: () => void;
  geoStatus: 'idle' | 'loading' | 'error';
}

export function LocationsHero({ search, onSearchChange, onUseMyLocation, geoStatus }: LocationsHeroProps) {
  const { t } = useTranslation(['pages']);
  const { isRTL } = useLanguage();

  return (
    <div className="lg:w-[40%] lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] group">
      <div className="relative h-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-starbucks-dark flex flex-col items-center justify-center p-8 text-center text-white">
        {/* Bg image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Starbucks-directory.webp"
            alt=""
            className="h-full w-full object-cover opacity-30 transition-transform duration-1000 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-starbucks-dark via-starbucks-dark/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          <motion.h1
            {...ANIMATION_CONFIG.VARIANTS.SLIDE_UP}
            className="mb-4 text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.9] text-white whitespace-pre-line"
          >
            {t('pages:locations.hero.title')}
          </motion.h1>
          <p className="mb-8 text-lg font-bold text-white/70">
            {t('pages:locations.hero.subtitle')}
          </p>

          {/* Search bar */}
          <div className="relative mb-6 w-full mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('pages:locations.hero.search_placeholder')}
              className={`w-full rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md py-4 ${
                isRTL ? 'pr-6 pl-14 text-right' : 'pl-6 pr-14'
              } text-white placeholder-white/50 outline-none ring-2 ring-white/10 focus:ring-starbucks-green focus:bg-white/20 transition-all shadow-xl`}
            />
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? 'left-2' : 'right-2'
              } p-2.5 bg-starbucks-green rounded-full`}
            >
              <Search className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Use my location */}
          <button
            onClick={onUseMyLocation}
            disabled={geoStatus === 'loading'}
            className="flex items-center gap-2 mx-auto text-sm font-bold text-white/80 hover:text-white transition-colors underline underline-offset-4 disabled:opacity-50 disabled:cursor-wait"
          >
            <Navigation className={`h-4 w-4 ${geoStatus === 'loading' ? 'animate-spin' : ''}`} />
            {geoStatus === 'loading'
              ? t('pages:locations.hero.locating')
              : geoStatus === 'error'
              ? t('pages:locations.hero.location_unavailable')
              : t('pages:locations.hero.use_my_location')}
          </button>
        </div>
      </div>
    </div>
  );
}
