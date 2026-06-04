import { motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

/**
 * Animated toast notification shown after adding an item to cart.
 */
export function Toast({ message, onClose }: ToastProps) {
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
      <button
        onClick={onClose}
        aria-label="Close"
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
