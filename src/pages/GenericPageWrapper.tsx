import React, { useEffect, useState } from "react";
import { GenericPage } from "./GenericPage";
import { StaticPageSkeleton } from "@/components/skeletons";
import { usePageData } from "@/hooks/queries";
import { useTranslation } from "react-i18next";
import type { GenericPageData, GenericPageWrapperProps } from "@/types";

/**
 * Wrapper component that fetches generic page data using TanStack Query
 * and passes it to the GenericPage component
 */
export const GenericPageWrapper: React.FC<GenericPageWrapperProps> = ({
  slug,
  seoTitle,
  showAccordion,
  accordionTitle,
  accordionSectionIndices,
  useAccordionLayout,
}) => {
  const { t, i18n } = useTranslation(["common"]);
  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false);

  // Lazy load page translations
  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      setIsTranslationLoaded(false);
      try {
        const lang = i18n.language === "ar" ? "ar" : "en";
        // Use a dynamic import to load the specific page translation
        const translations = await import(`../locales/${lang}/pages/${slug}.json`);
        
        if (isMounted) {
          // Add the translation bundle to i18next
          i18n.addResourceBundle(lang, "pages", { [slug]: translations.default }, true, true);
          setIsTranslationLoaded(true);
        }
      } catch (err) {
        console.error(`Failed to load translations for ${slug}:`, err);
        if (isMounted) setIsTranslationLoaded(true); // Continue anyway, defaultValue will be used
      }
    };

    loadTranslations();
    return () => { isMounted = false; };
  }, [slug, i18n, i18n.language]);

  // Fetch page data using TanStack Query
  const { data: pageData, isLoading, error, refetch } = usePageData(slug);

  // Loading state
  if (isLoading || !isTranslationLoaded) {
    return <StaticPageSkeleton />;
  }

  // Error state
  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("common:errors.loading_page")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("common:errors.loading_page_desc")}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-starbucks-green text-white font-bold rounded-full hover:bg-starbucks-green/90 transition-colors"
          >
            {t("common:retry")}
          </button>
        </div>
      </div>
    );
  }

  // Render GenericPage with fetched data
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

export default GenericPageWrapper;
