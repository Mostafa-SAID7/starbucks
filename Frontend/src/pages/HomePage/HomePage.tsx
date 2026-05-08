import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Banner, StatementSection, FeaturedCards, SEO, QueryErrorBoundary } from "@/components";
import { LoadingAnnouncement } from "@/components/accessibility";
import { HomeSkeleton } from "@/components/skeletons";
import { useHero } from "@/hooks/queries";

const HomePageContent: React.FC<{ heroData: any }> = ({ heroData }) => {
  const { t, i18n } = useTranslation(["common", "errors", "pages"]);
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const pageTitle = lang === "ar" ? "ستاربكس مصر" : "Starbucks Egypt";

  return (
    <div className="flex flex-col">
      <SEO title={pageTitle} />
      <Banner
        title={t("pages:home.hero.title")}
        description={t("pages:home.hero.description")}
        ctaText={t("pages:home.hero.ctaText")}
        ctaLink={heroData.ctaLink}
        imageUrl={heroData.imageUrl}
        secondaryImageUrl={heroData.secondaryImageUrls?.[lang]}
        imageAlt={t("pages:home.hero.imageAlt")}
        isRTL={lang === "ar"}
      />

      <div className="relative z-20 -mt-16 h-32 pointer-events-none">
        <div
          className="absolute inset-0 backdrop-blur-[10px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 40%, black)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 40%, black)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <StatementSection />
      <FeaturedCards />
    </div>
  );
};

export const HomePage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadTranslations = async () => {
      setIsTranslationLoaded(false);
      try {
        const translations = await import(`../../locales/${lang}/pages/home.json`);
        if (isMounted) {
          i18n.addResourceBundle(lang, "pages", { home: translations.default }, true, true);
          setIsTranslationLoaded(true);
        }
      } catch (err) {
        if (isMounted) setIsTranslationLoaded(true);
      }
    };
    loadTranslations();
    return () => { isMounted = false; };
  }, [lang, i18n]);

  const { data: heroData, isLoading } = useHero();

  if (isLoading || !isTranslationLoaded) {
    return (
      <>
        <LoadingAnnouncement isLoading={true} />
        <HomeSkeleton />
      </>
    );
  }

  return (
    <QueryErrorBoundary>
      {heroData && <HomePageContent heroData={heroData} />}
    </QueryErrorBoundary>
  );
};

export default HomePage;
