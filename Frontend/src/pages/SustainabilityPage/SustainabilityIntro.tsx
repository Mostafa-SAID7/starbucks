import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface SustainabilityIntroProps {
  image?: string;
  title: string;
  overviewLabel: string;
  paragraphs: string[];
  isOpen: boolean;
  onToggle: () => void;
  textAlignClass: string;
  itemsAlignClass: string;
}

export function SustainabilityIntro({
  image,
  title,
  overviewLabel,
  paragraphs,
  isOpen,
  onToggle,
  textAlignClass,
  itemsAlignClass,
}: SustainabilityIntroProps) {
  return (
    <div className="pb-12 mb-12 border-b border-gray-100 dark:border-zinc-800">
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
          <span className="text-starbucks-green font-black text-sm uppercase tracking-[0.2em] mb-2 opacity-80">
            {overviewLabel}
          </span>
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
              {paragraphs.map((p, idx) => (
                <p key={idx} className="font-medium">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
