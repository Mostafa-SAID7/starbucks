import React from "react";
import { useTranslation } from "react-i18next";
import { StaticSection, Button } from "@/components";
import type { GenericSection } from "@/types";
import { SectionParagraphs } from "./SectionParagraphs";
import { SectionList } from "./SectionList";
import { SectionSubsections } from "./SectionSubsections";
import { SectionTypes } from "./SectionTypes";
import { SectionDefinitions } from "./SectionDefinitions";
import { SectionGroups } from "./SectionGroups";
import { SectionContactInfo } from "./SectionContactInfo";
import { SectionImageGrid } from "./SectionImageGrid";

interface SectionRendererProps {
  section: GenericSection;
  lang: "ar" | "en";
  isRTL: boolean;
  pageTitle: string;
  hideTitle?: boolean;
  hideImageGrid?: boolean;
  hideSideBorder?: boolean;
  slug?: string;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  lang,
  isRTL,
  pageTitle,
  hideTitle = false,
  hideImageGrid = false,
  slug,
}) => {
  const { t } = useTranslation(["pages", "common"]);

  // Use translations if slug and section.id are available
  const localizedTitle = slug ? t(`pages:${slug}.sections.${section.id}.title`, { defaultValue: "" }) : (section.title?.[lang] ?? "");
  const localizedSubtitle = slug ? t(`pages:${slug}.sections.${section.id}.subtitle`, { defaultValue: "" }) : (section.subtitle?.[lang] ?? "");
  const localizedParagraphs = slug ? t(`pages:${slug}.sections.${section.id}.paragraphs`, { returnObjects: true, defaultValue: section.paragraphs }) : section.paragraphs;
  const localizedNote = slug ? t(`pages:${slug}.sections.${section.id}.note`, { defaultValue: "" }) : (section.note?.[lang] ?? "");
  const localizedContactNote = slug ? t(`pages:${slug}.sections.${section.id}.contactNote`, { defaultValue: "" }) : (section.contactNote?.[lang] ?? "");
  const localizedCta = slug ? t(`pages:${slug}.sections.${section.id}.cta`, { defaultValue: "" }) : (section.cta?.[lang] ?? "");
  const localizedList = slug ? t(`pages:${slug}.sections.${section.id}.list`, { returnObjects: true, defaultValue: section.list }) : section.list;

  // Handle contact info address localization
  const processedContactInfo = section.contactInfo ? {
    ...section.contactInfo,
    address: slug && section.contactInfo.address 
      ? (typeof t(`pages:${slug}.sections.${section.id}.contactInfo.address`, { defaultValue: "" }) === 'string' 
          ? t(`pages:${slug}.sections.${section.id}.contactInfo.address`, { defaultValue: "" })
          : (typeof section.contactInfo.address === 'object' ? (section.contactInfo.address as any)[lang] : section.contactInfo.address))
      : (typeof section.contactInfo.address === 'object' ? (section.contactInfo.address as any)[lang] : section.contactInfo.address)
  } : undefined;

  const content = (
    <div className="flex-1 space-y-6">
      {localizedSubtitle && (
        <p className="text-xl text-starbucks-green font-bold italic">
          {localizedSubtitle}
        </p>
      )}
      
      {/* Paragraphs */}
      {Array.isArray(localizedParagraphs) && (
        <SectionParagraphs paragraphs={localizedParagraphs} lang={lang} />
      )}
 
      {/* Simple List */}
      {Array.isArray(localizedList) && (
        <SectionList list={localizedList} lang={lang} isRTL={isRTL} />
      )}
 
      {/* Subsections */}
      {section.subsections && (
        <SectionSubsections
          subsections={section.subsections}
          lang={lang}
          isRTL={isRTL}
          slug={slug}
          sectionId={section.id}
        />
      )}
 
      {/* Types/Categories */}
      {section.types && <SectionTypes types={section.types} lang={lang} />}
 
      {/* Definitions */}
      {section.definitions && (
        <SectionDefinitions definitions={section.definitions} lang={lang} />
      )}
 
      {/* Groups */}
      {section.groups && <SectionGroups groups={section.groups} lang={lang} />}
 
      {/* Contact Info & Note */}
      {processedContactInfo && (
        <SectionContactInfo
          contactInfo={processedContactInfo as any}
          contactNote={localizedContactNote ? { ar: localizedContactNote, en: localizedContactNote } : undefined}
          lang={lang}
        />
      )}
 
      {/* Note */}
      {localizedNote && (
        <p className="text-sm italic mt-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl text-gray-600 dark:text-gray-400">
          {localizedNote}
        </p>
      )}

      {/* CTA Button */}
      {localizedCta && section.ctaLink && (
        <div className="pt-4">
          <Button
            variant="outline"
            className="rounded-full border-2 border-starbucks-green text-starbucks-green hover:bg-starbucks-green hover:text-white font-extrabold px-8"
            onClick={() => window.open(section.ctaLink, section.ctaLink?.startsWith('http') ? '_blank' : '_self')}
          >
            {localizedCta}
          </Button>
        </div>
      )}

      {/* Image Grid */}
      {section.imageGrid?.images && !hideImageGrid && (
        <SectionImageGrid imageGrid={section.imageGrid} pageTitle={pageTitle} />
      )}
    </div>
  );

  if (section.layout === "split" || section.image) {
    const isImageRight = section.imagePosition === "right";
    return (
      <StaticSection id={section.id} title={{ ar: localizedTitle, en: localizedTitle }} hideTitle={hideTitle || !localizedTitle} hideSideBorder={section.hideSideBorder}>
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${isImageRight ? "" : "lg:flex-row-reverse"}`}>
          {content}
          {section.image && (() => {
            const imageUrl = typeof section.image === 'string' ? section.image : section.image[lang];
            const isLogo = imageUrl.toLowerCase().includes('.png') || imageUrl.toLowerCase().includes('logo');
            
            return (
              <div className="flex-1 w-full">
                <div className={`relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl ${isLogo ? 'bg-gray-50 dark:bg-zinc-800/30' : ''}`}>
                  <img
                    src={imageUrl}
                    alt={localizedTitle || pageTitle}
                    className={`w-full h-full transition-transform duration-700 hover:scale-105 ${isLogo ? 'object-contain p-8 lg:p-12' : 'object-cover'}`}
                  />
                  {!isLogo && <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />}
                </div>
              </div>
            );
          })()}
        </div>
      </StaticSection>
    );
  }

  return (
    <StaticSection key={section.id} id={section.id} title={{ ar: localizedTitle, en: localizedTitle }} hideTitle={hideTitle || !localizedTitle} hideSideBorder={section.hideSideBorder}>
      {content}
    </StaticSection>
  );
};
