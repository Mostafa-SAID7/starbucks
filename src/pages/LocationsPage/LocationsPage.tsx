import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Navigation, RefreshCw } from "lucide-react";
import { SEO } from "@/components";
import { useLocations } from "@/hooks/queries";
import { TALABAT_URL } from "./constants";

export const LocationsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const currentLang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const [search, setSearch] = useState("");

  // Fetch locations using TanStack Query
  const { data: cities, isLoading, error, refetch } = useLocations();

  // Filter cities based on search
  const filteredCities =
    cities?.filter(
      (c) =>
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.nameAr.includes(search),
    ) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO
        title={
          isRTL
            ? "ابحث عن مقهى ستاربكس | مصر"
            : "Find Your Nearest Starbucks | Egypt"
        }
      />

      {/* ─── Main Split Layout ─── */}
      <div className="flex flex-col lg:flex-row min-h-[480px]">
        {/* Left — Hero / Search */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-8 bg-starbucks-dark px-8 py-20 text-white lg:max-w-[45%]">
          {/* Bg image overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/Starbucks-directory.webp"
              alt=""
              className="h-full w-full object-cover opacity-30"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-starbucks-dark/70" />
          </div>

          <div className="relative z-10 text-center w-full max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 text-4xl font-black uppercase tracking-tight leading-none lg:text-5xl"
            >
              {isRTL ? (
                <>
                  ابحث عن أقرب
                  <br />
                  ستاربكس
                </>
              ) : (
                <>
                  FIND YOUR
                  <br />
                  NEAREST
                  <br />
                  STARBUCKS
                </>
              )}
            </motion.h1>
            <p className="mb-8 text-lg font-medium text-white/80">
              {isRTL ? "في مصر" : "in Egypt"}
            </p>

            {/* Search bar */}
            <div className="relative mb-6 w-full max-w-md mx-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isRTL ? "ابحث عن فرع..." : "Find a store"}
                className={`w-full rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md py-4 ${isRTL ? "pr-6 pl-14 text-right" : "pl-6 pr-14"} text-white placeholder-white/50 outline-none ring-2 ring-white/10 focus:ring-starbucks-green focus:bg-white/20 transition-all shadow-xl`}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-2" : "right-2"} p-2.5 bg-starbucks-green rounded-full`}
              >
                <Search className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Use my location */}
            <button className="flex items-center gap-2 mx-auto text-sm font-bold text-white/80 hover:text-white transition-colors underline underline-offset-4">
              <Navigation className="h-4 w-4" />
              {isRTL ? "استخدم موقعي ▼" : "Use my location ▼"}
            </button>
          </div>
        </div>

        {/* Right — Cards */}
        <div className="flex flex-1 flex-col divide-y divide-gray-100 dark:divide-zinc-800 lg:max-w-[55%]">
          {/* Card 1 — Joy of Coffee */}
          <div className="flex flex-col overflow-hidden md:flex-row">
            <div className="flex flex-1 flex-col justify-center p-8 order-2 md:order-1">
              <h2 className="mb-2 text-xl font-bold text-starbucks-dark dark:text-white">
                {isRTL ? "بهجة قهوة ستاربكس" : "The Joy of Starbucks Coffee"}
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {isRTL ? (
                  <>
                    اكتشف{" "}
                    <span className="text-starbucks-green font-bold">
                      طيف تحميص ستاربكس
                    </span>{" "}
                    وتعمق في تقنيات التخمير
                  </>
                ) : (
                  <>
                    Discover{" "}
                    <span className="text-starbucks-green font-bold">
                      Starbucks Roast Spectrum
                    </span>{" "}
                    and dive deep into brewing techniques
                  </>
                )}
              </p>
              <Link
                to={`/${currentLang}/our-coffees`}
                className="inline-block rounded-full border border-starbucks-dark dark:border-white px-5 py-2 text-sm font-bold text-starbucks-dark dark:text-white hover:bg-starbucks-dark hover:text-white dark:hover:bg-white dark:hover:text-black transition-all w-fit"
              >
                {isRTL ? "اقرأ المزيد" : "Read more"}
              </Link>
            </div>
            <div className="w-full md:w-1/2 flex-shrink-0 order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80"
                alt="The Joy of Starbucks Coffee"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Card 2 — Starbucks Delivers */}
          <div className="flex flex-col overflow-hidden md:flex-row">
            <div className="flex flex-1 flex-col justify-center p-8 order-2 md:order-1">
              <h2 className="mb-2 text-xl font-bold text-starbucks-dark dark:text-white">
                {isRTL ? "ستاربكس توصل" : "Starbucks Delivers"}
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {isRTL
                  ? "احصل على مشروبك المفضل من ستاربكس حتى بابك!"
                  : "Get your Starbucks favourite delivered to your door!"}
              </p>
              <a
                href={TALABAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-starbucks-dark dark:border-white px-5 py-2 text-sm font-bold text-starbucks-dark dark:text-white hover:bg-starbucks-dark hover:text-white dark:hover:bg-white dark:hover:text-black transition-all w-fit"
              >
                {isRTL ? "اطلب الآن" : "Order now"}
              </a>
            </div>
            <div className="w-full md:w-1/2 flex-shrink-0 order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80"
                alt="Starbucks Delivers"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── City Directory ─── */}
      <div className="border-t border-gray-100 dark:border-zinc-800 py-12 px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8 text-lg font-extrabold text-starbucks-dark dark:text-white">
            {isRTL ? "جميع الفروع في مصر" : "All Locations in Egypt"}
          </h2>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-starbucks-green border-t-transparent" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL ? "جاري تحميل المواقع..." : "Loading locations..."}
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-2">
                  {isRTL
                    ? "حدث خطأ أثناء تحميل المواقع"
                    : "Error loading locations"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {error instanceof Error ? error.message : String(error)}
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 rounded-full bg-starbucks-green px-6 py-3 text-sm font-bold text-white hover:bg-starbucks-green/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                {isRTL ? "إعادة المحاولة" : "Retry"}
              </button>
            </div>
          )}

          {/* Success State - City Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {filteredCities.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  {isRTL ? "لم يتم العثور على مواقع" : "No locations found"}
                </div>
              ) : (
                filteredCities.map((city) => (
                  <motion.a
                    key={city.slug}
                    href={`https://locations.starbucks.eg/directory/${city.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: isRTL ? 4 : -4 }}
                    className="flex items-center gap-2 text-starbucks-green font-bold hover:underline underline-offset-4"
                  >
                    <span>{isRTL ? city.nameAr : city.name}</span>
                    <span className="text-gray-400 font-normal text-sm">
                      ({city.count})
                    </span>
                  </motion.a>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;
