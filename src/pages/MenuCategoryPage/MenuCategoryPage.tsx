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
  const { i18n } = useTranslation();
  const currentLang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  // Fetch menu data for sidebar and allergy info
  const { data: menuData, isLoading: isMenuLoading } = useMenuData();

  // Fetch specific category data
  const {
    data: category,
    isLoading: isCategoryLoading,
    error,
    refetch,
  } = useMenuCategory(categoryId || "");

  // Combined loading state
  const isLoading = isMenuLoading || isCategoryLoading;

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
              ? "حدث خطأ في تحميل الفئة"
              : "Error loading category"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {currentLang === "ar"
              ? "عذراً، حدث خطأ أثناء تحميل الفئة. يرجى المحاولة مرة أخرى."
              : "Sorry, there was an error loading the category. Please try again."}
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

  // Category not found
  if (!category) {
    return <NotFound />;
  }

  const data = menuData?.[currentLang];

  // Safety check for data
  if (!data) {
    return <MenuSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SEO title={`${category.title} - ${data.title}`} />

      <div className="flex flex-col-reverse gap-8 md:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div className="text-center md:text-start">
            <h1 className="mb-4 text-3xl font-bold text-foreground-light dark:text-foreground-dark">
              {category.title}
            </h1>
            <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.subcategories?.map((sub, index: number) => (
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
                    alt={sub.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex flex-col items-center p-6 text-center">
                  <h3 className="mb-4 text-lg font-bold text-starbucks-dark dark:text-white">
                    {sub.title}
                  </h3>
                  <Link
                    to={sub.href}
                    className="inline-block rounded-2xl bg-starbucks-green px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white"
                  >
                    {currentLang === "ar" ? "اكتشف المزيد" : "Discover More"}
                  </Link>
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
              title={category.sidebarTitle || data.sidebar.title}
              image={category.image || data.sidebar.image}
              actions={data.sidebar.actions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCategoryPage;
