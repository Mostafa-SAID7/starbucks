import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { MenuItemCard } from "./MenuItemCard";
import type { FlatItem } from "./types";

interface MenuGridProps {
  items: FlatItem[];
  isRTL: boolean;
  onItemClick: (item: FlatItem) => void;
  onAddToCart: (item: FlatItem) => void;
}

/**
 * Animated responsive grid of menu item cards.
 * Shows an empty state when no items match the current filters.
 */
export function MenuGrid({
  items,
  isRTL,
  onItemClick,
  onAddToCart,
}: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <p className="text-lg font-semibold">
          {isRTL ? "لا توجد نتائج" : "No items found"}
        </p>
      </div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            isRTL={isRTL}
            onClick={onItemClick}
            onAddToCart={onAddToCart}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
