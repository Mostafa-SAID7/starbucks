import { useState, useCallback, useMemo } from 'react';
import { captureError } from '@/lib/error/errorMonitoring';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/ui';
import { ANIMATION_CONFIG } from '@/lib/core/constants';
import { SEO, QueryErrorBoundary } from '@/components';
import { useLanguage } from '@/hooks';
import type { Location } from '@/types';
import { LocationCard } from './LocationCard';
import { StoreMap } from '@/components/map/StoreMap';
import { PlacesAutocomplete } from '@/components/map/PlacesAutocomplete';
import { List, Map as MapIcon } from 'lucide-react';

interface LocationsPageContentProps {
  locations: Location[];
}

export function LocationsPageContent({ locations }: LocationsPageContentProps) {
  const { lang, isRTL } = useLanguage();
  const { t } = useTranslation(['pages']);

  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setGeoStatus('idle');
        setViewMode('map');
      },
      () => {
        setGeoStatus('error');
      },
      { timeout: 8000 }
    );
  }, []);

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setUserLocation({ lat, lng });
      setViewMode('map');
    }
  }, []);

  const filteredLocations = useMemo(() => {
    if (search === '') return locations;
    const lc = search.toLowerCase();
    return locations.filter((loc: Location) => {
      const nameEn = typeof loc.name === 'string' ? loc.name : (loc.name?.en || '');
      const nameAr = typeof loc.name === 'string' ? '' : (loc.name?.ar || '');
      const addr = typeof loc.address === 'string'
        ? loc.address
        : (loc.address?.en || '');
      return (
        nameEn.toLowerCase().includes(lc) ||
        nameAr.includes(search) ||
        addr.toLowerCase().includes(lc) ||
        (loc.city && loc.city.toLowerCase().includes(lc))
      );
    });
  }, [locations, search]);

  return (
    <div
      className="h-[calc(100vh-4rem)] bg-white dark:bg-zinc-950 transition-colors duration-300 flex flex-col overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO title={t('pages:locations.title', 'Store Locator')} />

      {/* Mobile View Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-zinc-950 z-20">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('pages:locations.content.title', 'Find a Store')}
        </h1>
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-full">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
              viewMode === 'list'
                ? 'bg-white dark:bg-zinc-700 text-starbucks-green shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            <List className="w-4 h-4" />
            {t('pages:locations.view.list', 'List')}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
              viewMode === 'map'
                ? 'bg-white dark:bg-zinc-700 text-starbucks-green shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            <MapIcon className="w-4 h-4" />
            {t('pages:locations.view.map', 'Map')}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative h-full">
        {/* Sidebar / List View */}
        <div
          className={cn(
            'w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 flex flex-col h-full bg-white dark:bg-zinc-950 z-10 transition-transform duration-300',
            viewMode === 'map' ? 'hidden lg:flex' : 'flex'
          )}
        >
          <div className="p-6 border-b border-gray-100 dark:border-white/10">
            <h2 className="hidden lg:block text-3xl font-black text-gray-900 dark:text-white mb-6">
              {t('pages:locations.content.title', 'Find a Store')}
            </h2>
            <PlacesAutocomplete
              search={search}
              setSearch={setSearch}
              onPlaceSelect={handlePlaceSelect}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <QueryErrorBoundary variant="compact">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={ANIMATION_CONFIG.VARIANTS.STAGGER_CONTAINER}
                className="flex flex-col gap-4"
              >
                {filteredLocations.length === 0 ? (
                  <p className="py-8 text-gray-400 font-bold text-center italic">
                    {t('pages:locations.content.no_results', 'No stores found.')}
                  </p>
                ) : (
                  filteredLocations.map((location: Location) => (
                    <motion.div
                      key={location.id || location.slug}
                      variants={ANIMATION_CONFIG.VARIANTS.STAGGER_ITEM}
                    >
                      <LocationCard
                        location={location}
                        isRTL={isRTL}
                        t={t}
                        isSelected={selectedLocation?.id === location.id}
                        onClick={() => {
                          setSelectedLocation(location);
                          if (window.innerWidth < 1024) {
                            setViewMode('map');
                          }
                        }}
                      />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </QueryErrorBoundary>
          </div>
        </div>

        {/* Map View */}
        <div
          className={cn(
            'flex-1 relative h-full',
            viewMode === 'list' ? 'hidden lg:block' : 'block'
          )}
        >
          <StoreMap
            locations={filteredLocations}
            userLocation={userLocation}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
            onLocateMe={handleUseMyLocation}
            geoStatus={geoStatus}
          />

          {import.meta.env.DEV && (
            <button
              id="sentry-test-btn"
              onClick={() => {
                const err = new Error('[Sentry Test] Starbucks EG — error tracking verified ✅');
                captureError(err, { page: 'LocationsPage', triggeredBy: 'sentry-test-btn' });
                throw err;
              }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all"
            >
              🧪 Test Sentry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
