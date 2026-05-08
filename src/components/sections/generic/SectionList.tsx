import React from "react";
import type { LocalizedText } from "@/types";

interface SectionListProps {
  list: ((LocalizedText & { link?: string }) | string)[];
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
      {list.map((item, idx) => {
        const isString = typeof item === "string";
        const text = isString ? item : item[lang];
        const link = isString ? undefined : item.link;

        return (
          <li key={idx} className="flex items-start gap-4">
            <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-starbucks-green" />
            <span className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {text}
              {link && (
                <a
                  href={link}
                  dir="ltr"
                  className="inline-block text-starbucks-green hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </a>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
