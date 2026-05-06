import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  SEO, 
  Accordion 
} from "@/components";
import { SectionRenderer } from "@/components/sections/generic/SectionRenderer";
import { middleEast } from "@/data";
import { type GenericPageData } from "@/types";

export const MiddleEastPage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const data = (middleEast as unknown as GenericPageData);

  const t = (obj: any) => obj?.[lang] || obj;

  return (
    <>
      <SEO title={t(data.title)} />
      
      <div className="flex flex-col-reverse lg:flex-row bg-background-light dark:bg-background-dark">
        {/* Content Column */}
        <div className="w-full lg:w-3/5 p-6 md:p-12 lg:p-20 xl:p-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 lg:mb-16"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 text-[10px] lg:text-xs font-bold rounded-full">
                {t(data.lastUpdated)}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 lg:mb-10 leading-tight">
              {t(data.intro?.title)}
            </h1>

            <div className="space-y-6 lg:space-y-8 mb-12 lg:mb-16">
              {data.intro?.paragraphs?.map((p, i) => (
                <p key={i} className="text-base md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {t(p)}
                </p>
              ))}
            </div>

            <div className="space-y-12 lg:space-y-16">
              {data.sections.map((section) => (
                <SectionRenderer 
                  key={section.id} 
                  section={section} 
                  lang={lang}
                  isRTL={lang === 'ar'}
                  pageTitle={t(data.title)}
                />
              ))}
            </div>

            {/* Statement Accordion Section */}
            <div className="mt-12 lg:mt-16 bg-white dark:bg-zinc-900/50 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm p-5 md:p-10">
              <Accordion 
                items={data.sections.map(section => ({
                  title: t(section.title),
                  content: section.paragraphs?.map(p => t(p)).join('\n\n') || ''
                }))} 
              />
            </div>

            {data.updateNote && (
              <p className="mt-10 lg:mt-12 text-xs lg:text-sm text-gray-500 italic">
                {t(data.updateNote)}
              </p>
            )}
          </motion.div>
        </div>

        {/* Sidebar Image Column */}
        <div className="w-full lg:w-2/5 relative aspect-video lg:aspect-auto lg:h-screen lg:sticky lg:top-0">
          <img
            src="https://www.starbucks.eg/sites/starbucks-eg-pwa/files/styles/c11_banner_full_1600x621/public/2021-01/DeliveryBanner.jpg.webp"
            alt={t(data.title)}
            className="w-full h-full object-cover grayscale opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-starbucks-green/40 via-transparent to-transparent" />
          
          <div className="absolute bottom-8 lg:bottom-16 left-8 lg:left-12 right-8 lg:right-12 text-white pointer-events-none">
            <h2 className="text-2xl lg:text-3xl font-black mb-2 lg:mb-4 leading-tight">{t(data.title)}</h2>
            <div className="w-12 lg:w-16 h-1 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MiddleEastPage;
