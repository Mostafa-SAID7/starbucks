import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SEO, QueryErrorBoundary } from "@/components";
import { StaticPageSkeleton } from "@/components/skeletons";
import { useLanguage } from "@/hooks";
import { usePageData } from "@/hooks/queries";
import { type GenericPageData, type LocalizedText } from "@/types";
import { Plus, Minus } from "lucide-react";

const SustainabilityPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { lang, isRTL } = useLanguage();
  const { t: i18nextT } = useTranslation(["pages", "common"]);
  const [openSection, setOpenSection] = useState<string | null>("intro");

  const t = (obj: LocalizedText | string | null | undefined) => {
    if (!obj) return "";
    if (typeof obj === "string") return i18nextT(obj);
    return (obj as LocalizedText)[lang] || "";
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const textAlignClass = isRTL ? "text-right" : "text-left";
  const itemsAlignClass = "items-start";

  const pageTitle = i18nextT("pages:sustainability.title");
  const introTitle = i18nextT("pages:sustainability.intro.title", { defaultValue: i18nextT("pages:sustainability.header") });

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={i18nextT("pages:sustainability.seoTitle") || pageTitle} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Side 1: Sticky Sidebar Image */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={t(data.sidebarImage)}
                alt={pageTitle}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 ${textAlignClass}`}
              >
                <h1 className="text-4xl lg:text-5xl font-black text-starbucks-dark dark:text-white">
                  {pageTitle}
                </h1>
              </motion.div>

              {/* 1. Intro Section */}
              <div className="pb-12 mb-12">
                {data.intro?.image && (
                  <div className="mb-8 rounded-[2rem] overflow-hidden shadow-xl aspect-video">
                    <img
                      src={t(data.intro.image)}
                      className="w-full h-full object-cover"
                      alt={introTitle}
                    />
                  </div>
                )}
                <button
                  onClick={() => toggleSection("intro")}
                  className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                >
                  <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
                    <span className="text-starbucks-green font-bold text-sm uppercase tracking-widest mb-1 opacity-80">
                      {i18nextT("common:overview")}
                    </span>
                    <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
                      {introTitle}
                    </h3>
                  </div>
                  <div className="text-starbucks-green bg-gray-50 dark:bg-white/5 p-3 rounded-full flex-shrink-0">
                    {openSection === "intro" ? <Minus size={24} /> : <Plus size={24} />}
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
                        {(() => {
                          const introParagraphs = i18nextT("pages:sustainability.intro.paragraphs", { returnObjects: true });
                          return Array.isArray(introParagraphs) ? introParagraphs.map((p, idx) => (
                            <p key={idx} className="font-medium">
                              {p}
                            </p>
                          )) : null;
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Campaign Sections */}
              <div className="space-y-16">
                {data.sections.map((section) => {
                  const sTitle = i18nextT(`pages:sustainability.sections.${section.id}.title`, { defaultValue: "" });
                  const sSubtitle = i18nextT(`pages:sustainability.sections.${section.id}.subtitle`, { defaultValue: "" });
                  const sParagraphs = i18nextT(`pages:sustainability.sections.${section.id}.paragraphs`, { returnObjects: true, defaultValue: [] });
                  const sList = i18nextT(`pages:sustainability.sections.${section.id}.list`, { returnObjects: true, defaultValue: [] });
                  const sNote = i18nextT(`pages:sustainability.sections.${section.id}.note`, { defaultValue: "" });

                  return (
                    <div key={section.id} className="pb-12">
                      {section.image && (
                        <div className="mb-8 rounded-[2rem] overflow-hidden shadow-xl aspect-video">
                          <img
                            src={t(section.image)}
                            className="w-full h-full object-cover"
                            alt={sTitle}
                          />
                        </div>
                      )}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                      >
                        <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
                          {sSubtitle && (
                            <span className="text-starbucks-green font-bold text-sm uppercase tracking-widest mb-1 opacity-80">
                              {sSubtitle}
                            </span>
                          )}
                          <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
                            {sTitle}
                          </h3>
                        </div>
                        <div className="text-starbucks-green bg-gray-50 dark:bg-white/5 p-3 rounded-full flex-shrink-0">
                          {openSection === section.id ? <Minus size={24} /> : <Plus size={24} />}
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
                            <div className={`pt-8 space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}>
                              {Array.isArray(sParagraphs) && sParagraphs.map((p, pIdx) => (
                                <p key={pIdx}>{p}</p>
                              ))}

                              {Array.isArray(sList) && sList.length > 0 && (
                                <ul className={`space-y-4 ${isRTL ? "border-r-4 pr-6" : "border-l-4 pl-6"} border-starbucks-green/20 font-medium`}>
                                  {sList.map((item, lIdx) => (
                                    <li key={lIdx}>{item}</li>
                                  ))}
                                </ul>
                              )}

                              {sNote && sNote !== `pages:sustainability.sections.${section.id}.note` && (
                                <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 italic text-lg shadow-inner">
                                  {sNote}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SustainabilityPage = () => {
  const { data: pageData, isLoading } = usePageData("sustainability");

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      {pageData && <SustainabilityPageContent data={pageData as GenericPageData} />}
    </QueryErrorBoundary>
  );
};

export default SustainabilityPage;
