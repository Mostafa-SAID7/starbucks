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
    <div className="space-y-4">
      {paragraphs.map((p, idx) => (
        <p key={idx}>{typeof p === 'string' ? p : p[lang]}</p>
      ))}
    </div>
  );
};
