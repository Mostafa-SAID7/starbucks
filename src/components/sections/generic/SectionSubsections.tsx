import React from "react";
import { useTranslation } from "react-i18next";
import type { GenericSubsection } from "@/types/generic-page";

interface SectionSubsectionsProps {
  subsections: GenericSubsection[];
  lang: "ar" | "en";
  isRTL: boolean;
  slug?: string;
  sectionId?: string;
}

export const SectionSubsections: React.FC<SectionSubsectionsProps> = ({
  subsections,
  lang,
  isRTL,
  slug,
  sectionId,
}) => {
  const { t } = useTranslation(["pages"]);

  return (
    <div className="mt-6 space-y-6">
      {subsections.map((sub, i) => {
        const localizedTitle = slug && sectionId 
          ? t(`pages:${slug}.sections.${sectionId}.subsections.${i}.title`, { defaultValue: sub.title?.[lang] ?? "" })
          : (sub.title?.[lang] ?? "");
        
        const localizedParagraphs = slug && sectionId
          ? t(`pages:${slug}.sections.${sectionId}.subsections.${i}.paragraphs`, { returnObjects: true, defaultValue: sub.paragraphs })
          : sub.paragraphs;

        const localizedList = slug && sectionId
          ? t(`pages:${slug}.sections.${sectionId}.subsections.${i}.list`, { returnObjects: true, defaultValue: sub.list })
          : sub.list;

        return (
          <div key={i}>
            {localizedTitle && (
              <h3 className="text-lg font-bold text-starbucks-dark dark:text-white mb-3">
                {localizedTitle}
              </h3>
            )}
            {Array.isArray(localizedParagraphs) && localizedParagraphs.map((p, j) => (
              <p key={j} className={j > 0 ? "mt-2" : ""}>
                {typeof p === 'string' ? p : p[lang]}
              </p>
            ))}
            {Array.isArray(localizedList) && (
              <ul
                className={`mt-3 space-y-2 ${isRTL ? "pr-4" : "pl-4"} list-disc marker:text-starbucks-green`}
              >
                {localizedList.map((item, k) => (
                  <li key={k}>{typeof item === 'string' ? item : item[lang]}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};
