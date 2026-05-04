import React from "react";
import { StaticSection } from "@/components";
import type { GenericSection } from "../GenericPage";
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
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  lang,
  isRTL,
  pageTitle,
}) => {
  return (
    <StaticSection key={section.id} id={section.id} title={section.title}>
      {/* Paragraphs */}
      {section.paragraphs && (
        <SectionParagraphs paragraphs={section.paragraphs} lang={lang} />
      )}

      {/* Simple List */}
      {section.list && (
        <SectionList list={section.list} lang={lang} isRTL={isRTL} />
      )}

      {/* Subsections */}
      {section.subsections && (
        <SectionSubsections
          subsections={section.subsections}
          lang={lang}
          isRTL={isRTL}
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
      {section.contactInfo && (
        <SectionContactInfo
          contactInfo={section.contactInfo}
          contactNote={section.contactNote}
          lang={lang}
        />
      )}

      {/* Image Grid */}
      {section.imageGrid?.images && (
        <SectionImageGrid imageGrid={section.imageGrid} pageTitle={pageTitle} />
      )}
    </StaticSection>
  );
};
