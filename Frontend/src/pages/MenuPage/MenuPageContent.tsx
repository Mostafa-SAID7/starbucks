import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { SEO, SidebarTemplate } from "@/components";
import { useLanguage } from "@/hooks";
import { useCartStore } from "@/stores/cartStore";
import type { MenuCategory } from "@/types";

import { flattenItems } from "./helpers";
import { MenuControls, CATEGORY_ALL } from "./MenuControls";
import { MenuGrid } from "./MenuGrid";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { Toast } from "./Toast";
import type { FlatItem } from "./types";

interface MenuPageContentProps {
  categories: MenuCategory[];
}

/**
 * Main content area for the Menu page.
 * Manages search, category filter, cart actions, modal, and toast state.
 */
export function MenuPageContent({ categories }: MenuPageContentProps) {
  const { isRTL } = useLanguage();
  const { t } = useTranslation(["pages", "common"]);

  /* ── Derived data ──────────────────────────────────────────────── */
  const allItems = useMemo(() => flattenItems(categories), [categories]);

  const categoryTabs = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.categoryId))),
    [allItems]
  );

  /* ── State ─────────────────────────────────────────────────────── */
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);
  const [selectedItem, setSelectedItem] = useState<FlatItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* ── Filtered items ────────────────────────────────────────────── */
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

  /* ── Cart ──────────────────────────────────────────────────────── */
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback(
    (item: FlatItem) => {
      const name = isRTL && item.nameAr ? item.nameAr : item.name;
      addItem({ id: item.id, name, price: item.price, image: item.image });
      setToast(`${isRTL ? "تمت الإضافة:" : "Added to cart:"} ${name}`);
      setTimeout(() => setToast(null), 3000);
    },
    [isRTL, addItem]
  );

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
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
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {t("pages:menu.title") || "Menu"}
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("pages:menu.description")?.split("\n")[0]}
              </p>
            </div>

            {/* Search + Category tabs */}
            <MenuControls
              isRTL={isRTL}
              search={search}
              onSearchChange={setSearch}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryTabs={categoryTabs}
            />

            {/* Items grid */}
            <MenuGrid
              items={filteredItems}
              isRTL={isRTL}
              onItemClick={setSelectedItem}
              onAddToCart={handleAddToCart}
            />
          </div>
        </SidebarTemplate>
      </div>

      {/* Item details modal */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          isRTL={isRTL}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
