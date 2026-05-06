import React from "react";
import type { LocalizedText } from "@/types";

interface Subsection {
  title?: LocalizedText;
  paragraphs?: LocalizedText[];
  list?: LocalizedText[];
}

interface SectionSubsectionsProps {
  subsections: Subsection[];
  lang: "ar" | "en";
  isRTL: boolean;
}

export const SectionSubsections: React.FC<SectionSubsectionsProps> = ({
  subsections,
  lang,
  isRTL,
}) => {
  return (
    <div className="mt-6 space-y-6">
      {subsections.map((sub, i) => (
        <div key={i}>
          {sub.title && (
            <h3 className="text-lg font-bold text-starbucks-dark dark:text-white mb-3">
              {sub.title[lang]}
            </h3>
          )}
          {sub.paragraphs?.map((p, j) => (
            <p key={j} className={j > 0 ? "mt-2" : ""}>
              {p[lang]}
            </p>
          ))}
          {sub.list && (
            <ul
              className={`mt-3 space-y-2 ${isRTL ? "pr-4" : "pl-4"} list-disc marker:text-starbucks-green`}
            >
              {sub.list.map((item, k) => (
                <li key={k}>{item[lang]}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
