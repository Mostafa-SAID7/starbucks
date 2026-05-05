import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { StaticPageLayout, Accordion, SEO } from "@/components";
import type { LocalizedText } from "@/types";
import { SectionRenderer } from "./components";

// Generic section type that can handle various content structures
export interface GenericSection {
  id: string;
  title: LocalizedText;
  paragraphs?: LocalizedText[];
  list?: (LocalizedText & { link?: string })[];
  subsections?: {
    title?: LocalizedText;
    paragraphs?: LocalizedText[];
    list?: LocalizedText[];
  }[];
  types?: {
    id: string;
    label: LocalizedText;
    text: LocalizedText;
  }[];
  contactInfo?: {
    email: string;
    phone: string;
    phoneTel: string;
    address?: LocalizedText;
  };
  contactNote?: LocalizedText;
  definitions?: {
    term: LocalizedText;
    definition: LocalizedText;
  }[];
  groups?: {
    title: LocalizedText;
    paragraphs: LocalizedText[];
  }[];
  imageGrid?: {
    images: string[];
    columns?: 2 | 3 | 4;
    aspectRatio?: "square" | "video" | "portrait";
  };
}

export interface GenericPageData {
  title: LocalizedText;
  subtitle?: LocalizedText;
  lastUpdated?: LocalizedText;
  intro?: {
    title?: LocalizedText;
    paragraphs?: LocalizedText[];
  };
  sections: GenericSection[];
  accordion?: {
    title?: LocalizedText;
    items?: {
      title: string;
      content: string;
    }[];
  };
  sidebarImage?: string; // URL for sticky sidebar image
}

export interface GenericPageProps {
  data: GenericPageData;
  seoTitle?: string;
  showAccordion?: boolean;
  accordionTitle?: LocalizedText;
  accordionSectionIndices?: number[];
}

export const GenericPage: React.FC<GenericPageProps> = ({
  data,
  seoTitle,
  showAccordion = false,
  accordionTitle,
  accordionSectionIndices = [1, 2, 3, 4],
}) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = i18n.language === "ar";

  // Render with sticky sidebar image if provided
  if (data.sidebarImage) {
    return (
      <>
        <SEO title={seoTitle || data.title[lang]} />
        <div className="min-h-screen bg-white dark:bg-black">
          {/* Container for both content and image */}
          <div className="container mx-auto max-w-7xl px-6 py-16 lg:py-24 overflow-visible">
            <div
              className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full"
            >
              {/* Content Column - Scrollable */}
              <div className="flex-1 min-w-0 lg:w-1/2">
                {/* Page Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <h1 className="text-4xl lg:text-5xl font-black text-starbucks-dark dark:text-white mb-4">
                    {data.title[lang]}
                  </h1>
                  {data.lastUpdated && (
                    <p className="text-sm text-gray-400">
                      {data.lastUpdated[lang]}
                    </p>
                  )}
                </motion.div>

                {/* Intro Section */}
                {data.intro && (
                  <div className="space-y-4 mb-12">
                    {data.intro.title && (
                      <h2 className="text-2xl font-bold text-starbucks-dark dark:text-white">
                        {data.intro.title[lang]}
                      </h2>
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

                {/* Main Sections */}
                <div className="space-y-12">
                  {data.sections.map((section) => (
                    <SectionRenderer
                      key={section.id}
                      section={section}
                      lang={lang}
                      isRTL={isRTL}
                      pageTitle={data.title[lang]}
                    />
                  ))}
                </div>

                {/* Accordion Section */}
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
                            title: section.title[lang],
                            content: section.paragraphs?.[0]?.[lang] || "",
                          }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Sidebar Image Column */}
              <div className="hidden lg:block flex-shrink-0 lg:w-1/2">
                <aside className="lg:sticky lg:top-24">
                  <div className="max-h-[calc(100vh-8rem)] w-full rounded-3xl shadow-2xl overflow-hidden">
                    <img
                      src={data.sidebarImage}
                      alt={data.title[lang]}
                      className="w-full h-full object-cover rounded-3xl"
                      loading="eager"
                    />
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default layout without sidebar image
  return (
    <>
      <SEO title={seoTitle || data.title[lang]} />
      <StaticPageLayout
        title={data.title}
        headerSubtitle={data.lastUpdated}
      >
        {/* Intro Section */}
        {data.intro && (
          <div className="space-y-4 mb-12">
            {data.intro.title && (
              <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">
                {data.intro.title[lang]}
              </h1>
            )}
            {data.lastUpdated && (
              <p className="text-sm text-gray-400">{data.lastUpdated[lang]}</p>
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

        {/* Main Sections */}
        <div className="space-y-12">
          {data.sections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              lang={lang}
              isRTL={isRTL}
              pageTitle={data.title[lang]}
            />
          ))}
        </div>

        {/* Accordion Section */}
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
                    title: section.title[lang],
                    content: section.paragraphs?.[0]?.[lang] || "",
                  }))}
              />
            </div>
          </div>
        )}
      </StaticPageLayout>
    </>
  );
};

export default GenericPage;
