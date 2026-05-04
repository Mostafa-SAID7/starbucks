import { useTranslation } from "react-i18next";
import { Banner, StatementSection, FeaturedCards, SEO } from "@/components";
import { pages, hero } from "@/data";
import { motion } from "framer-motion";

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
        isRTL={lang === "ar"}
      />

      {/* Elegant Blur Transition - Best Quality */}
      <div className="relative -mt-16 h-32 overflow-hidden">
        {/* Main blur layer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 dark:via-zinc-950/40 to-white dark:to-zinc-950 backdrop-blur-lg"
        />

        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/3 to-transparent"></div>

        {/* Edge softening */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-white/20 dark:to-zinc-950/20"></div>
      </div>

      <StatementSection />
      <FeaturedCards />
    </div>
  );
};

export default HomePage;
