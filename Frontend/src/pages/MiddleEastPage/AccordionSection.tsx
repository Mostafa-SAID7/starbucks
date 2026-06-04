import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import type { LocalizedText } from '@/types';
import { useLanguage } from '@/hooks';

interface AccordionSectionProps {
  id: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  title: string;
  paragraphs: (string | LocalizedText)[];
  textAlignClass: string;
  itemsAlignClass: string;
  overline?: string;
}

export function AccordionSection({
  id,
  isOpen,
  onToggle,
  title,
  paragraphs,
  textAlignClass,
  itemsAlignClass,
  overline,
}: AccordionSectionProps) {
  const { lang } = useLanguage();

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-12 mb-12 last:border-b-0 last:mb-0">
      <button
        onClick={() => onToggle(id)}
        className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
      >
        <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
          {overline && (
            <span className="text-starbucks-green font-bold text-sm uppercase tracking-widest mb-1 opacity-80">
              {overline}
            </span>
          )}
          <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight">
            {title}
          </h3>
        </div>
        <div className="text-starbucks-green bg-gray-50 dark:bg-white/5 p-3 rounded-full flex-shrink-0">
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className={`pt-8 space-y-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
            >
              {Array.isArray(paragraphs) &&
                paragraphs.map((p, idx) => (
                  <p key={idx} className="font-medium">
                    {typeof p === 'string' ? p : p[lang]}
                  </p>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
