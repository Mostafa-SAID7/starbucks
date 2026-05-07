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

export const MenuItemPage = () => {
  const { categoryId, itemId: subcategoryId } = useParams<{
    categoryId: string;
    itemId: string;
  }>();
  const { i18n } = useTranslation();
  const currentLang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  // Fetch menu data for sidebar and allergy info
  const { data: menuData, isLoading: isMenuLoading } = useMenuData();

  // Fetch specific menu item data
  const {
    data: itemData,
    isLoading: isItemLoading,
    error,
    refetch,
  } = useMenuItem(categoryId || "", subcategoryId || "");

  // Combined loading state
  const isLoading = isMenuLoading || isItemLoading;

  // Loading state
  if (isLoading) {
    return <MenuSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === "ar"
              ? "حدث خطأ في تحميل العنصر"
              : "Error loading item"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {currentLang === "ar"
              ? "عذراً، حدث خطأ أثناء تحميل العنصر. يرجى المحاولة مرة أخرى."
              : "Sorry, there was an error loading the item. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-starbucks-green text-white font-bold rounded-full hover:bg-starbucks-green/90 transition-colors"
          >
            {currentLang === "ar" ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  // Item not found
  if (!itemData) {
    return <NotFound />;
  }

  const { category, subcategory } = itemData;
  const data = menuData?.[currentLang];

  // Safety check for data
  if (!data) {
    return <MenuSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SEO title={`${subcategory.title} - ${category.title} - ${data.title}`} />

      <div className="flex flex-col-reverse gap-8 md:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div className="text-center md:text-start">
            <h1 className="mb-4 text-3xl font-bold text-foreground-light dark:text-foreground-dark">
              {subcategory.title}
            </h1>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {subcategory.items?.map((item, index: number) => (
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
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex flex-col items-center p-6 text-center">
                  <h3 className="mb-2 text-lg font-bold text-starbucks-dark dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                  <Button
                    asChild
                    className="rounded-2xl bg-starbucks-green px-6 font-bold text-white shadow-sm hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white"
                  >
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {currentLang === "ar"
                        ? "اطلبه للتوصيل"
                        : "Order for delivery"}
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Video & Links */}
          <div className="mt-12 space-y-8 text-center">
            <MenuPromoVideo />

            <div>
              <Button
                asChild
                className="rounded-2xl bg-starbucks-green font-bold text-white shadow-sm hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white"
              >
                <Link to={`/${currentLang}/locations`}>
                  {currentLang === "ar"
                    ? "مواقع محلاتنا"
                    : "Our Store Locations"}
                </Link>
              </Button>
            </div>

            <div className="mt-8 text-start">
              <AllergyInfo
                title={data.allergyInfo.title}
                description={data.allergyInfo.description}
                link={data.allergyInfo.link}
                linkLabel={data.allergyInfo.linkLabel}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-[350px] flex-shrink-0">
          <div className="sticky top-28">
            <VerticalCard
              title={subcategory.title}
              image={subcategory.image || data.sidebar.image}
              actions={data.sidebar.actions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemPage;
