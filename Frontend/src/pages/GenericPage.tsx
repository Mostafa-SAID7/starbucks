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
  slug: propSlug,
  seoTitle,
  showAccordion = false,
  accordionTitle,
  accordionSectionIndices = [1, 2, 3, 4],
  useAccordionLayout = false,
}) => {
  const { t, i18n } = useTranslation(["pages", "common"]);
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = i18n.language === "ar";
  const slug = propSlug || data.slug;

  // Use translations if slug is available
  const localizedTitle = slug 
    ? t(`pages:${slug}.title`, { defaultValue: typeof data.title === 'string' ? data.title : data.title?.[lang] ?? "" }) 
    : (typeof data.title === 'string' ? data.title : data.title?.[lang] ?? "");
    
  const localizedLastUpdated = slug 
    ? t(`pages:${slug}.lastUpdated`, { defaultValue: typeof data.lastUpdated === 'string' ? data.lastUpdated : data.lastUpdated?.[lang] ?? "" }) 
    : (typeof data.lastUpdated === 'string' ? data.lastUpdated : data.lastUpdated?.[lang] ?? "");
  
  const introData = {
    title: slug 
      ? t(`pages:${slug}.intro.title`, { defaultValue: typeof data.intro?.title === 'string' ? data.intro.title : data.intro?.title?.[lang] ?? "" }) 
      : (typeof data.intro?.title === 'string' ? data.intro.title : data.intro?.title?.[lang] ?? ""),
    paragraphs: slug 
      ? t(`pages:${slug}.intro.paragraphs`, { returnObjects: true, defaultValue: data.intro?.paragraphs }) 
      : data.intro?.paragraphs,
  };

  const renderSections = () => {
    if (useAccordionLayout) {
      return (
        <div className="space-y-8">
          {data.sections.map((section, idx) => {
            const sectionTitle = slug 
              ? t(`pages:${slug}.sections.${section.id}.title`, { defaultValue: typeof section.title === 'string' ? section.title : section.title?.[lang] ?? "" }) 
              : (typeof section.title === 'string' ? section.title : section.title?.[lang] ?? "");

            // Resolve section image (string or LocalizedText object)
            const sectionImage = section.image
              ? (typeof section.image === 'string' ? section.image : section.image[lang])
              : null;

            return (
              <div key={section.id}>
                {/* Image rendered ABOVE the accordion item */}
                {sectionImage && (
                  <div className="mb-4 rounded-2xl overflow-hidden shadow-md aspect-video">
                    <img
                      src={sectionImage}
                      alt={sectionTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* imageGrid rendered ABOVE the accordion item */}
                {section.imageGrid?.images && (
                  <div className="mb-4">
                    <SectionImageGrid
                      imageGrid={section.imageGrid}
                      pageTitle={localizedTitle}
                    />
                  </div>
                )}

                {/* Accordion for just this section's text content */}
                <Accordion
                  defaultIndex={idx === 0 ? 0 : undefined}
                  items={[{
                    title: sectionTitle,
                    content: (
                      <div className="pt-4">
                        <SectionRenderer
                          section={section}
                          lang={lang}
                          isRTL={isRTL}
                          pageTitle={localizedTitle}
                          hideTitle={true}
                          hideImageGrid={true}
                          slug={slug}
                        />
                      </div>
                    ),
                  }]}
                />
              </div>
            );
          })}
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
                    pageTitle={localizedTitle}
                    slug={slug}
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
              pageTitle={localizedTitle}
              slug={slug}
            />
          );
        })}
      </div>
    );
  };

  const content = (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <SEO title={seoTitle || localizedTitle} />

      {/* Hero Section */}
      {data.hero && (
        <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={typeof data.hero.image === 'string' ? data.hero.image : data.hero.image[lang]}
              alt={slug ? t(`pages:${slug}.hero.title`, { defaultValue: typeof data.hero.title === 'string' ? data.hero.title : data.hero.title[lang] }) : (typeof data.hero.title === 'string' ? data.hero.title : data.hero.title[lang])}
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
                {slug ? t(`pages:${slug}.hero.title`, { defaultValue: typeof data.hero.title === 'string' ? data.hero.title : data.hero.title[lang] }) : (typeof data.hero.title === 'string' ? data.hero.title : data.hero.title[lang])}
              </h1>
              {(data.hero.description || (slug && t(`pages:${slug}.hero.description`))) && (
                <p className="text-xl text-gray-200 leading-relaxed max-w-xl mx-auto md:mx-0">
                  {slug ? t(`pages:${slug}.hero.description`, { defaultValue: typeof data.hero.description === 'string' ? data.hero.description : data.hero.description?.[lang] ?? "" }) : (typeof data.hero.description === 'string' ? data.hero.description : data.hero.description?.[lang] ?? "")}
                </p>
              )}
              {(data.hero.cta || (slug && t(`pages:${slug}.hero.cta`))) && (
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
                    {slug ? t(`pages:${slug}.hero.cta`, { defaultValue: typeof data.hero.cta === 'string' ? data.hero.cta : data.hero.cta?.[lang] ?? "" }) : (typeof data.hero.cta === 'string' ? data.hero.cta : data.hero.cta?.[lang] ?? "")}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Page Layout Wrapper */}
      {data.layoutType === "sidebar" && data.sidebarImage ? (
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Side 1: Sticky Sidebar Image or Video */}
            <div className="lg:w-[40%] lg:sticky lg:top-24 group">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative bg-black aspect-[3/4] lg:aspect-auto lg:h-[calc(100vh-8rem)]">
                {(() => {
                  const mediaUrl = typeof data.sidebarImage === 'string' ? data.sidebarImage : data.sidebarImage?.[lang];
                  const isVideo = mediaUrl?.includes("player.cloudinary.com") || mediaUrl?.includes("embed");
                  
                  if (isVideo) {
                    return (
                      <div className="w-full h-full relative pointer-events-none">
                        <div className="absolute inset-0 z-10 bg-transparent" />
                        <iframe
                          src={mediaUrl}
                          className="w-full h-full absolute inset-0 border-0"
                          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                          allowFullScreen
                          title={localizedTitle}
                        />
                      </div>
                    );
                  }
                  
                  return (
                    <img
                      src={mediaUrl}
                      alt={localizedTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  );
                })()}
              </div>
            </div>

            {/* Side 2: Content Column */}
            <div className="lg:w-[60%] space-y-16">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  {!data.hideMainTitle && (
                    <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                      {localizedTitle}
                    </h1>
                  )}
                  {localizedLastUpdated && (
                    <span className="inline-block mb-4 px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full uppercase tracking-widest">
                      {localizedLastUpdated}
                    </span>
                  )}
                </motion.div>

                {/* Intro */}
                {(introData.title || (Array.isArray(introData.paragraphs) && introData.paragraphs.length > 0) || data.intro?.image) && (
                  <div className="space-y-6 mb-12 text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    {data.intro?.image && (
                      <div className="mb-8 rounded-3xl overflow-hidden shadow-lg aspect-video lg:aspect-[21/9]">
                        <img
                          src={typeof data.intro.image === 'string' ? data.intro.image : data.intro.image[lang]}
                          alt={introData.title || localizedTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {introData.title && (
                      <h2 className="text-2xl lg:text-3xl font-black text-starbucks-dark dark:text-white mb-6">
                        {introData.title}
                      </h2>
                    )}
                    {Array.isArray(introData.paragraphs) && introData.paragraphs.map((p, i) => (
                      <p key={i} className="font-medium">{typeof p === 'string' ? p : p[lang]}</p>
                    ))}
                  </div>
                )}

                {renderSections()}

                {/* Data-level Accordion (e.g. for Delivery FAQ, Our Coffees brewing guides) */}
                {data.accordion && (
                  <div className="mt-16 space-y-8">
                    {(data.accordion.title || slug) && (() => {
                      const accordionTitle = slug
                        ? t(`pages:${slug}.accordion.title`, { defaultValue: typeof data.accordion!.title === 'string' ? data.accordion!.title : '' })
                        : (typeof data.accordion!.title === 'string' ? data.accordion!.title : '');
                      return accordionTitle ? (
                        <h2 className="text-3xl font-black text-starbucks-dark dark:text-white mb-8">
                          {accordionTitle}
                        </h2>
                      ) : null;
                    })()}
                    <Accordion
                      items={data.accordion.items?.map((item, i) => ({
                        title: slug ? t(`pages:${slug}.accordion.items.${i}.title`, { defaultValue: typeof item.title === 'string' ? item.title : item.title?.[lang] || '' }) : (typeof item.title === 'string' ? item.title : item.title?.[lang] || ''),
                        content: (
                          <div className="pt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium whitespace-pre-line">
                            {slug ? t(`pages:${slug}.accordion.items.${i}.content`, { defaultValue: typeof item.content === 'string' ? item.content : item.content?.[lang] || '' }) : (typeof item.content === 'string' ? item.content : item.content?.[lang] || '')}
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
                  {slug ? t(`pages:${slug}.accordion.title`, { defaultValue: typeof data.accordion.title === 'string' ? data.accordion.title : data.accordion.title[lang] }) : (typeof data.accordion.title === 'string' ? data.accordion.title : data.accordion.title[lang])}
                </h2>
              )}
              <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-zinc-800">
                <Accordion
                  items={data.accordion.items?.map((item, i) => ({
                    title: slug ? t(`pages:${slug}.accordion.items.${i}.title`, { defaultValue: typeof item.title === 'string' ? item.title : item.title?.[lang] || '' }) : (typeof item.title === 'string' ? item.title : item.title?.[lang] || ''),
                    content: (
                      <div className="pt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {slug ? t(`pages:${slug}.accordion.items.${i}.content`, { defaultValue: typeof item.content === 'string' ? item.content : item.content?.[lang] || '' }) : (typeof item.content === 'string' ? item.content : item.content?.[lang] || '')}
                      </div>
                    ),
                  })) || []}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <StaticPageLayout title={{ ar: localizedTitle, en: localizedTitle }} headerSubtitle={{ ar: localizedLastUpdated, en: localizedLastUpdated }}>
          {(introData.title || (Array.isArray(introData.paragraphs) && introData.paragraphs.length > 0)) && (
            <div className="space-y-4 mb-12">
              {introData.title && (
                <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">
                  {introData.title}
                </h1>
              )}
              {!introData.title && !data.hideMainTitle && (
                 <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">
                  {localizedTitle}
                </h1>
              )}
              {Array.isArray(introData.paragraphs) && introData.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  {typeof p === 'string' ? p : p[lang]}
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
                  {slug ? t(`pages:${slug}.accordion.title`, { defaultValue: typeof data.accordion.title === 'string' ? data.accordion.title : data.accordion.title[lang] }) : (typeof data.accordion.title === 'string' ? data.accordion.title : data.accordion.title[lang])}
                </h2>
              )}
              <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] p-4 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
                <Accordion
                  items={data.accordion.items?.map((item, i) => ({
                    title: slug ? t(`pages:${slug}.accordion.items.${i}.title`, { defaultValue: typeof item.title === 'string' ? item.title : item.title?.[lang] || '' }) : (typeof item.title === 'string' ? item.title : item.title?.[lang] || ''),
                    content: (
                      <div className="pt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {slug ? t(`pages:${slug}.accordion.items.${i}.content`, { defaultValue: typeof item.content === 'string' ? item.content : item.content?.[lang] || '' }) : (typeof item.content === 'string' ? item.content : item.content?.[lang] || '')}
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
                    : t("common:more_information", { defaultValue: "More Information" })}
                </h2>
              </div>
              <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] p-4 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
                <Accordion
                  items={accordionSectionIndices
                    .map((idx) => data.sections[idx])
                    .filter(Boolean)
                    .map((section) => ({
                      title: slug
                        ? t(`pages:${slug}.sections.${section.id}.title`, { defaultValue: typeof section.title === 'string' ? section.title : (section.title?.[lang] ?? "") })
                        : (typeof section.title === 'string' ? section.title : (section.title?.[lang] ?? "")),
                      content: (
                        <div className="pt-4">
                          <SectionRenderer
                            section={section}
                            lang={lang}
                            isRTL={isRTL}
                            pageTitle={localizedTitle}
                            hideTitle={true}
                            hideImageGrid={true}
                            slug={slug}
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
