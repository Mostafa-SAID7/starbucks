import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  SEO,
  AllergyInfo,
  MenuPromoVideo,
} from "@/components";
import { MenuSkeleton } from "@/components/skeletons";
import { NotFound } from "@/pages";
import { useMenuData, useMenuCategory } from "@/hooks/queries";

import { QueryErrorBoundary } from "@/components";

const MenuCategoryContent = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t, i18n } = useTranslation(["pages", "common"]);
  const isRTL = i18n.language === "ar";
  const textAlignClass = isRTL ? "text-right" : "text-left";

  const { data: menuData, isLoading: isMenuLoading } = useMenuData();
  const {
    data: category,
    isLoading: isCategoryLoading,
  } = useMenuCategory(categoryId || "");

  const isLoading = isMenuLoading || isCategoryLoading;

  if (isLoading) {
    return <MenuSkeleton />;
  }

  if (!category || !menuData) {
    return <NotFound />;
  }

  // Define translation keys for category
  const categoryKey = `pages:menu.categories.${category.id}`;
  const categoryTitle = t(`${categoryKey}.title`) || category.id;
  const categoryDesc = t(`${categoryKey}.description`);
  const categorySidebarTitle = t(`${categoryKey}.sidebarTitle`) || t("pages:menu.sidebar.title");

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={`${categoryTitle} - ${t("pages:menu.title")}`} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main 2-Side Layout */}
        <div className={cn("flex flex-col lg:flex-row gap-12", isRTL && "lg:flex-row-reverse")}>
          
          {/* Side 1: Sticky Sidebar Image - Matches MenuPage Design */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] group">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <img
                src={category.image || menuData.sidebar?.image || ""}
                alt={categorySidebarTitle}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-8 drop-shadow-lg leading-tight">
                  {categorySidebarTitle}
                </h1>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                  <Link
                    to={t("pages:menu.order_url")}
                    className="w-full py-3 px-6 rounded-full font-bold text-lg transition-all shadow-lg bg-white text-gray-900 hover:bg-gray-100"
                  >
                    {t("pages:menu.sidebar.actions.order")}
                  </Link>
                  <Link
                    to={`/${i18n.language}/locations`}
                    className="w-full py-3 px-6 rounded-full font-bold text-lg transition-all shadow-lg border-2 border-white/80 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    {t("pages:menu.sidebar.actions.stores")}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <div className={`mb-12 ${textAlignClass}`}>
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                {categoryTitle}
              </h1>
              <p className="text-lg md:text-xl font-bold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {categoryDesc}
              </p>
            </div>

            {/* Subcategories Grid - Matches MenuPage Grid Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-16">
              {category.subcategories?.map((sub, index: number) => {
                const subTitle = t(`${categoryKey}.subcategories.${sub.id}.title`) || sub.id;
                const subDesc = t(`${categoryKey}.subcategories.${sub.id}.description`, { defaultValue: "" });
                
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-zinc-800 group"
                  >
                    <Link
                      to={`/${i18n.language}${sub.href}`}
                      className="flex flex-col h-full"
                    >
                      <div className="relative h-48 overflow-hidden bg-starbucks-dark/5">
                        <img
                          src={sub.image}
                          alt={subTitle}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1 items-center text-center">
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3">
                          {subTitle}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">
                          {subDesc}
                        </p>
                        <span className="mt-auto inline-flex items-center justify-center px-6 py-2 border-2 border-starbucks-green text-starbucks-green font-bold rounded-full group-hover:bg-starbucks-green/5 transition-colors">
                          {t("common:discover_more")}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Promo Video */}
            <div className="mb-16">
              <MenuPromoVideo />
            </div>

            {/* Allergy Info */}
            {menuData.allergyInfo && (
              <AllergyInfo
                title={t("pages:menu.allergyInfo.title")}
                description={t("pages:menu.allergyInfo.description")}
                link={menuData.allergyInfo.link}
                linkLabel={t("pages:menu.allergyInfo.linkLabel")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MenuCategoryPage = () => {
  return (
    <QueryErrorBoundary>
      <MenuCategoryContent />
    </QueryErrorBoundary>
  );
};

export default MenuCategoryPage;

