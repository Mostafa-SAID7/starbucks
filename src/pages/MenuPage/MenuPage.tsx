import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { AllergyInfo, SEO } from "@/components";
import { MenuSkeleton } from "@/components/skeletons";
import { useMenuData } from "@/hooks/queries";
import { queryKeys } from "@/lib/queryKeys";
import { menuFetchers } from "@/lib/fetchers";
import type { MenuCategory, SidebarAction } from "@/types";

export const MenuPage = () => {
  const { t, i18n } = useTranslation(["pages", "common"]);
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
  const textAlignClass = isRTL ? "text-right" : "text-left";
  const queryClient = useQueryClient();
  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false);

  // Lazy load menu translations
  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      setIsTranslationLoaded(false);
      try {
        const translations = await import(`../../locales/${lang}/pages/menu.json`);
        if (isMounted) {
          i18n.addResourceBundle(lang, "pages", { menu: translations.default }, true, true);
          setIsTranslationLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load menu translations:", err);
        if (isMounted) setIsTranslationLoaded(true);
      }
    };

    loadTranslations();
    return () => { isMounted = false; };
  }, [lang, i18n]);

  // Fetch structural menu data
  const { data: menuData, isLoading, error, refetch } = useMenuData();

  // Prefetch function for menu categories
  const prefetchCategory = (categoryId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.menu.byCategory(categoryId),
      queryFn: () => menuFetchers.fetchMenuCategory(categoryId),
      staleTime: 60 * 60 * 1000, // 1 hour
    });
  };

  // Loading state
  if (isLoading || !isTranslationLoaded) {
    return <MenuSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("common:errors.loading_menu")}
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

  // Safety check
  if (!menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">{t("common:loading")}</p>
      </div>
    );
  }

  const categories = menuData.categories || [];
  const allergyInfo = menuData.allergyInfo;
  const sidebar = menuData.sidebar;

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={t("pages:menu.title") || "Menu"} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main 2-Side Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Side 1: Sticky Sidebar Image */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] group">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <img
                src={sidebar?.image || ""}
                alt={t("pages:menu.sidebar.title") || "Menu"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-8 drop-shadow-lg">
                  {t("pages:menu.sidebar.title")}
                </h1>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                  {sidebar?.actions?.map(
                    (action: SidebarAction, index: number) => {
                      const isOrder = action.href === "order";
                      const href = isOrder ? t("pages:menu.order_url") : action.href;
                      const label = isOrder
                        ? t("pages:menu.sidebar.actions.order")
                        : t("pages:menu.sidebar.actions.stores");

                      return (
                        <Link
                          key={index}
                          to={href}
                          className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-all shadow-lg ${
                            action.primary
                              ? "bg-white text-gray-900 hover:bg-gray-100"
                              : "border-2 border-white/80 text-white hover:bg-white/10 backdrop-blur-sm"
                          }`}
                        >
                          {label}
                        </Link>
                      );
                    },
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <div className={`mb-12 ${textAlignClass}`}>
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                {t("pages:menu.title") || "Menu"}
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg md:text-xl font-bold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line"
              >
                {t("pages:menu.description")}
              </motion.p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-16">
              {categories.map((category: MenuCategory, index: number) => (
                <motion.div
                  key={category.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-zinc-800 group"
                  onMouseEnter={() => {
                    // Prefetch category data on hover for instant navigation
                    if (category.id) {
                      prefetchCategory(category.id);
                    }
                  }}
                >
                  <Link
                    to={`/${lang}${category.href}`}
                    className="flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={t(`menu:categories.${category.id}.title`)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1 items-center text-center">
                      <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3">
                        {t(`pages:menu.categories.${category.id}.title`)}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">
                        {t(`pages:menu.categories.${category.id}.description`)}
                      </p>
                      <span className="inline-flex items-center justify-center px-6 py-2 border-2 border-starbucks-green text-starbucks-green font-bold rounded-full group-hover:bg-starbucks-green/5 transition-colors">
                        {t(`pages:menu.categories.${category.id}.sidebarTitle`) ||
                          t("common:explore")}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Allergy Info */}
            {allergyInfo && (
              <AllergyInfo
                title={t("pages:menu.allergyInfo.title")}
                description={t("pages:menu.allergyInfo.description")}
                link={allergyInfo.link}
                linkLabel={t("pages:menu.allergyInfo.linkLabel")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
