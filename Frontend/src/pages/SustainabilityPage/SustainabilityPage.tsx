import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SEO, QueryErrorBoundary, SidebarTemplate } from "@/components";
import { StaticPageSkeleton } from "@/components/skeletons";
import { useLanguage } from "@/hooks";
import { usePageData } from "@/hooks/queries";
import { type GenericPageData, type LocalizedText } from "@/types";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/ui";

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

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <SidebarTemplate
          image={t(data.sidebarImage)}
          title={pageTitle}
        >
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-12 ${textAlignClass}`}
            >
              <h1 className="text-4xl lg:text-7xl font-black text-starbucks-dark dark:text-white tracking-tight">
                {pageTitle}
              </h1>
            </motion.div>

            {/* 1. Intro Section */}
            <div className="pb-12 mb-12 border-b border-gray-100 dark:border-zinc-800">
              {data.intro?.image && (
                <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video relative group">
                  <img
                    src={t(data.intro.image)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={introTitle}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
              )}
              <button
                onClick={() => toggleSection("intro")}
                className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
              >
                <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
                  <span className="text-starbucks-green font-black text-sm uppercase tracking-[0.2em] mb-2 opacity-80">
                    {i18nextT("common:overview")}
                  </span>
                  <h3 className="text-3xl lg:text-5xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-all leading-tight">
                    {introTitle}
                  </h3>
                </div>
                <div className="text-starbucks-green bg-starbucks-green/5 dark:bg-white/5 p-4 rounded-full flex-shrink-0 transition-transform group-hover:scale-110">
                  {openSection === "intro" ? <Minus size={28} /> : <Plus size={28} />}
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
                      className={`pt-10 space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
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
            <div className="space-y-20">
              {data.sections.map((section) => {
                const sTitle = i18nextT(`pages:sustainability.sections.${section.id}.title`, { defaultValue: "" });
                const sSubtitle = i18nextT(`pages:sustainability.sections.${section.id}.subtitle`, { defaultValue: "" });
                const sParagraphs = i18nextT(`pages:sustainability.sections.${section.id}.paragraphs`, { returnObjects: true, defaultValue: [] });
                const sList = i18nextT(`pages:sustainability.sections.${section.id}.list`, { returnObjects: true, defaultValue: [] });
                const sNote = i18nextT(`pages:sustainability.sections.${section.id}.note`, { defaultValue: "" });

                return (
                  <div key={section.id} className="pb-12 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                    {section.image && (
                      <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video relative group">
                        <img
                          src={t(section.image)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt={sTitle}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      </div>
                    )}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                    >
                      <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
                        {sSubtitle && (
                          <span className="text-starbucks-green font-black text-sm uppercase tracking-[0.2em] mb-2 opacity-80">
                            {sSubtitle}
                          </span>
                        )}
                        <h3 className="text-3xl lg:text-5xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-all leading-tight">
                          {sTitle}
                        </h3>
                      </div>
                      <div className="text-starbucks-green bg-starbucks-green/5 dark:bg-white/5 p-4 rounded-full flex-shrink-0 transition-transform group-hover:scale-110">
                        {openSection === section.id ? <Minus size={28} /> : <Plus size={28} />}
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
                          <div className={`pt-10 space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}>
                            {Array.isArray(sParagraphs) && sParagraphs.map((p, pIdx) => (
                              <p key={pIdx}>{p}</p>
                            ))}

                            {Array.isArray(sList) && sList.length > 0 && (
                              <ul className={`space-y-6 ${isRTL ? "border-r-4 pr-8" : "border-l-4 pl-8"} border-starbucks-green/30 font-medium`}>
                                {sList.map((item, lIdx) => (
                                  <li key={lIdx} className="relative">
                                    <span className={cn(
                                      "absolute top-3 w-2 h-2 rounded-full bg-starbucks-green",
                                      isRTL ? "-right-10" : "-left-10"
                                    )} />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {sNote && sNote !== `pages:sustainability.sections.${section.id}.note` && (
                              <div className="p-10 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-gray-800 italic text-lg shadow-inner text-starbucks-dark dark:text-gray-200">
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
        </SidebarTemplate>
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
