import React from "react";
import type { GenericDefinition } from "@/types";

interface SectionDefinitionsProps {
  definitions: GenericDefinition[];
  lang: "ar" | "en";
}

export const SectionDefinitions: React.FC<SectionDefinitionsProps> = ({
  definitions,
  lang,
}) => {
  return (
    <div className="mt-4 space-y-4">
      {definitions.map((def, i) => (
        <div key={i} className="space-y-1">
          <strong className="block text-xl font-black text-starbucks-dark dark:text-white uppercase tracking-wide">
            {def.term[lang]}
          </strong>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            {def.definition[lang]}
          </p>
        </div>
      ))}
    </div>
  );
};
