import React from "react";
import type { LocalizedText } from "@/types";

interface SectionParagraphsProps {
  paragraphs: (LocalizedText | string)[];
  lang: "ar" | "en";
}

export const SectionParagraphs: React.FC<SectionParagraphsProps> = ({
  paragraphs,
  lang,
}) => {
  return (
    <div className="space-y-6">
      {paragraphs.map((p, idx) => (
        <p key={idx} className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          {typeof p === 'string' ? p : p[lang]}
        </p>
      ))}
    </div>
  );
};
