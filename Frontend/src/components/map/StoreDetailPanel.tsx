import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Phone, Navigation, Wifi, Car, Accessibility, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks';
import { cn } from '@/lib/ui';
import type { Location } from '@/types';

interface StoreDetailPanelProps {
  location: Location;
  distanceKm?: number;
  onBack: () => void;
}

function getCoords(loc: Location) {
  const lat = loc.coordinates?.lat ?? loc.latitude;
  const lng = loc.coordinates?.lng ?? loc.longitude;
  return lat && lng ? { lat, lng } : null;
}

const DAY_ORDER = ['daily', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekdays', 'weekends'];

const DAY_LABELS: Record<string, { en: string; ar: string }> = {
  daily:     { en: 'Daily',     ar: 'يومياً' },
  monday:    { en: 'Monday',    ar: 'الاثنين' },
  tuesday:   { en: 'Tuesday',   ar: 'الثلاثاء' },
  wednesday: { en: 'Wednesday', ar: 'الأربعاء' },
  thursday:  { en: 'Thursday',  ar: 'الخميس' },
  friday:    { en: 'Friday',    ar: 'الجمعة' },
  saturday:  { en: 'Saturday',  ar: 'السبت' },
  sunday:    { en: 'Sunday',    ar: 'الأحد' },
  weekdays:  { en: 'Weekdays',  ar: 'أيام الأسبوع' },
  weekends:  { en: 'Weekends',  ar: 'عطلة نهاية الأسبوع' },
};

function dayLabel(key: string, isRTL: boolean): string {
  const entry = DAY_LABELS[key.toLowerCase()];
  if (!entry) return key;
  return isRTL ? entry.ar : entry.en;
}

function FeatureIcon({ name }: { name: string }) {
  const f = name.toLowerCase();
  if (f.includes('wifi'))                         return <Wifi className="w-3.5 h-3.5" />;
  if (f.includes('drive'))                        return <Car className="w-3.5 h-3.5" />;
  if (f.includes('parking'))                      return <Car className="w-3.5 h-3.5" />;
  if (f.includes('wheelchair') || f.includes('accessible')) return <Accessibility className="w-3.5 h-3.5" />;
  if (f.includes('sea') || f.includes('view'))    return <Waves className="w-3.5 h-3.5" />;
  return <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px]">✦</span>;
}

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function StoreDetailPanel({ location, distanceKm, onBack }: StoreDetailPanelProps) {
  const { t } = useTranslation(['pages']);
  const { isRTL } = useLanguage();

  const c = location as Location & { nameAr?: string };
  const name = isRTL && c.nameAr
    ? c.nameAr
    : (typeof c.name === 'string' ? c.name : c.name?.en ?? '');
  const address = typeof c.address === 'string' ? c.address : (c.address?.en ?? '');

  const coords = getCoords(location);
  const directionsUrl = coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(address || name)}`;

  const hourEntries = Object.entries(location.operatingHours ?? {}).sort(([a], [b]) => {
    const ai = DAY_ORDER.indexOf(a.toLowerCase());
    const bi = DAY_ORDER.indexOf(b.toLowerCase());
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const allFeatures = [
    ...(location.features ?? []),
    ...(location.amenities ?? []),
    ...(location.hasWifi && !(location.features ?? []).some(f => f.toLowerCase().includes('wifi')) ? ['WiFi'] : []),
    ...(location.hasDriveThru && !(location.features ?? []).some(f => f.toLowerCase().includes('drive')) ? ['Drive-Thru'] : []),
    ...(location.hasParking && !(location.features ?? []).some(f => f.toLowerCase().includes('parking')) ? ['Parking'] : []),
    ...(location.isWheelchairAccessible ? ['Wheelchair Accessible'] : []),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col h-full bg-white dark:bg-zinc-950"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-white/10 shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ms-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0"
          aria-label={t('pages:locations.detail.back', 'Back to list')}
        >
          <ArrowLeft className={cn('w-5 h-5 text-gray-600 dark:text-gray-300', isRTL && 'rotate-180')} />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-gray-900 dark:text-white truncate leading-tight">{name}</h2>
          {location.city && (
            <p className="text-sm text-gray-400 mt-0.5">{location.city}</p>
          )}
        </div>
        {distanceKm !== undefined && (
          <span className="ms-auto shrink-0 text-xs font-bold bg-starbucks-green/10 text-starbucks-green px-2.5 py-1 rounded-full">
            {formatDistance(distanceKm)}
          </span>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-6 space-y-7">

          {/* Address */}
          {address && (
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-starbucks-green shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{address}</p>
            </div>
          )}

          {/* Operating Hours */}
          {hourEntries.length > 0 && (
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-starbucks-green shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  {t('pages:locations.detail.hours', 'Opening Hours')}
                </h3>
                <div className="space-y-2">
                  {hourEntries.map(([day, { open, close }]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-gray-500 dark:text-gray-400 capitalize">
                        {dayLabel(day, isRTL)}
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200 tabular-nums shrink-0">
                        {open} – {close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phone */}
          {location.phone && (
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-starbucks-green shrink-0 mt-0.5" />
              <a
                href={`tel:${location.phone}`}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-starbucks-green transition-colors"
              >
                {location.phone}
              </a>
            </div>
          )}

          {/* Features / Amenities */}
          {allFeatures.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                {t('pages:locations.detail.amenities', 'Amenities')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {allFeatures.map((feature) => (
                  <span
                    key={feature}
                    className="flex items-center gap-1.5 text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full border border-gray-100 dark:border-white/10"
                  >
                    <FeatureIcon name={feature} />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Get Directions — pinned to bottom */}
      <div className="p-6 border-t border-gray-100 dark:border-white/10 shrink-0">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-starbucks-green hover:bg-starbucks-dark active:scale-95 text-white font-bold py-4 rounded-2xl transition-all shadow-md"
        >
          <Navigation className="w-5 h-5" />
          {t('pages:locations.map.get_directions', 'Get Directions')}
        </a>
      </div>
    </motion.div>
  );
}
