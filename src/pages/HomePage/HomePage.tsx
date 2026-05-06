import { useTranslation } from "react-i18next";
import { Banner, StatementSection, FeaturedCards, SEO } from "@/components";
import pages from "@/data/pages.json";
import hero from "@/data/hero.json";

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
        imageUrl="/home/banner/backgrouund.webp"
        secondaryImageUrl={lang === "ar" ? "/home/banner/woman-Photoroom.webp" : "/home/banner/woman-Photoroom-en.png"}
        imageAlt={heroData.imageAlt}
        isRTL={lang === "ar"}
      />

      {/* High-End Section Transition - Integrated Fading Dissolve */}
      <div className="relative z-20 -mt-16 h-32 pointer-events-none">
        {/* The Blur Layer: Fades in gradually using mask-image to avoid sharp lines */}
        <div 
          className="absolute inset-0 backdrop-blur-[10px]" 
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 40%, black)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40%, black)"
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
