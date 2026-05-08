import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  SEO,
  AllergyInfo,
  MenuPromoVideo,
  VerticalCard,
  Button,
} from "@/components";
import { MenuSkeleton } from "@/components/skeletons";
import { NotFound } from "@/pages";
import { useMenuData, useMenuItem } from "@/hooks/queries";
import { MenuItem } from "@/types/menu";

export const MenuItemPage = () => {
  const { categoryId, itemId: subcategoryId } = useParams<{
    categoryId: string;
    itemId: string;
  }>();
  const { t, i18n } = useTranslation(["menu", "common"]);
  const isRTL = i18n.language === "ar";

  // Fetch menu structural data
  const { data: menuData, isLoading: isMenuLoading } = useMenuData();

  // Fetch specific menu item structural data
  const {
    data: itemData,
    isLoading: isItemLoading,
    error,
    refetch,
  } = useMenuItem(categoryId || "", subcategoryId || "");

  // Combined loading state
  const isLoading = isMenuLoading || isItemLoading;

  if (isLoading) {
    return <MenuSkeleton />;
  }

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

  if (!itemData || !menuData) {
    return <NotFound />;
  }

  const { category, subcategory } = itemData;
  const categoryKey = `categories.${category.id}`;
  const subcategoryKey = `${categoryKey}.subcategories.${subcategory.id}`;
  
  const categoryTitle = t(`${categoryKey}.title`) || category.id;
  const subcategoryTitle = t(`${subcategoryKey}.title`) || subcategory.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir={isRTL ? "rtl" : "ltr"}>
      <SEO title={`${subcategoryTitle} - ${categoryTitle} - ${t("title")}`} />

      <div className="flex flex-col-reverse gap-8 md:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div className="text-center md:text-start">
            <h1 className="mb-4 text-3xl font-bold text-foreground-light dark:text-foreground-dark">
              {subcategoryTitle}
            </h1>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {subcategory.items?.map((item: MenuItem, index: number) => {
              const itemKey = `${subcategoryKey}.items.${item.id}`;
              const itemTitle = t(`${itemKey}.title`) || item.id;
              const itemDesc = t(`${itemKey}.description`);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-starbucks-dark">
                    <img
                      src={item.image}
                      alt={itemTitle}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col items-center p-6 text-center">
                    <h3 className="mb-2 text-lg font-bold text-starbucks-dark dark:text-white">
                      {itemTitle}
                    </h3>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                      {itemDesc}
                    </p>
                    <Button
                      asChild
                      className="rounded-2xl bg-starbucks-green px-6 font-bold text-white shadow-sm hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white"
                    >
                      <a href={item.href} target="_blank" rel="noreferrer">
                        {t("common:order_delivery")}
                      </a>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Video & Links */}
          <div className="mt-12 space-y-8 text-center">
            <MenuPromoVideo />

            <div>
              <Button
                asChild
                className="rounded-2xl bg-starbucks-green font-bold text-white shadow-sm hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white"
              >
                <Link to={`/${i18n.language}/locations`}>
                  {t("sidebar.actions.stores")}
                </Link>
              </Button>
            </div>

            <div className="mt-8 text-start">
              <AllergyInfo
                title={t("allergyInfo.title")}
                description={t("allergyInfo.description")}
                link={menuData.allergyInfo.link}
                linkLabel={t("allergyInfo.linkLabel")}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-[350px] flex-shrink-0">
          <div className="sticky top-28">
            <VerticalCard
              title={subcategoryTitle}
              image={subcategory.image || menuData.sidebar.image}
              actions={[
                {
                  id: "order",
                  label: t("sidebar.actions.order"),
                  href: t("order_url"),
                  variant: "primary"
                },
                {
                  id: "stores",
                  label: t("sidebar.actions.stores"),
                  href: `/${i18n.language}/locations`,
                  variant: "secondary"
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemPage;
