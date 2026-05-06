import React from "react";
import type { LocalizedText } from "@/types";

interface SectionListProps {
  list: (LocalizedText & { link?: string })[];
  lang: "ar" | "en";
  isRTL: boolean;
}

export const SectionList: React.FC<SectionListProps> = ({
  list,
  lang,
  isRTL,
}) => {
  return (
    <ul className={`space-y-3 ${isRTL ? "pr-6" : "pl-6"} mt-4`}>
      {list.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
          <span>
            {item[lang]}
            {item.link && (
              <a
                href={item.link}
                dir="ltr"
                className="inline-block text-starbucks-green hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.link}
              </a>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
};
