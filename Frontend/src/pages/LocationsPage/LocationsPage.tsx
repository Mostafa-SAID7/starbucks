import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEO, QueryErrorBoundary } from "@/components";
import { useLocations } from "@/hooks/queries";
import { TALABAT_URL } from "./constants";

export const LocationsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const currentLang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const [search, setSearch] = useState("");
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">("idle");

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
            { headers: { "Accept-Language": currentLang } }
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
  }, [currentLang]);

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
    <div className={`min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO
        title={
          isRTL
            ? "ابحث عن مقهى ستاربكس | مصر"
            : "Find Your Nearest Starbucks | Egypt"
        }
      />

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className={cn("flex flex-col lg:flex-row gap-12 lg:gap-16", isRTL && "lg:flex-row-reverse")}>
          
          {/* Side 1: Sticky Hero / Search (40%) */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] group">
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
                <div className="absolute inset-0 bg-gradient-to-t from-starbucks-dark via-starbucks-dark/50 to-transparent" />
              </div>

              <div className="relative z-10 w-full max-w-sm">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.9] text-white"
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
                <p className="mb-8 text-lg font-bold text-white/70">
                  {isRTL ? "في مصر" : "in Egypt"}
                </p>

                {/* Search bar */}
                <div className="relative mb-6 w-full mx-auto">
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
                <button
                  onClick={handleUseMyLocation}
                  disabled={geoStatus === "loading"}
                  className="flex items-center gap-2 mx-auto text-sm font-bold text-white/80 hover:text-white transition-colors underline underline-offset-4 disabled:opacity-50 disabled:cursor-wait"
                >
                  <Navigation className={`h-4 w-4 ${geoStatus === "loading" ? "animate-spin" : ""}`} />
                  {geoStatus === "loading"
                    ? (isRTL ? "جارٍ تحديد الموقع..." : "Locating...")
                    : geoStatus === "error"
                    ? (isRTL ? "تعذّر تحديد الموقع" : "Location unavailable")
                    : (isRTL ? "استخدم موقعي" : "Use my location")}
                </button>
              </div>
            </div>
          </div>

          {/* Side 2: Content Column (60%) */}
          <div className="lg:w-[60%]">
            <div className={`mb-12 ${isRTL ? "text-right" : "text-left"}`}>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                {isRTL ? "فروعنا في مصر" : "Our Locations in Egypt"}
              </h2>
              <p className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-12">
                {isRTL 
                  ? "اكتشف أقرب مقهى إليك واستمتع بتجربة ستاربكس المميزة" 
                  : "Discover your nearest store and enjoy the Starbucks experience."}
              </p>

              {/* Promo Cards - Same style as Category/Item Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                {/* Card 1 — Joy of Coffee */}
                <div className="group bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
                      alt="The Joy of Starbucks Coffee"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                        {isRTL ? "بهجة قهوة ستاربكس" : "The Joy of Starbucks Coffee"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium mb-6 line-clamp-2 flex-1">
                        {isRTL ? "اكتشف طيف تحميص ستاربكس وتعمق في تقنيات التخمير" : "Discover Starbucks Roast Spectrum and dive deep into brewing techniques"}
                      </p>
                      <Link
                        to={`/${currentLang}/our-coffees`}
                        className="inline-flex items-center justify-center px-6 py-2 border-2 border-starbucks-green text-starbucks-green font-black rounded-full hover:bg-starbucks-green hover:text-white transition-all w-fit"
                      >
                        {isRTL ? "اقرأ المزيد" : "Read more"}
                      </Link>
                    </div>
                  </div>
 
                  {/* Card 2 — Starbucks Delivers */}
                  <div className="group bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
                        alt="Starbucks Delivers"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                        {isRTL ? "ستاربكس توصل" : "Starbucks Delivers"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium mb-6 line-clamp-2 flex-1">
                        {isRTL ? "احصل على مشروبك المفضل من ستاربكس حتى بابك!" : "Get your Starbucks favourite delivered to your door!"}
                      </p>
                      <a
                        href={TALABAT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-2 border-2 border-starbucks-green text-starbucks-green font-black rounded-full hover:bg-starbucks-green hover:text-white transition-all w-fit"
                      >
                        {isRTL ? "اطلب الآن" : "Order now"}
                      </a>
                    </div>
                  </div>
              </div>

              {/* City Grid - Premium Style */}
              <div className="border-t border-gray-100 dark:border-white/10 pt-12">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
                  {isRTL ? "جميع المدن" : "All Cities"}
                </h3>
                
                <QueryErrorBoundary variant="compact">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredCities.length === 0 ? (
                      <p className="col-span-full py-8 text-gray-400 font-bold text-center italic">
                        {isRTL ? "لم يتم العثور على نتائج" : "No locations found"}
                      </p>
                    ) : (
                      filteredCities.map((city) => (
                        <motion.a
                          key={city.slug}
                          href={`https://locations.starbucks.eg/directory/${city.slug}`}
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
                              {isRTL ? city.nameAr : city.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-black/20 px-3 py-1 rounded-full border border-gray-100 dark:border-white/5">
                            {city.count} {isRTL ? "فرع" : "stores"}
                          </span>
                        </motion.a>
                      ))
                    )}
                  </div>
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
