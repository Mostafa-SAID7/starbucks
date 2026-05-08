import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { SEO } from "@/components";
import { StaticPageSkeleton } from "@/components/skeletons";
import { SectionRenderer } from "@/components/sections/generic/SectionRenderer";
import { usePageData } from "@/hooks/queries";
import { type GenericPageData, type LocalizedText } from "@/types";

export const CommunityImpactPage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  // Fetch community impact page data using TanStack Query
  const {
    data: pageData,
    isLoading,
    error,
    refetch,
  } = usePageData("community-impact");

  // Loading state
  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  // Error state
  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === "ar" ? "حدث خطأ في تحميل الصفحة" : "Error loading page"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {lang === "ar"
              ? "عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى."
              : "Sorry, there was an error loading the page. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-starbucks-green text-white font-bold rounded-full hover:bg-starbucks-green/90 transition-colors"
          >
            {lang === "ar" ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  const data = pageData as GenericPageData;

  const t = (obj: LocalizedText | string | null | undefined) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return (obj as LocalizedText)[lang] || "";
  };

  return (
    <>
      <SEO title={t(data.title)} />

      <div className="flex flex-col lg:flex-row bg-background-light dark:bg-background-dark">
        {/* Content Column */}
        <div className="w-full lg:w-3/5 p-6 md:p-12 lg:p-20 xl:p-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 lg:mb-16"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
              {t(data.intro?.title)}
            </h1>

            <div className="space-y-6 mb-12 lg:mb-16">
              {data.intro?.paragraphs?.map((p, i) => (
                <p
                  key={i}
                  className="text-base md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  {t(p)}
                </p>
              ))}
            </div>

            {/* Dynamic Sections */}
            <div className="space-y-16 lg:space-y-24">
              {data.sections.map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                  lang={lang}
                  isRTL={lang === "ar"}
                  pageTitle={t(data.title)}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Image Column */}
        <div className="w-full lg:w-2/5 relative aspect-video lg:aspect-auto lg:h-screen lg:sticky lg:top-0">
          <img
            src={
              (typeof data.sidebarImage === "string"
                ? data.sidebarImage
                : data.sidebarImage?.[lang]) || "/statics/Gaza.webp"
            }
            alt={t(data.title)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-8 lg:bottom-16 left-8 lg:left-12 right-8 lg:right-12 text-white pointer-events-none">
            <h2 className="text-2xl lg:text-3xl font-black mb-2 lg:mb-4 leading-tight">
              {t(data.title)}
            </h2>
            <div className="w-12 lg:w-16 h-1 bg-starbucks-green rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityImpactPage;
