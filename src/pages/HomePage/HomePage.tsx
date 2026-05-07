import { useTranslation } from "react-i18next";
import { Banner, StatementSection, FeaturedCards, SEO } from "@/components";
import { HomeSkeleton } from "@/components/skeletons";
import { useHero } from "@/hooks/queries";

import { HeroBannerData as HeroData } from "@/types/components";

export const HomePage = () => {
  const { t, i18n } = useTranslation(["common", "errors"]);
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  // Fetch hero data using TanStack Query
  const { data: heroData, isLoading, error, refetch } = useHero();

  // Loading state
  if (isLoading) {
    return <HomeSkeleton />;
  }

  // Error state
  if (error || !heroData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("error_loading_page", { ns: "common" })}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("error_loading_page_desc", { ns: "common" })}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-starbucks-green text-white font-bold rounded-full hover:bg-starbucks-green/90 transition-colors"
          >
            {t("retry", { ns: "common" })}
          </button>
        </div>
      </div>
    );
  }

  // Get hero data for the current language
  const currentHeroData = heroData[lang] as HeroData;

  // Page title
  const pageTitle = lang === "ar" ? "ستاربكس مصر" : "Starbucks Egypt";

  return (
    <div className="flex flex-col">
      <SEO title={pageTitle} />
      <Banner
        title={currentHeroData.title}
        description={currentHeroData.description}
        ctaText={currentHeroData.ctaText}
        ctaLink={currentHeroData.ctaLink}
        imageUrl="/home/banner/backgrouund.webp"
        secondaryImageUrl={
          lang === "ar"
            ? "/home/banner/woman-Photoroom.webp"
            : "/home/banner/woman-Photoroom-en.png"
        }
        imageAlt={currentHeroData.imageAlt}
        isRTL={lang === "ar"}
      />

      {/* High-End Section Transition - Integrated Fading Dissolve */}
      <div className="relative z-20 -mt-16 h-32 pointer-events-none">
        {/* The Blur Layer: Fades in gradually using mask-image to avoid sharp lines */}
        <div
          className="absolute inset-0 backdrop-blur-[10px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 40%, black)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 40%, black)",
          }}
        />

        {/* The Color Bridge: Multi-stop gradient for a seamless color transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <StatementSection />
      <FeaturedCards />
    </div>
  );
};

export default HomePage;
