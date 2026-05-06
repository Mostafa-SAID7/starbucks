import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as data from "@/data";
import { motion } from "framer-motion";
import { AllergyInfo, SEO } from "@/components";

interface MenuCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  sidebarTitle?: string;
}

interface AllergyInfoType {
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

interface SidebarAction {
  label: string;
  href: string;
  primary: boolean;
}

interface MenuData {
  title: string;
  description: string;
  categories: MenuCategory[];
  allergyInfo: AllergyInfoType;
  sidebar: {
    title: string;
    image: string;
    actions: SidebarAction[];
  };
}

export const MenuPage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
  const textAlignClass = isRTL ? "text-right" : "text-left";

  // Access menu data safely
  const menuData = data.menu as Record<string, MenuData>;
  const pageData = menuData?.[lang];

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
  const allergyInfo = pageData.allergyInfo || ({} as AllergyInfoType);
  const sidebar = pageData.sidebar;

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={pageData.title || "Menu"} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main 2-Side Layout */}
        <div className={`flex flex-col lg:flex-row gap-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}>
          
          {/* Side 1: Sticky Sidebar Image */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] group">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <img
                src={sidebar?.image || ""}
                alt={sidebar?.title || "Menu"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-8 drop-shadow-lg">
                  {sidebar?.title}
                </h1>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                  {sidebar?.actions?.map((action, index) => (
                    <Link
                      key={index}
                      to={action.href}
                      className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-all shadow-lg ${
                        action.primary
                          ? "bg-white text-gray-900 hover:bg-gray-100"
                          : "border-2 border-white/80 text-white hover:bg-white/10 backdrop-blur-sm"
                      }`}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-12 leading-relaxed whitespace-pre-line ${textAlignClass}`}
            >
              {pageData.description}
            </motion.p>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-16">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-zinc-800 group"
                >
                  <Link
                    to={category.href || "#"}
                    className="flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1 items-center text-center">
                      <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3">
                        {category.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">
                        {category.description}
                      </p>
                      <span className="inline-flex items-center justify-center px-6 py-2 border-2 border-starbucks-green text-starbucks-green font-bold rounded-full group-hover:bg-starbucks-green/5 transition-colors">
                        {category.sidebarTitle ||
                          (lang === "ar" ? "اكتشف" : "Explore")}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Allergy Info */}
            {allergyInfo.title && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-full mt-8"
              >
                <AllergyInfo
                  title={allergyInfo.title}
                  description={allergyInfo.description}
                  link={allergyInfo.link}
                  linkLabel={allergyInfo.linkLabel}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
