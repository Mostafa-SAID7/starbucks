import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingCart, Star, Plus } from "lucide-react";
import { cn } from "@/lib/ui";
import { SEO, SidebarTemplate } from "@/components";
import { MenuSkeleton } from "@/components/skeletons";
import { useLanguage } from "@/hooks";
import { useMenuData } from "@/hooks/queries";
import { useCartStore } from "@/stores/cartStore";
import type { MenuCategory } from "@/types";

/* ── flat item shape ─────────────────────────────────────────────── */
interface FlatItem {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  image: string;
  href: string;
  category: string;
  categoryId: string;
  isNew?: boolean;
}

/* ── helpers ─────────────────────────────────────────────────────── */
function flattenItems(categories: MenuCategory[]): FlatItem[] {
  const result: FlatItem[] = [];
  for (const cat of categories) {
    for (const sub of cat.subcategories ?? []) {
      for (const item of sub.items ?? []) {
        const raw = item as unknown as Record<string, unknown>;
        result.push({
          id: String(item.id),
          name: (raw.name as string) || item.id,
          nameAr: raw.nameAr as string | undefined,
          description: (raw.description as string) || "",
          descriptionAr: raw.descriptionAr as string | undefined,
          price: (raw.price as number) || 0,
          image: item.image,
          href: String(raw.href ?? item.href ?? ""),
          category: (raw.category as string) || cat.id,
          categoryId: cat.id,
          isNew: item.isNew,
        });
      }
    }
  }
  return result;
}

/* ── Toast ───────────────────────────────────────────────────────── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl bg-starbucks-green text-white shadow-2xl font-bold text-base"
    >
      <ShoppingCart className="w-5 h-5 shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close" className="ml-2 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ── Item Details Modal ──────────────────────────────────────────── */
