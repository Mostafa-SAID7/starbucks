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
import menuData from "@/data/menu.json";
import { NotFound } from "@/pages";
import type { MenuData } from "@/types";

export const MenuItemPage = () => {
  const { categoryId, itemId: subcategoryId } = useParams<{
    categoryId: string;
    itemId: string;
  }>();
  const { i18n } = useTranslation();
  const currentLang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const data = (menuData as unknown as Record<string, MenuData>)[currentLang];

  const category = data.categories.find((c) => c.id === categoryId);
  const subcategory = category?.subcategories?.find(
    (s) => s.id === subcategoryId,
  );

  if (!category || !subcategory) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SEO title={`${subcategory.title} - ${category.title} - ${data.title}`} />

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar (Appears on the right in RTL) */}
        <div className="w-full md:w-80 lg:w-[350px] flex-shrink-0">
          <div className="sticky top-28">
            <VerticalCard
              title={subcategory.title}
              image={subcategory.image || data.sidebar.image}
              actions={data.sidebar.actions}
            />
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default MenuItemPage;
