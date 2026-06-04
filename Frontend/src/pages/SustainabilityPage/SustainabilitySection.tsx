import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/ui';

interface SustainabilitySectionProps {
  id: string;
  image?: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  list: string[];
  note?: string;
  isOpen: boolean;
  onToggle: () => void;
  textAlignClass: string;
  itemsAlignClass: string;
  isRTL: boolean;
}

export function SustainabilitySection({
  id,
  image,
  title,
  subtitle,
  paragraphs,
  list,
  note,
  isOpen,
  onToggle,
  textAlignClass,
  itemsAlignClass,
  isRTL,
}: SustainabilitySectionProps) {
  return (
    <div className="pb-12 border-b border-gray-100 dark:border-zinc-800 last:border-0">
      {image && (
        <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video relative group">
          <img
            src={image}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={title}
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>
      )}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
      >
        <div className={`flex flex-col ${itemsAlignClass} flex-grow`}>
          {subtitle && (
            <span className="text-starbucks-green font-black text-sm uppercase tracking-[0.2em] mb-2 opacity-80">
              {subtitle}
            </span>
          )}
          <h3 className="text-3xl lg:text-5xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-all leading-tight">
            {title}
          </h3>
        </div>
        <div className="text-starbucks-green bg-starbucks-green/5 dark:bg-white/5 p-4 rounded-full flex-shrink-0 transition-transform group-hover:scale-110">
          {isOpen ? <Minus size={28} /> : <Plus size={28} />}
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
            <div className={`pt-10 space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}>
              {paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}

              {list && list.length > 0 && (
                <ul className={`space-y-6 ${isRTL ? 'border-r-4 pr-8' : 'border-l-4 pl-8'} border-starbucks-green/30 font-medium`}>
                  {list.map((item, lIdx) => (
                    <li key={lIdx} className="relative">
                      <span className={cn(
                        "absolute top-3 w-2 h-2 rounded-full bg-starbucks-green",
                        isRTL ? "-right-10" : "-left-10"
                      )} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {note && note !== `pages:sustainability.sections.${id}.note` && (
                <div className="p-10 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-gray-800 italic text-lg shadow-inner text-starbucks-dark dark:text-gray-200">
                  {note}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
