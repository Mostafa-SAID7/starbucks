import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as data from "@/data";
import { motion } from "framer-motion";
import { AllergyInfo } from "@/components";

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
    <div className="flex flex-col-reverse lg:flex-row min-h-screen bg-background-light dark:bg-background-dark">
      {/* Content Column */}
      <div className="w-full lg:w-2/3 p-8 md:p-12 lg:p-20 xl:p-24 flex flex-col justify-center">
        {/* Description Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-16 leading-relaxed max-w-4xl whitespace-pre-line"
        >
          {pageData.description}
        </motion.p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10 w-full max-w-6xl mb-16">
          {categories.map((category, index) => (
            <motion.div
              key={category.id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-zinc-800"
            >
              <Link
                to={category.href || "#"}
                className="group flex flex-col h-full"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
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
                  <span className="inline-flex items-center justify-center px-6 py-2 border-2 border-starbucks-green text-starbucks-green font-bold rounded-full hover:bg-starbucks-green/5 transition-colors">
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
            className="w-full max-w-6xl mt-8"
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

      {/* Sidebar Image Column */}
      <div className="w-full lg:w-1/3 relative min-h-[60vh] lg:min-h-screen">
        <div className="absolute inset-0">
          <img
            src={sidebar?.image || ""}
            alt={sidebar?.title || "Menu"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-10">
            {sidebar?.title}
          </h1>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            {sidebar?.actions?.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-all ${
                  action.primary
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "border-2 border-white/80 text-white hover:bg-white/10"
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
