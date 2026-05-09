import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ExternalLink } from "lucide-react";
import type { GenericPageData, LocalizedText } from "@/types";

interface DeliverySectionProps {
  section: GenericPageData["sections"][0];
  isOpen: boolean;
  onToggle: () => void;
  isRTL: boolean;
  t: (obj: LocalizedText | string | null | undefined) => string;
  textAlignClass: string;
}

/**
 * Delivery Page Section Component
 * Displays expandable section with image, content, and CTA
 */
export const DeliverySection: React.FC<DeliverySectionProps> = ({
  section,
  isOpen,
  onToggle,
  isRTL,
  t,
  textAlignClass,
}) => {
  return (
    <div className="pb-12 border-b border-gray-100 dark:border-gray-800">
      {section.image && (
        <div className="mb-8 rounded-3xl overflow-hidden shadow-lg aspect-video lg:aspect-21/9">
          <img
            src={t(section.image)}
            alt={t(section.title)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
      >
        <div className="flex flex-col items-start grow">
          <span className="text-starbucks-green font-bold text-sm uppercase tracking-widest mb-1 opacity-80">
            {t(section.subtitle)}
          </span>
          <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
            {t(section.title)}
          </h3>
        </div>
        <div className="text-starbucks-green bg-gray-50 dark:bg-white/5 p-3 rounded-full shrink-0">
          {isOpen ? (
            <Minus size={24} />
          ) : (
            <Plus size={24} />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className={`pt-8 space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
            >
              {section.paragraphs?.map((p, pIdx) => (
                <p key={pIdx}>{t(p)}</p>
              ))}

              {section.list && (
                <ul
                  className={`space-y-4 ${isRTL ? "border-r-4 pr-6" : "border-l-4 pl-6"} border-starbucks-green/20 font-medium`}
                >
                  {section.list.map((item, lIdx) => (
                    <li key={lIdx}>{t(item)}</li>
                  ))}
                </ul>
              )}

              {section.cta && section.ctaLink && (
                <div className="pt-4">
                  <a
                    href={section.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-starbucks-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-starbucks-green-dark transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t(section.cta)}
                    <ExternalLink size={20} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliverySection;
