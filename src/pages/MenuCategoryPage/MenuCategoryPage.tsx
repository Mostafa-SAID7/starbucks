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
import { useMenuData, useMenuCategory } from "@/hooks/queries";

export const MenuCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  // Define translation keys for category
  const categoryKey = `pages:menu.categories.${category.id}`;
  const categoryTitle = t(`${categoryKey}.title`) || category.id;
  const categoryDesc = t(`${categoryKey}.description`);
  const categorySidebarTitle = t(`${categoryKey}.sidebarTitle`) || t("pages:menu.sidebar.title");

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir={isRTL ? "rtl" : "ltr"}>
      <SEO title={`${categoryTitle} - ${t("pages:menu.title")}`} />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Side 1: Sidebar */}
        <div className="w-full lg:w-[350px] flex-shrink-0">
          <div className="sticky top-28">
            <VerticalCard
              title={categorySidebarTitle}
              image={category.image || menuData.sidebar.image}
              actions={[
                {
                  id: "order",
                  label: t("pages:menu.sidebar.actions.order"),
                  href: t("pages:menu.order_url"),
                  variant: "primary"
                },
                {
                  id: "stores",
                  label: t("pages:menu.sidebar.actions.stores"),
                  href: `/${i18n.language}/locations`,
                  variant: "secondary"
                }
              ]}
            />
          </div>
        </div>

        {/* Side 2: Main Content Area */}
        <div className="flex-1 space-y-8">
          <div className="text-center md:text-start">
            <h1 className="mb-4 text-3xl font-bold text-foreground-light dark:text-foreground-dark">
              {categoryTitle}
            </h1>
            <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
              {categoryDesc}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.subcategories?.map((sub, index: number) => {
              const subTitle = t(`${categoryKey}.subcategories.${sub.id}.title`) || sub.id;
              
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-starbucks-dark">
                    <img
                      src={sub.image}
                      alt={subTitle}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col items-center p-6 text-center">
                    <h3 className="mb-4 text-lg font-bold text-starbucks-dark dark:text-white">
                      {subTitle}
                    </h3>
                    <Link
                      to={`/${i18n.language}${sub.href}`}
                      className="inline-block rounded-2xl bg-starbucks-green px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white"
                    >
                      {t("common:discover_more")}
                    </Link>
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
                  {t("pages:menu.sidebar.actions.stores")}
                </Link>
              </Button>
            </div>

            <div className="mt-8 text-start">
              <AllergyInfo
                title={t("pages:menu.allergyInfo.title")}
                description={t("pages:menu.allergyInfo.description")}
                link={menuData.allergyInfo.link}
                linkLabel={t("pages:menu.allergyInfo.linkLabel")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCategoryPage;
