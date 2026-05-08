import React, { useEffect, useState } from "react";
import { GenericPage } from "./GenericPage";
import { StaticPageSkeleton } from "@/components/skeletons";
import { usePageData } from "@/hooks/queries";
import { useTranslation } from "react-i18next";
import type { GenericPageData, GenericPageWrapperProps } from "@/types";
import { QueryErrorBoundary } from "@/components";

const GenericPageContent: React.FC<GenericPageWrapperProps> = ({
  slug,
  seoTitle,
  showAccordion,
  accordionTitle,
  accordionSectionIndices,
  useAccordionLayout,
}) => {
  const { data: pageData, isLoading } = usePageData(slug);

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  return (
    <GenericPage
      slug={slug}
      data={pageData as GenericPageData}
      seoTitle={seoTitle}
      showAccordion={showAccordion}
      accordionTitle={accordionTitle}
      accordionSectionIndices={accordionSectionIndices}
      useAccordionLayout={useAccordionLayout}
    />
  );
};

export const GenericPageWrapper: React.FC<GenericPageWrapperProps> = (props) => {
  const { i18n } = useTranslation();
  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false);

  // Lazy load page translations
  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      setIsTranslationLoaded(false);
      try {
        const lang = i18n.language === "ar" ? "ar" : "en";
        const translations = await import(`../locales/${lang}/pages/${props.slug}.json`);
        
        if (isMounted) {
          i18n.addResourceBundle(lang, "pages", { [props.slug]: translations.default }, true, true);
          setIsTranslationLoaded(true);
        }
      } catch (err) {
        console.error(`Failed to load translations for ${props.slug}:`, err);
        if (isMounted) setIsTranslationLoaded(true);
      }
    };

    loadTranslations();
    return () => { isMounted = false; };
  }, [props.slug, i18n, i18n.language]);

  if (!isTranslationLoaded) {
    return <StaticPageSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      <GenericPageContent {...props} />
    </QueryErrorBoundary>
  );
};

export default GenericPageWrapper;
