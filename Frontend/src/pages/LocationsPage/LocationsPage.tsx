import { TFunction } from "i18next";
import React, { useState, useCallback, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Navigation } from "lucide-react";
import { cn } from "@/lib/ui";
import { SEO, QueryErrorBoundary } from "@/components";
import { useLocations, useLanguage } from "@/hooks";
import { LocationsSkeleton } from "@/components/skeletons";
import { TALABAT_URL } from "./constants";
import type { Location } from "@/types";
const LocationCard = memo(
  ({ city, isRTL, t }: { city: Location; isRTL: boolean; t: TFunction }) => {
    const c = city as Location & { nameAr?: string; count?: number };
    return (
      <motion.a
        href={`https://locations.starbucks.eg/directory/${city.slug || ""}`}
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
  (prevProps: { city: Location; isRTL: boolean }, nextProps: { city: Location; isRTL: boolean }) => {
    return (
      prevProps.city.id === nextProps.city.id &&
      prevProps.isRTL === nextProps.isRTL
    );
  }
);

LocationCard.displayName = "LocationCard";

export const LocationsPage: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const { t } = useTranslation(['pages', 'common']);
  const [search, setSearch] = useState("");
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">("idle");

  // Memoize callback to prevent re-creation
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode with free Nominatim API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": lang } }
          );
          const data = await res.json();
          // Try city, then town, then suburb
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.suburb ||
            "";
          if (city) {
            setSearch(city);
          }
          setGeoStatus("idle");
        } catch {
          setGeoStatus("error");
        }
      },
      () => {
        setGeoStatus("error");
      },
      { timeout: 8000 }
    );
  }, [lang]);

  // Memoize search handler
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  // Fetch locations using TanStack Query
  const { data: cities, isLoading: isLocationsLoading } = useLocations() as { data: Location[] | undefined; isLoading: boolean };

  // Memoize filtered cities - only recalculate when cities or search changes
  const filteredCities = useMemo(() => {
    return (
      cities?.filter(
        (city: Location) => {
          const c = city as Location & { nameAr: string };
          return search === "" ||
            String(c.name).toLowerCase().includes(search.toLowerCase()) ||
            (c.nameAr && c.nameAr.includes(search));
        }
      ) || []
    );
  }, [cities, search]);

  if (isLocationsLoading) {
    return <LocationsSkeleton />;
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO
        title={t('pages:locations.title')}
      />

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className={cn("flex flex-col lg:flex-row gap-12 lg:gap-16", isRTL && "lg:flex-row-reverse")}>
          
          {/* Side 1: Sticky Hero / Search (40%) */}
          <div className="lg:w-[40%] lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] group">
            <div className="relative h-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-starbucks-dark flex flex-col items-center justify-center p-8 text-center text-white">
              {/* Bg image overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/Starbucks-directory.webp"
                  alt=""
                  className="h-full w-full object-cover opacity-30 transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-starbucks-dark via-starbucks-dark/50 to-transparent" />
              </div>

              <div className="relative z-10 w-full max-w-sm">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={t('pages:locations.hero.search_placeholder')}
                    className={`w-full rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md py-4 ${isRTL ? "pr-6 pl-14 text-right" : "pl-6 pr-14"} text-white placeholder-white/50 outline-none ring-2 ring-white/10 focus:ring-starbucks-green focus:bg-white/20 transition-all shadow-xl`}
                  />
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-2" : "right-2"} p-2.5 bg-starbucks-green rounded-full`}
                  >
                    <Search className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Use my location */}
                <button
                  onClick={handleUseMyLocation}
                  disabled={geoStatus === "loading"}
                  className="flex items-center gap-2 mx-auto text-sm font-bold text-white/80 hover:text-white transition-colors underline underline-offset-4 disabled:opacity-50 disabled:cursor-wait"
                >
                  <Navigation className={`h-4 w-4 ${geoStatus === "loading" ? "animate-spin" : ""}`} />
                  {geoStatus === "loading"
                    ? t('pages:locations.hero.locating')
                    : geoStatus === "error"
                    ? t('pages:locations.hero.location_unavailable')
                    : t('pages:locations.hero.use_my_location')}
                </button>
              </div>
            </div>
          </div>

          {/* Side 2: Content Column (60%) */}
          <div className="lg:w-[60%]">
            <div className={`mb-12 ${isRTL ? "text-right" : "text-left"}`}>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                {t('pages:locations.content.title')}
              </h2>
              <p className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-12">
                {t('pages:locations.content.subtitle')}
              </p>

              {/* Promo Cards - Same style as Category/Item Grid */}
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

              {/* City Grid - Premium Style */}
              <div className="border-t border-gray-100 dark:border-white/10 pt-12">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
                  {t('pages:locations.content.all_cities')}
                </h3>
                
                <QueryErrorBoundary variant="compact">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
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
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                          }}
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
};

export default LocationsPage;


