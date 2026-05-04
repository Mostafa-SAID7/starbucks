import React from "react";
import type { LocalizedText } from "@/types";

interface TypeItem {
  id: string;
  label: LocalizedText;
  text: LocalizedText;
}

interface SectionTypesProps {
  types: TypeItem[];
  lang: "ar" | "en";
}

export const SectionTypes: React.FC<SectionTypesProps> = ({ types, lang }) => {
  return (
    <div className="grid gap-4 mt-8">
      {types.map((type) => (
        <div
          key={type.id}
          className="p-6 bg-[#f7f7f7] dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-900"
        >
          <p className="font-bold text-starbucks-dark dark:text-white mb-2">
            {type.label[lang]}
          </p>
          <p>{type.text[lang]}</p>
        </div>
      ))}
    </div>
  );
};
