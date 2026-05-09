import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { GenericPageData, LocalizedText } from "@/types";

interface DeliveryAccordionProps {
  accordion: GenericPageData["accordion"];
  isOpen: (id: string) => boolean;
  onToggle: (id: string) => void;
  isRTL: boolean;
  t: (obj: LocalizedText | string | null | undefined) => string;
  textAlignClass: string;
}

/**
 * Delivery Page Accordion Component
 * Displays FAQ accordion section
 */
export const DeliveryAccordion: React.FC<DeliveryAccordionProps> = ({
  accordion,
  isOpen,
  onToggle,
  isRTL,
  t,
  textAlignClass,
}) => {
  if (!accordion) return null;

  return (
    <div className="mt-8 pt-16 border-t-4 border-starbucks-green/10">
      <h2
        className={`text-3xl lg:text-4xl font-black text-starbucks-dark dark:text-white mb-12 ${textAlignClass}`}
      >
        {t(accordion.title)}
      </h2>
      <div className="space-y-6">
        {accordion.items?.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-50 dark:bg-white/5 rounded-3xl overflow-hidden"
          >
            <button
              onClick={() => onToggle(`faq-${idx}`)}
              className={`w-full p-8 flex items-center justify-between text-left group ${isRTL ? "text-right" : ""}`}
            >
              <span className="text-xl font-bold text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors">
                {t(item.title)}
              </span>
              <div className="text-starbucks-green">
                {isOpen(`faq-${idx}`) ? (
                  <Minus size={20} />
                ) : (
                  <Plus size={20} />
                )}
              </div>
            </button>
            <AnimatePresence>
              {isOpen(`faq-${idx}`) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div
                    className={`px-8 pb-8 text-lg text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
                  >
                    {t(item.content)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryAccordion;