function ItemDetailsModal({
  item,
  isRTL,
  lang,
  onClose,
  onAddToCart,
}: {
  item: FlatItem;
  isRTL: boolean;
  lang: string;
  onClose: () => void;
  onAddToCart: (item: FlatItem) => void;
}) {
  const { t } = useTranslation(["common"]);
  const title = isRTL && item.nameAr ? item.nameAr : item.name;
  const desc = isRTL && item.descriptionAr ? item.descriptionAr : item.description;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          data-testid="item-details"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? "rtl" : "ltr"}
          className="relative z-10 bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl w-full max-w-md"
        >
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={item.image}
              alt={title}
              className="w-full h-full object-cover"
            />
            {item.isNew && (
              <span className="absolute top-4 start-4 bg-starbucks-green text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                New
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 end-4 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all"
            >
              <X className="w-4 h-4 text-gray-800" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {title}
              </h2>
              <span className="text-xl font-black text-starbucks-green whitespace-nowrap">
                {item.price} EGP
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm">
              {desc}
            </p>
            <button
              onClick={() => {
                onAddToCart(item);
                onClose();
              }}
              className="w-full py-4 bg-starbucks-green hover:bg-starbucks-green/90 text-white font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {t("common:add_to_cart") || "Add to Cart"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ── Menu Item Card ──────────────────────────────────────────────── */
function MenuItemCard({
  item,
  isRTL,
  onClick,
  onAddToCart,
}: {
  item: FlatItem;
  isRTL: boolean;
  onClick: (item: FlatItem) => void;
  onAddToCart: (item: FlatItem) => void;
}) {
  const { t } = useTranslation(["common"]);
  const title = isRTL && item.nameAr ? item.nameAr : item.name;
  const desc = isRTL && item.descriptionAr ? item.descriptionAr : item.description;

  return (
    <motion.article
      data-testid="menu-item"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-zinc-800 transition-all cursor-pointer"
      onClick={() => onClick(item)}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(item)}
      role="button"
      aria-label={title}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.isNew && (
          <span className="absolute top-3 start-3 bg-starbucks-green text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
        {/* Quick add button on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          aria-label={`Add ${title} to cart`}
          className="absolute end-3 bottom-3 opacity-0 group-hover:opacity-100 bg-starbucks-green text-white rounded-full p-2 shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-black text-gray-900 dark:text-white text-sm leading-tight line-clamp-1">
            {title}
          </h3>
          <span className="text-starbucks-green font-black text-sm whitespace-nowrap">
            {item.price} EGP
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
          {desc}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          className="w-full py-2.5 text-xs font-black bg-starbucks-green/10 hover:bg-starbucks-green text-starbucks-green hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {t("common:add_to_cart") || "Add to Cart"}
        </button>
      </div>
    </motion.article>
  );
}

/* ── Main MenuPage ───────────────────────────────────────────────── */
const CATEGORY_ALL = "all";

function MenuPageContent({ categories }: { categories: MenuCategory[] }) {
  const { isRTL, lang } = useLanguage();
  const { t } = useTranslation(["pages", "common"]);

  const allItems = useMemo(() => flattenItems(categories), [categories]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);
  const [selectedItem, setSelectedItem] = useState<FlatItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* Category tabs */
  const categoryTabs = useMemo(() => {
    const ids = Array.from(new Set(allItems.map((i) => i.categoryId)));
    return ids;
  }, [allItems]);

  /* Filtered items */
  const filteredItems = useMemo(() => {
    let items = allItems;
    if (activeCategory !== CATEGORY_ALL) {
      items = items.filter((i) => i.categoryId === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.nameAr && i.nameAr.includes(q)) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allItems, activeCategory, search]);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback((item: FlatItem) => {
    const name = isRTL && item.nameAr ? item.nameAr : item.name;
    addItem({
      id: item.id,
      name: name,
      price: item.price,
      image: item.image,
    });
    setToast(`${isRTL ? "تمت الإضافة:" : "Added to cart:"} ${name}`);
    setTimeout(() => setToast(null), 3000);
  }, [isRTL, addItem]);

  const getCategoryLabel = (catId: string) => {
    if (catId === "drinks") return isRTL ? "المشروبات" : "Drinks";
    if (catId === "food") return isRTL ? "المأكولات" : "Food";
    return catId;
  };

  return (
    <div
      className="bg-white dark:bg-zinc-950 min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={t("pages:menu.title") || "Menu"} />

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <SidebarTemplate
          image="/menu/Menu.webp"
          title={t("pages:menu.title") || "Menu"}
          overlay={
            <div className="text-center px-4 max-w-xs mx-auto">
              <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
                {t("pages:menu.description")?.split("\n")[0]}
              </p>
            </div>
          }
        >
          {/* Main Content Side */}
          <div className="flex flex-col gap-6">
            {/* Header / Intro */}
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {t("pages:menu.title") || "Menu"}
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("pages:menu.description")?.split("\n")[0]}
              </p>
            </div>

            {/* Controls: Search and Category Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/80">
              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isRTL ? "ابحث في القائمة..." : "Search the menu..."}
                  className="w-full ps-9 pe-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-starbucks-green/40 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category tabs */}
              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
                <button
                  onClick={() => setActiveCategory(CATEGORY_ALL)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                    activeCategory === CATEGORY_ALL
                      ? "bg-starbucks-green text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  )}
                >
                  {isRTL ? "الكل" : "All"}
                </button>
                {categoryTabs.map((catId) => (
                  <button
                    key={catId}
                    data-testid="category-item"
                    onClick={() => setActiveCategory(catId)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all capitalize",
                      activeCategory === catId
                        ? "bg-starbucks-green text-white"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                    )}
                  >
                    {getCategoryLabel(catId)}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="w-full">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-semibold">
                    {isRTL ? "لا توجد نتائج" : "No items found"}
                  </p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        isRTL={isRTL}
                        onClick={setSelectedItem}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </SidebarTemplate>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          isRTL={isRTL}
          lang={lang}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Page Shell ─────────────────────────────────────────────────── */
export const MenuPage = () => {
  const { data: menuData, isLoading } = useMenuData();

  if (isLoading) {
    return <MenuSkeleton />;
  }

  if (!menuData?.categories?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>No menu data available.</p>
      </div>
    );
  }

  return <MenuPageContent categories={menuData.categories} />;
};

export default MenuPage;
