import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SEO } from "@/components";
import { middleEast } from "@/data";
import { type GenericPageData } from "@/types";
import { Plus, Minus } from "lucide-react";

export const MiddleEastPage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const data = (middleEast as unknown as GenericPageData);
  const isRTL = lang === "ar";
  const [openSection, setOpenSection] = useState<string | null>("intro");

  const t = (obj: any) => obj?.[lang] || obj;

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

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
        <div className={`flex flex-col lg:flex-row gap-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}>

          {/* Side 1: Sticky Sidebar Image */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] group">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={t(data.sidebarImage)}
                alt={t(data.title)}
                className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <div className="max-w-4xl">

              {/* Last Updated Badge + Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 ${textAlignClass}`}
              >
                {data.lastUpdated && (
                  <span className="inline-block mb-4 px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full uppercase tracking-widest">
                    {t(data.lastUpdated)}
                  </span>
                )}
                <h1 className="text-4xl lg:text-5xl font-black text-starbucks-dark dark:text-white">
                  {t(data.title)}
                </h1>
              </motion.div>

              {/* 1. Intro Section (Toggleable) */}
              <div className="border-b border-gray-100 dark:border-gray-800 pb-12 mb-12">
                <button
                  onClick={() => toggleSection("intro")}
                  className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                >
                  <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
                    <span className="text-starbucks-green font-bold text-sm uppercase tracking-widest mb-1 opacity-80">
                      {lang === "ar" ? "نظرة عامة" : "Overview"}
                    </span>
                    <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
                      {t(data.intro?.title)}
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
                      <div className={`pt-8 space-y-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}>
                        {data.intro?.paragraphs?.map((p, idx) => (
                          <p key={idx} className="font-medium">{t(p)}</p>
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
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                    >
                      <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
                        <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
                          {t(section.title)}
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
                          <div className={`pt-8 space-y-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}>
                            {section.paragraphs?.map((p, pIdx) => (
                              <p key={pIdx} className="font-medium">{t(p)}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Update Note */}
              {data.updateNote && (
                <div className={`mt-12 p-6 rounded-2xl border border-starbucks-green/30 bg-starbucks-green/5 dark:bg-starbucks-green/10 ${textAlignClass}`}>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                    {t(data.updateNote)}
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

export default MiddleEastPage;
