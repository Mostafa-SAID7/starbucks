import { memo } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { TFunction } from 'i18next';
import type { Location } from '@/types';

interface LocationCardProps {
  city: Location;
  isRTL: boolean;
  t: TFunction;
}

export const LocationCard = memo(
  ({ city, isRTL, t }: LocationCardProps) => {
    const c = city as Location & { nameAr?: string; count?: number };
    return (
      <motion.a
        href={`https://locations.starbucks.eg/directory/${city.slug || ''}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ x: isRTL ? -8 : 8 }}
        className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 group transition-all hover:bg-starbucks-green/5 hover:border-starbucks-green/30 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-starbucks-green/10 flex items-center justify-center text-starbucks-green group-hover:bg-starbucks-green group-hover:text-white transition-colors">
            <Navigation className="h-5 w-5" />
          </div>
          <span className="text-lg font-black text-gray-900 dark:text-white group-hover:text-starbucks-green transition-colors">
            {isRTL ? c.nameAr : String(c.name)}
          </span>
        </div>
        <span className="text-sm font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-black/20 px-3 py-1 rounded-full border border-gray-100 dark:border-white/5">
          {c.count} {t('pages:locations.content.stores_count')}
        </span>
      </motion.a>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.city.id === nextProps.city.id &&
      prevProps.isRTL === nextProps.isRTL
    );
  }
);

LocationCard.displayName = 'LocationCard';
