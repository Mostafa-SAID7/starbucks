import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  StaticPageLayout, 
  Accordion, 
  SEO,
  Button
} from "@/components";
import type { GenericPageProps } from "@/types";
import { SectionRenderer, SectionImageGrid } from "@/components/sections/generic";

export const GenericPage: React.FC<GenericPageProps> = ({
  data,
  seoTitle,
  showAccordion = false,
  accordionTitle,
  accordionSectionIndices = [1, 2, 3, 4],
  useAccordionLayout = false,
}) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = i18n.language === "ar";

  const renderSections = () => {
    if (useAccordionLayout) {
      return (
        <div className="space-y-4">
          <Accordion
            defaultIndex={0}
            items={data.sections.map((section) => ({
              title: section.title?.[lang] ?? "",
              content: (
                <div className="pt-4">
                  <SectionRenderer
                    section={section}
                    lang={lang}
                    isRTL={isRTL}
                    pageTitle={data.title[lang]}
                    hideTitle={true}
                    hideImageGrid={true}
                  />
                </div>
              ),
            }))}
          />
          {/* Render the last section's image grid outside the accordion */}
          {data.sections.slice(-1).map(
            (section) =>
              section.imageGrid?.images && (
                <div key={`${section.id}-grid`} className="mt-12">
                  <SectionImageGrid
                    imageGrid={section.imageGrid}
                    pageTitle={data.title[lang]}
                  />
                </div>
              ),
          )}
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {data.sections.map((section, index) => {
          // If layoutType is alternating, we force split layout with alternating positions
          if (data.layoutType === "alternating") {
            return (
              <section
                key={section.id}
                className={`py-24 lg:py-32 ${
                  index % 2 === 1
                    ? "bg-gray-50 dark:bg-zinc-900/30"
                    : "bg-white dark:bg-black"
                }`}
              >
                <div className="container mx-auto px-6">
                  <SectionRenderer
                    section={{
                      ...section,
                      layout: "split",
                      imagePosition: index % 2 === 1 ? "right" : "left",
                    }}
                    lang={lang}
                    isRTL={isRTL}
                    pageTitle={data.title[lang]}
                  />
                </div>
              </section>
            );
          }

          return (
            <SectionRenderer
              key={section.id}
              section={section}
              lang={lang}
              isRTL={isRTL}
              pageTitle={data.title[lang]}
            />
          );
        })}
      </div>
    );
  };

  const content = (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      <SEO title={seoTitle || data.title[lang]} />

      {/* Hero Section */}
      {data.hero && (
        <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={typeof data.hero.image === 'string' ? data.hero.image : data.hero.image[lang]}
              alt={data.hero.title[lang]}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="container relative mx-auto max-w-6xl px-6 py-20 text-center md:text-start text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-8"
            >
              <h1 className="text-4xl md:text-7xl font-black italic tracking-tight leading-tight">
                {data.hero.title[lang]}
              </h1>
              {data.hero.description && (
                <p className="text-xl text-gray-200 leading-relaxed max-w-xl mx-auto md:mx-0">
                  {data.hero.description[lang]}
                </p>
              )}
              {data.hero.cta && (
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-full bg-starbucks-green hover:bg-white hover:text-starbucks-green border-none px-12"
                    onClick={() =>
                      window.open(
                        data.hero?.ctaLink || "#",
                        data.hero?.ctaLink?.startsWith("http")
                          ? "_blank"
                          : "_self",
                      )
                    }
                  >
                    {data.hero.cta[lang]}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Page Layout Wrapper */}
      {data.layoutType === "sidebar" && data.sidebarImage ? (
        <div className="container mx-auto px-4 pt-8 pb-0 lg:py-12">
          <div className={`flex flex-col lg:flex-row gap-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}>
            
            {/* Side 1: Sticky Sidebar Image */}
            <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] group">
              <div className="h-full rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src={typeof data.sidebarImage === 'string' ? data.sidebarImage : data.sidebarImage?.[lang]}
                  alt={data.title[lang]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Side 2: Content Column */}
            <div className="lg:w-[60%]">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  {!data.hideMainTitle && (
                    <h1 className="text-4xl lg:text-5xl font-black text-starbucks-dark dark:text-white mb-6">
                      {data.title[lang]}
                    </h1>
                  )}
                  {data.lastUpdated && (
                    <span className="inline-block mb-4 px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full uppercase tracking-widest">
                      {data.lastUpdated[lang]}
                    </span>
                  )}
                </motion.div>

                {/* Intro */}
                {data.intro && (
                  <div className="space-y-6 mb-12 text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    {data.intro.title && (
                      <h2 className="text-2xl lg:text-3xl font-black text-starbucks-dark dark:text-white mb-6">
                        {data.intro.title[lang]}
                      </h2>
                    )}
                    {data.intro.paragraphs?.map((p, i) => (
                      <p key={i} className="font-medium">{p[lang]}</p>
                    ))}
                  </div>
                )}

                {renderSections()}

                {/* Data-level Accordion (e.g. for Delivery FAQ) */}
                {data.accordion && (
                  <div className="mt-16 space-y-8">
                    {data.accordion.title && (
                      <h2 className="text-3xl font-black text-starbucks-dark dark:text-white mb-8">
                        {data.accordion.title[lang]}
                      </h2>
                    )}
                    <Accordion
                      items={data.accordion.items?.map((item) => ({
                        title: typeof item.title === 'string' ? item.title : item.title?.[lang] || '',
                        content: (
                          <div className="pt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium whitespace-pre-line">
                            {typeof item.content === 'string' ? item.content : item.content?.[lang] || ''}
                          </div>
                        ),
                      })) || []}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : data.layoutType === "alternating" ? (
        <div className="overflow-hidden">
          {renderSections()}
          
          {/* Alternating layout also supports top-level accordion */}
          {data.accordion && (
            <div className="container mx-auto max-w-4xl px-6 py-24">
               {data.accordion.title && (
                <h2 className="text-4xl font-black text-center mb-12 italic text-starbucks-dark dark:text-white">
                  {data.accordion.title[lang]}
                </h2>
              )}
              <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-zinc-800">
                <Accordion
                  items={data.accordion.items?.map((item) => ({
                    title: typeof item.title === 'string' ? item.title : item.title?.[lang] || '',
                    content: (
                      <div className="pt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {typeof item.content === 'string' ? item.content : item.content?.[lang] || ''}
                      </div>
                    ),
                  })) || []}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <StaticPageLayout title={data.title} headerSubtitle={data.lastUpdated}>
          {data.intro && (
            <div className="space-y-4 mb-12">
              {data.intro.title && (
                <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">
                  {data.intro.title[lang]}
                </h1>
              )}
              {!data.intro.title && !data.hideMainTitle && (
                 <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">
                  {data.title[lang]}
                </h1>
              )}
              {data.intro.paragraphs?.map((p, i) => (
                <p
                  key={i}
                  className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  {p[lang]}
                </p>
              ))}
            </div>
          )}
          
          {renderSections()}

          {/* Top-level Accordion support for standard layout */}
          {data.accordion && (
            <div className="mt-20 space-y-8">
              {data.accordion.title && (
                <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white italic">
                  {data.accordion.title[lang]}
                </h2>
              )}
              <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] p-4 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
                <Accordion
                  items={data.accordion.items?.map((item) => ({
                    title: typeof item.title === 'string' ? item.title : item.title?.[lang] || '',
                    content: (
                      <div className="pt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {typeof item.content === 'string' ? item.content : item.content?.[lang] || ''}
                      </div>
                    ),
                  })) || []}
                />
              </div>
            </div>
          )}

          {/* Prop-driven Accordion (for backward compatibility/specific section grouping) */}
          {showAccordion && data.sections.length > 0 && (
            <div className="mt-24 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white italic">
                  {accordionTitle
                    ? accordionTitle[lang]
                    : lang === "ar"
                      ? "مزيد من المعلومات"
                      : "More Information"}
                </h2>
              </div>
              <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] p-4 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
                <Accordion
                  items={accordionSectionIndices
                    .map((idx) => data.sections[idx])
                    .filter(Boolean)
                    .map((section) => ({
                      title: section.title?.[lang] ?? "",
                      content: (
                        <div className="pt-4">
                          <SectionRenderer
                            section={section}
                            lang={lang}
                            isRTL={isRTL}
                            pageTitle={data.title[lang]}
                            hideTitle={true}
                            hideImageGrid={true}
                          />
                        </div>
                      ),
                    }))}
                />
              </div>
            </div>
          )}
        </StaticPageLayout>
      )}
    </div>
  );

  return content;
};

export default GenericPage;
