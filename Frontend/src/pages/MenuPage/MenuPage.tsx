import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/ui";
import { AllergyInfo, SEO, QueryErrorBoundary, SidebarTemplate } from "@/components";
import { MenuSkeleton } from "@/components/skeletons";
import { useLanguage } from "@/hooks";
import { useMenuData } from "@/hooks/queries";
import { queryKeys } from "@/lib/api/queryKeys";
import { menuFetchers } from "@/lib/api";
import { getTextAlignClass } from "@/lib/ui";
import type { MenuCategory, MenuData, SidebarAction } from "@/types";

const MenuPageContent: React.FC<{ menuData: MenuData }> = ({ menuData }) => {
  const { lang, isRTL } = useLanguage();
  const { t } = useTranslation(["pages", "common"]);
  const textAlignClass = getTextAlignClass(isRTL);
  const queryClient = useQueryClient();

  const prefetchCategory = (categoryId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.menu.byCategory(categoryId),
      queryFn: () => menuFetchers.fetchMenuCategory(categoryId),
      staleTime: 60 * 60 * 1000,
    });
  };

  const categories = menuData.categories || [];
  const allergyInfo = menuData.allergyInfo;
  const sidebar = menuData.sidebar;

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={t("pages:menu.title") || "Menu"} />

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <SidebarTemplate
          image={sidebar?.image || ""}
          title={t("pages:menu.sidebar.title") || "Menu"}
          overlay={
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {sidebar?.actions?.map((action: SidebarAction, index: number) => {
                const isOrder = action.href === "order";
                const href = isOrder ? t("pages:menu.order_url") : action.href;
                const label = isOrder
                  ? t("pages:menu.sidebar.actions.order")
                  : t("pages:menu.sidebar.actions.stores");

                return (
                  <Link
                    key={index}
                    to={href}
                    className={cn(
                      "w-full py-4 px-6 rounded-full font-black text-lg transition-all shadow-xl backdrop-blur-md",
                      action.primary
                        ? "bg-white text-gray-900 hover:bg-gray-100 scale-105 hover:scale-110"
                        : "border-2 border-white/80 text-white hover:bg-white/10"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          }
        >
          {/* Side 2: Content Column */}
          <div className={`mb-12 ${textAlignClass}`}>
            <h1 className="text-4xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              {t("pages:menu.title") || "Menu"}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg md:text-2xl font-bold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line max-w-3xl"
            >
              {t("pages:menu.description")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mb-16">
            {categories.map((category: MenuCategory, index: number) => (
              <motion.div
                key={category.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 dark:border-zinc-800 group"
                onMouseEnter={() => {
                  if (category.id) prefetchCategory(category.id);
                }}
              >
                <Link
                  to={`/${lang}${category.href}`}
                  className="flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={category.image}
                      alt={t(`menu:categories.${category.id}.title`)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-8 flex flex-col flex-1 items-center text-center">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                      {t(`pages:menu.categories.${category.id}.title`)}
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-400 mb-8 flex-1 leading-relaxed">
                      {t(`pages:menu.categories.${category.id}.description`)}
                    </p>
                    <span className="inline-flex items-center justify-center px-8 py-3 border-2 border-starbucks-green text-starbucks-green font-black rounded-full group-hover:bg-starbucks-green group-hover:text-white transition-all transform group-hover:scale-105">
                      {t(`pages:menu.categories.${category.id}.sidebarTitle`) ||
                        t("common:explore")}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {allergyInfo && (
            <div className="mt-12">
              <AllergyInfo
                title={t("pages:menu.allergyInfo.title")}
                description={t("pages:menu.allergyInfo.description")}
                link={allergyInfo.link}
                linkLabel={t("pages:menu.allergyInfo.linkLabel")}
              />
            </div>
          )}
        </SidebarTemplate>
      </div>
    </div>
  );
};

export const MenuPage = () => {
  const { data: menuData, isLoading } = useMenuData();

  if (isLoading) {
    return <MenuSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      {menuData && <MenuPageContent menuData={menuData} />}
    </QueryErrorBoundary>
  );
};

export default MenuPage;


