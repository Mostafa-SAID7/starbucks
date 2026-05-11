import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SEO, QueryErrorBoundary } from "@/components";
import { StaticPageSkeleton } from "@/components/skeletons";
import { useLanguage } from "@/hooks";
import { usePageData } from "@/hooks/queries";
import { type GenericPageData, type LocalizedText } from "@/types";
import { Plus, Minus } from "lucide-react";

const MiddleEastPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { lang, isRTL } = useLanguage();
  const { t: i18nextT } = useTranslation();
  const [openSection, setOpenSection] = useState<string | null>("intro");
  const slug = "middle-east";

  const t = (path: string, defaultValue: unknown = "") => {
    return i18nextT(`pages:${slug}.${path}`, { 
      defaultValue: typeof defaultValue === 'object' && defaultValue !== null 
        ? (defaultValue as Record<string, unknown>)[lang] 
        : defaultValue 
    });
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const localizedTitle = t("title", data.title);
  const localizedLastUpdated = t("lastUpdated", data.lastUpdated);
  const localizedIntroTitle = t("intro.title", data.intro?.title);
  const localizedIntroParagraphs = i18nextT(`pages:${slug}.intro.paragraphs`, { 
    returnObjects: true, 
    defaultValue: data.intro?.paragraphs 
  }) as (string | LocalizedText)[];
  const localizedUpdateNote = t("updateNote", data.updateNote);

  const textAlignClass = isRTL ? "text-right" : "text-left";
  const itemsAlignClass = "items-start";

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={localizedTitle} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div
          className={`flex flex-col lg:flex-row gap-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          <div className="lg:w-[40%] lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] group">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={typeof data.sidebarImage === 'string' ? data.sidebarImage : (data.sidebarImage?.[lang] || "")}
                alt={localizedTitle}
                className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </motion.div>
          </div>

          <div className="lg:w-[60%]">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 ${textAlignClass}`}
              >
                {localizedLastUpdated && (
                  <span className="inline-block mb-4 px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full uppercase tracking-widest">
                    {localizedLastUpdated}
                  </span>
                )}
                <h1 className="text-4xl lg:text-5xl font-black text-starbucks-dark dark:text-white">
                  {localizedTitle}
                </h1>
              </motion.div>

              <div className="border-b border-gray-100 dark:border-gray-800 pb-12 mb-12">
                <button
                  onClick={() => toggleSection("intro")}
                  className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                >
                  <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
                    <span className="text-starbucks-green font-bold text-sm uppercase tracking-widest mb-1 opacity-80">
                      {i18nextT("common:overview")}
                    </span>
                    <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
                      {localizedIntroTitle}
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
                        className={`pt-8 space-y-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
                      >
                        {Array.isArray(localizedIntroParagraphs) && localizedIntroParagraphs.map((p, idx) => (
                          <p key={idx} className="font-medium">
                            {typeof p === 'string' ? p : p[lang]}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-16">
                {data.sections.map((section, index) => {
                  const sectionTitle = i18nextT(`pages:${slug}.sections.${section.id}.title`, { 
                    defaultValue: typeof section.title === 'string' ? section.title : section.title?.[lang] || "" 
                  });
                  const sectionParagraphs = i18nextT(`pages:${slug}.sections.${section.id}.paragraphs`, { 
                    returnObjects: true, 
                    defaultValue: section.paragraphs 
                  }) as (string | LocalizedText)[];

                  return (
                    <div
                      key={section.id}
                      className={`pb-12 ${index !== data.sections.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                      >
                        <div
                          className={`flex flex-col ${itemsAlignClass} flex-grow`}
                        >
                          <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
                            {sectionTitle}
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
                              className={`pt-8 space-y-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
                            >
                              {Array.isArray(sectionParagraphs) && sectionParagraphs.map((p, pIdx) => (
                                <p key={pIdx} className="font-medium">
                                  {typeof p === 'string' ? p : p[lang]}
                                </p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {localizedUpdateNote && (
                <div
                  className={`mt-12 p-6 rounded-2xl border border-starbucks-green/30 bg-starbucks-green/5 dark:bg-starbucks-green/10 ${textAlignClass}`}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                    {localizedUpdateNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MiddleEastPage = () => {
  const { data: pageData, isLoading } = usePageData("middle-east");

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      {pageData && <MiddleEastPageContent data={pageData as GenericPageData} />}
    </QueryErrorBoundary>
  );
};

export default MiddleEastPage;
