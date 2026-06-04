import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, ShoppingCart } from "lucide-react";
import type { FlatItem } from "./types";

interface ItemDetailsModalProps {
  item: FlatItem;
  isRTL: boolean;
  onClose: () => void;
  onAddToCart: (item: FlatItem) => void;
}

/**
 * Full-screen modal showing item image, description, price
 * and an "Add to Cart" button.
 */
export function ItemDetailsModal({
  item,
  isRTL,
  onClose,
  onAddToCart,
}: ItemDetailsModalProps) {
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

        {/* Modal panel */}
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
