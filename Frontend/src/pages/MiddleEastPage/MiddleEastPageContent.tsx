import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components';
import { useLanguage } from '@/hooks';
import type { GenericPageData, LocalizedText } from '@/types';
import { AccordionSection } from './AccordionSection';
import { ANIMATION_CONFIG } from '@/lib/core/constants';


interface MiddleEastPageContentProps {
  data: GenericPageData;
}

export function MiddleEastPageContent({ data }: MiddleEastPageContentProps) {
  const { lang, isRTL } = useLanguage();
  const { t: i18nextT } = useTranslation();
  const [openSection, setOpenSection] = useState<string | null>('intro');
  const slug = 'middle-east';

  const t = (path: string, defaultValue: unknown = '') => {
    return i18nextT(`pages:${slug}.${path}`, {
      defaultValue:
        typeof defaultValue === 'object' && defaultValue !== null
          ? (defaultValue as Record<string, unknown>)[lang]
          : defaultValue,
    });
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const localizedTitle = t('title', data.title);
  const localizedLastUpdated = t('lastUpdated', data.lastUpdated);
  const localizedIntroTitle = t('intro.title', data.intro?.title);
  const localizedIntroParagraphs = i18nextT(`pages:${slug}.intro.paragraphs`, {
    returnObjects: true,
    defaultValue: data.intro?.paragraphs,
  }) as (string | LocalizedText)[];
  const localizedUpdateNote = t('updateNote', data.updateNote);

  const textAlignClass = isRTL ? 'text-right' : 'text-left';
  const itemsAlignClass = 'items-start';

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO title={localizedTitle} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div
          className={`flex flex-col lg:flex-row gap-12 ${
            isRTL ? 'lg:flex-row-reverse' : ''
          }`}
        >
          <div className="lg:w-[40%] lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] group">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={
                  typeof data.sidebarImage === 'string'
                    ? data.sidebarImage
                    : data.sidebarImage?.[lang] || ''
                }
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

              <AccordionSection
                id="intro"
                isOpen={openSection === 'intro'}
                onToggle={toggleSection}
                title={localizedIntroTitle}
                paragraphs={localizedIntroParagraphs}
                textAlignClass={textAlignClass}
                itemsAlignClass={itemsAlignClass}
                overline={i18nextT('common:overview')}
              />

              <div className="space-y-0">
                {data.sections.map((section) => {
                  const sectionTitle = i18nextT(`pages:${slug}.sections.${section.id}.title`, {
                    defaultValue:
                      typeof section.title === 'string'
                        ? section.title
                        : section.title?.[lang] || '',
                  });
                  const sectionParagraphs = i18nextT(
                    `pages:${slug}.sections.${section.id}.paragraphs`,
                    {
                      returnObjects: true,
                      defaultValue: section.paragraphs,
                    }
                  ) as (string | LocalizedText)[];

                  return (
                    <AccordionSection
                      key={section.id}
                      id={section.id}
                      isOpen={openSection === section.id}
                      onToggle={toggleSection}
                      title={sectionTitle}
                      paragraphs={sectionParagraphs}
                      textAlignClass={textAlignClass}
                      itemsAlignClass={itemsAlignClass}
                    />
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
}
