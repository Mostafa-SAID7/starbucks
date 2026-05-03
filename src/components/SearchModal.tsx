import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const trendingTerms = isRTL 
    ? ['لاتيه', 'كابتشينو', 'فرابوتشينو', 'قهوة مثلجة']
    : ['Latte', 'Cappuccino', 'Frappuccino', 'Iced Coffee']

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl pointer-events-auto border border-gray-100 dark:border-zinc-800">
              <div className="p-8">
                <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <h2 className="text-2xl font-extrabold text-starbucks-dark dark:text-white">
                    {t('common.search')}
                  </h2>
                </div>

                <div className="relative group">
                  <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 group-focus-within:text-starbucks-green transition-colors`} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={t('search.placeholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`w-full rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-5 ${isRTL ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-lg font-medium text-starbucks-dark dark:text-white outline-none focus:border-starbucks-green focus:ring-4 focus:ring-starbucks-green/10 transition-all`}
                  />
                </div>

                <div className="mt-8">
                  <p className={`text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('search.trending')}
                  </p>
                  <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    {trendingTerms.map((term) => (
                      <button
                        key={term}
                        className="rounded-full bg-gray-100 dark:bg-zinc-800 px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-starbucks-green hover:text-white transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SearchModal
