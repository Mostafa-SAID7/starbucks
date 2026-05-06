import React from "react";
import type { LocalizedText } from "@/types";

interface Group {
  title: LocalizedText;
  paragraphs: LocalizedText[];
}

interface SectionGroupsProps {
  groups: Group[];
  lang: "ar" | "en";
}

export const SectionGroups: React.FC<SectionGroupsProps> = ({
  groups,
  lang,
}) => {
  return (
    <div className="mt-6 space-y-6">
      {groups.map((group, i) => (
        <div key={i}>
          <strong className="text-lg text-starbucks-dark dark:text-white font-bold border-b-2 border-starbucks-green inline-block pb-1 mb-2">
            {group.title[lang]}
          </strong>
          {group.paragraphs.map((p, j) => (
            <p key={j} className={j > 0 ? "mt-2" : ""}>
              {p[lang]}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};
