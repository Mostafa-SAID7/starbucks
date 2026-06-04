import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Plus } from "lucide-react";
import { ANIMATION_CONFIG } from '@/lib/core/constants';
import type { FlatItem } from "./types";

interface MenuItemCardProps {
  item: FlatItem;
  isRTL: boolean;
  onClick: (item: FlatItem) => void;
  onAddToCart: (item: FlatItem) => void;
}

/**
 * Animated card for a single menu item.
 * Clicking the card opens the details modal;
 * the quick-add button adds directly to cart.
 */
export function MenuItemCard({
  item,
  isRTL,
  onClick,
  onAddToCart,
}: MenuItemCardProps) {
  const { t } = useTranslation(["common"]);
  const title = isRTL && item.nameAr ? item.nameAr : item.name;
  const desc =
    isRTL && item.descriptionAr ? item.descriptionAr : item.description;

  return (
    <motion.article
      data-testid="menu-item"
      layout
      {...ANIMATION_CONFIG.VARIANTS.SLIDE_UP}
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

        {/* Quick add on hover */}
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
