import React from "react";
import type { LocalizedText } from "@/types";

interface ContactInfo {
  email: string;
  phone: string;
  phoneTel: string;
  address?: LocalizedText;
}

interface SectionContactInfoProps {
  contactInfo: ContactInfo;
  contactNote?: LocalizedText;
  lang: "ar" | "en";
}

export const SectionContactInfo: React.FC<SectionContactInfoProps> = ({
  contactInfo,
  contactNote,
  lang,
}) => {
  return (
    <>
      {contactNote && (
        <div className="mt-8 p-6 bg-starbucks-green/5 border border-starbucks-green/20 rounded-2xl">
          <p className="font-bold text-starbucks-green">{contactNote[lang]}</p>
        </div>
      )}

      <div className="mt-8 space-y-4 p-8 bg-starbucks-dark text-white rounded-[2rem] shadow-xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              {lang === "ar" ? "البريد الإلكتروني" : "Email"}
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-xl font-bold hover:text-starbucks-green transition-colors"
            >
              {contactInfo.email}
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              {lang === "ar" ? "الهاتف" : "Phone"}
            </p>
            <a
              href={`tel:${contactInfo.phoneTel}`}
              className="text-xl font-bold hover:text-starbucks-green transition-colors"
            >
              {contactInfo.phone}
            </a>
          </div>
          {contactInfo.address && (
            <div className="space-y-2 md:col-span-2">
              <p className="text-gray-400 text-sm">
                {lang === "ar" ? "العنوان" : "Address"}
              </p>
              <p className="text-xl font-bold">{contactInfo.address[lang]}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
