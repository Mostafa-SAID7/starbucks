import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as data from "@/data";
import { motion } from "framer-motion";

interface MenuCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

interface AllergyInfo {
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

interface MenuData {
  title: string;
  description: string;
  categories: MenuCategory[];
  allergyInfo: AllergyInfo;
}

export const MenuPage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  // Access menu data safely
  const menuData = data.menu as Record<string, MenuData>;
  const pageData = menuData?.[lang];
  const isRTL = lang === "ar";

  // Safety check
  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading menu...</p>
      </div>
    );
  }

  const categories = Array.isArray(pageData.categories)
    ? pageData.categories
    : [];
  const allergyInfo = pageData.allergyInfo || ({} as AllergyInfo);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <section className="relative bg-starbucks-green py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              {String(pageData.title || "Menu")}
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed opacity-90 whitespace-pre-line">
              {String(pageData.description || "")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {categories.map((category: MenuCategory, index: number) => (
              <motion.div
                key={String(category.id || index)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Link
                  to={String(category.href || "#")}
                  className="group block overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                      src={String(category.image || "")}
                      alt={String(category.title || "")}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h2
                      className={`mb-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {String(category.title || "")}
                    </h2>
                    <p
                      className={`text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {String(category.description || "")}
                    </p>

                    {/* CTA Button */}
                    <div className="flex justify-start">
                      <span className="inline-flex items-center gap-2 text-starbucks-green font-bold text-lg group-hover:gap-4 transition-all">
                        {isRTL ? "استكشف الآن" : "Explore Now"}
                        <svg
                          className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                            isRTL ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Allergy Info Section */}
      {allergyInfo.title && (
        <section className="py-12 bg-gray-50 dark:bg-zinc-900/50">
          <div className="container mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {String(allergyInfo.title)}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {String(allergyInfo.description)}
              </p>
              {allergyInfo.link && (
                <a
                  href={String(allergyInfo.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-starbucks-green font-bold hover:text-starbucks-dark transition-colors"
                >
                  {String(allergyInfo.linkLabel)}
                  <svg
                    className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};
