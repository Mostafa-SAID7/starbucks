import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SEO, SidebarTemplate } from '@/components';
import { useLanguage } from '@/hooks';
import type { GenericPageData, LocalizedText } from '@/types';
import { SustainabilityIntro } from './SustainabilityIntro';
import { SustainabilitySection } from './SustainabilitySection';
import { ANIMATION_CONFIG } from '@/lib/core/constants';


export function SustainabilityPageContent({ data }: { data: GenericPageData }) {
  const { lang, isRTL } = useLanguage();
  const { t: i18nextT } = useTranslation(['pages', 'common']);
  const [openSection, setOpenSection] = useState<string | null>('intro');

  const t = (obj: LocalizedText | string | null | undefined) => {
    if (!obj) return '';
    if (typeof obj === 'string') return i18nextT(obj);
    return (obj as LocalizedText)[lang] || '';
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const textAlignClass = isRTL ? 'text-right' : 'text-left';
  const itemsAlignClass = 'items-start';

  const pageTitle = i18nextT('pages:sustainability.title');
  const introTitle = i18nextT('pages:sustainability.intro.title', { defaultValue: i18nextT('pages:sustainability.header') });
  
  // Safe parsing of translation paragraphs
  const rawIntroParagraphs = i18nextT('pages:sustainability.intro.paragraphs', { returnObjects: true });
  const introParagraphs = Array.isArray(rawIntroParagraphs) ? rawIntroParagraphs : [];

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO title={i18nextT('pages:sustainability.seoTitle') || pageTitle} />

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <SidebarTemplate image={t(data.sidebarImage)} title={pageTitle}>
          <div className="max-w-4xl">
            <motion.div
              {...ANIMATION_CONFIG.VARIANTS.SLIDE_UP}
              className={`mb-12 ${textAlignClass}`}
            >
              <h1 className="text-4xl lg:text-7xl font-black text-starbucks-dark dark:text-white tracking-tight">
                {pageTitle}
              </h1>
            </motion.div>

            {/* 1. Intro Section */}
            <SustainabilityIntro
              image={data.intro?.image ? t(data.intro.image) : undefined}
              title={introTitle}
              overviewLabel={i18nextT('common:overview')}
              paragraphs={introParagraphs}
              isOpen={openSection === 'intro'}
              onToggle={() => toggleSection('intro')}
              textAlignClass={textAlignClass}
              itemsAlignClass={itemsAlignClass}
            />

            {/* 2. Campaign Sections */}
            <div className="space-y-20">
              {data.sections.map((section) => {
                const sTitle = i18nextT(`pages:sustainability.sections.${section.id}.title`, { defaultValue: '' });
                const sSubtitle = i18nextT(`pages:sustainability.sections.${section.id}.subtitle`, { defaultValue: '' });
                const sNote = i18nextT(`pages:sustainability.sections.${section.id}.note`, { defaultValue: '' });

                const rawParagraphs = i18nextT(`pages:sustainability.sections.${section.id}.paragraphs`, { returnObjects: true, defaultValue: [] });
                const sParagraphs = Array.isArray(rawParagraphs) ? rawParagraphs : [];

                const rawList = i18nextT(`pages:sustainability.sections.${section.id}.list`, { returnObjects: true, defaultValue: [] });
                const sList = Array.isArray(rawList) ? rawList : [];

                return (
                  <SustainabilitySection
                    key={section.id}
                    id={section.id}
                    image={section.image ? t(section.image) : undefined}
                    title={sTitle}
                    subtitle={sSubtitle}
                    paragraphs={sParagraphs}
                    list={sList}
                    note={sNote}
                    isOpen={openSection === section.id}
                    onToggle={() => toggleSection(section.id)}
                    textAlignClass={textAlignClass}
                    itemsAlignClass={itemsAlignClass}
                    isRTL={isRTL}
                  />
                );
              })}
            </div>
          </div>
        </SidebarTemplate>
      </div>
    </div>
  );
}
