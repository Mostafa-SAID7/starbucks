import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SEO } from "@/components";
import { StaticPageSkeleton } from "@/components/skeletons";
import { usePageData } from "@/hooks/queries";
import { type GenericPageData, type LocalizedText } from "@/types";
import { Plus, Minus, ExternalLink } from "lucide-react";

export const DeliveryPage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
  const [openSection, setOpenSection] = useState<string | null>("intro");

  // Fetch delivery page data using TanStack Query
  const { data: pageData, isLoading, error, refetch } = usePageData("delivery");

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

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sidebarMedia = t(data.sidebarImage);
  const isVideo =
    sidebarMedia?.includes("player.cloudinary.com") ||
    sidebarMedia?.includes("embed");

  // Logical alignment classes
  const textAlignClass = isRTL ? "text-right" : "text-left";
  const itemsAlignClass = "items-start";

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={t(data.title)} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main 2-Side Layout */}
        <div
          className={`flex flex-col lg:flex-row gap-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Side 1: Sticky Sidebar (Image or Video) */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl bg-black relative"
            >
              {isVideo ? (
                <div className="w-full h-full relative pointer-events-none">
                  {/* Overlay to catch clicks and prevent controls from showing */}
                  <div className="absolute inset-0 z-10 bg-transparent" />
                  <iframe
                    src={sidebarMedia}
                    className="w-full h-full absolute inset-0 border-0"
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title="Starbucks Delivery Promo"
                  />
                </div>
              ) : (
                <img
                  src={sidebarMedia}
                  alt={t(data.title)}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <div className="max-w-4xl">
              {/* Inner Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 ${textAlignClass}`}
              >
                <h1 className="text-4xl lg:text-5xl font-black text-starbucks-dark dark:text-white">
                  {t(data.title)}
                </h1>
              </motion.div>

              {/* 1. Intro Section (Toggleable) */}
              <div className="border-b border-gray-100 dark:border-gray-800 pb-12 mb-12">
                {/* Intro Image */}
                {data.intro?.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 rounded-3xl overflow-hidden shadow-lg aspect-video lg:aspect-[21/9]"
                  >
                    <img
                      src={t(data.intro.image)}
                      alt={t(data.title)}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Intro Toggle Button */}
                <button
                  onClick={() => toggleSection("intro")}
                  className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                >
                  <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
                    <span className="text-starbucks-green font-bold text-sm uppercase tracking-widest mb-1 opacity-80">
                      {lang === "ar" ? "نظرة عامة" : "Overview"}
                    </span>
                    <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
                      {lang === "ar"
                        ? "تجربة ستاربكس في منزلك"
                        : "Starbucks Experience At Home"}
                    </h3>
                  </div>
                  <div className="text-starbucks-green bg-gray-50 dark:bg-white/5 p-3 rounded-full flex-shrink-0">
                    {openSection === "intro" ? (
                      <Minus size={24} />
                    ) : (
                      <Plus size={24} />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openSection === "intro" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`pt-8 space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
                      >
                        {data.intro?.paragraphs?.map((p, idx) => (
                          <p key={idx} className="font-medium">
                            {t(p)}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Content Sections */}
              <div className="space-y-16">
                {data.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`pb-12 ${index !== data.sections.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
                  >
                    {/* Section Image Header */}
                    {section.image && (
                      <div className="mb-8 rounded-3xl overflow-hidden shadow-lg aspect-video lg:aspect-[21/9]">
                        <img
                          src={t(section.image)}
                          alt={t(section.title)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                    >
                      <div
                        className={`flex flex-col ${itemsAlignClass} flex-grow`}
                      >
                        <span className="text-starbucks-green font-bold text-sm uppercase tracking-widest mb-1 opacity-80">
                          {t(section.subtitle)}
                        </span>
                        <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
                          {t(section.title)}
                        </h3>
                      </div>
                      <div className="text-starbucks-green bg-gray-50 dark:bg-white/5 p-3 rounded-full flex-shrink-0">
                        {openSection === section.id ? (
                          <Minus size={24} />
                        ) : (
                          <Plus size={24} />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div
                            className={`pt-8 space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
                          >
                            {section.paragraphs?.map((p, pIdx) => (
                              <p key={pIdx}>{t(p)}</p>
                            ))}

                            {section.list && (
                              <ul
                                className={`space-y-4 ${isRTL ? "border-r-4 pr-6" : "border-l-4 pl-6"} border-starbucks-green/20 font-medium`}
                              >
                                {section.list.map((item, lIdx) => (
                                  <li key={lIdx}>{t(item)}</li>
                                ))}
                              </ul>
                            )}

                            {section.cta && section.ctaLink && (
                              <div className="pt-4">
                                <a
                                  href={section.ctaLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-3 bg-starbucks-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-starbucks-green-dark transition-all transform hover:scale-105 shadow-lg"
                                >
                                  {t(section.cta)}
                                  <ExternalLink size={20} />
                                </a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* 3. FAQ Accordion Section */}
              {data.accordion && (
                <div className="mt-8 pt-16 border-t-4 border-starbucks-green/10">
                  <h2
                    className={`text-3xl lg:text-4xl font-black text-starbucks-dark dark:text-white mb-12 ${textAlignClass}`}
                  >
                    {t(data.accordion.title)}
                  </h2>
                  <div className="space-y-6">
                    {data.accordion.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-white/5 rounded-3xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSection(`faq-${idx}`)}
                          className={`w-full p-8 flex items-center justify-between text-left group ${isRTL ? "text-right" : ""}`}
                        >
                          <span className="text-xl font-bold text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors">
                            {t(item.title)}
                          </span>
                          <div className="text-starbucks-green">
                            {openSection === `faq-${idx}` ? (
                              <Minus size={20} />
                            ) : (
                              <Plus size={20} />
                            )}
                          </div>
                        </button>
                        <AnimatePresence>
                          {openSection === `faq-${idx}` && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              <div
                                className={`px-8 pb-8 text-lg text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
                              >
                                {t(item.content)}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
