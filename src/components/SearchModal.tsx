import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { navbar } from '../data'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const isRTL = i18n.language === 'ar'
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const searchData = (navbar as any)[lang].search

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const trendingTerms = lang === 'ar' 
    ? ['لاتيه', 'كابتشينو', 'فرابوتشينو', 'قهوة مثلجة']
    : ['Latte', 'Cappuccino', 'Frappuccino', 'Iced Coffee']

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop with extreme blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
            transition={{ duration: 0.4 }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 40, filter: 'blur(10px)' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              mass: 0.8
            }}
            className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-zinc-900/95 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] backdrop-blur-md border border-white/20 dark:border-zinc-800/50"
          >
            <div className="p-8 md:p-12">
              <div className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                <button
                  onClick={onClose}
                  className="p-3 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all hover:rotate-90 active:scale-90"
                >
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                <motion.h2 
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-black text-starbucks-dark dark:text-white uppercase tracking-tighter"
                >
                  {searchData.title}
                </motion.h2>
              </div>

              <div className="relative group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 p-2`}
                >
                  <Search className="h-7 w-7 text-gray-400 group-focus-within:text-starbucks-green transition-colors" />
                </motion.div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchData.placeholder}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`w-full rounded-[2rem] border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 py-7 ${isRTL ? 'pr-20 pl-8' : 'pl-20 pr-8'} text-2xl font-bold text-starbucks-dark dark:text-white outline-none focus:border-starbucks-green focus:ring-[12px] focus:ring-starbucks-green/5 transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-700`}
                />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <p className={`text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {searchData.trending}
                </p>
                <div className={`flex flex-wrap gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  {trendingTerms.map((term, i) => (
                    <motion.button
                      key={term}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="rounded-full bg-gray-100 dark:bg-zinc-800 px-7 py-3 text-sm font-black text-gray-600 dark:text-gray-300 hover:bg-starbucks-green hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SearchModal
