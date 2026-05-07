import React from "react";
import type { GenericDefinition } from "@/types/generic-page";

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
        <div key={i}>
          <strong className="block text-starbucks-dark dark:text-white font-bold">
            {def.term[lang]}
          </strong>
          <p>{def.definition[lang]}</p>
        </div>
      ))}
    </div>
  );
};
