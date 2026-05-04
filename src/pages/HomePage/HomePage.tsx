import { useTranslation } from "react-i18next";
import { Banner, StatementSection, FeaturedCards, SEO } from "@/components";
import { pages, hero } from "@/data";

interface LocalizedContent {
  title: string;
}

export const HomePage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  // Safe access to home page data from pages.json
  const homeData = (
    pages as Record<string, Record<"ar" | "en", LocalizedContent>>
  )["home"];
  const pageData = homeData?.[lang] || {
    title: lang === "ar" ? "ستاربكس مصر" : "Starbucks Egypt",
  };

  // Get hero data for the current language
  const heroData = (
    hero as Record<
      "ar" | "en",
      {
        title: string;
        description: string;
        ctaText: string;
        ctaLink: string;
        imageUrl: string;
        imageAlt: string;
      }
    >
  )[lang];

  return (
    <div className="flex flex-col">
      <SEO title={pageData.title} />
      <Banner
        title={heroData.title}
        description={heroData.description}
        ctaText={heroData.ctaText}
        ctaLink={heroData.ctaLink}
        imageUrl="/Hero-Banner.webp"
        imageAlt={heroData.imageAlt}
      />
      <StatementSection />
      <FeaturedCards />
    </div>
  );
};

export default HomePage;
