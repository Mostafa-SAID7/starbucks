import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { navbar } from '../../data'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Input } from './input'

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
    }
  }, [isOpen])

  const trendingTerms = lang === 'ar' 
    ? ['لاتيه', 'كابتشينو', 'فرابوتشينو', 'قهوة مثلجة']
    : ['Latte', 'Cappuccino', 'Frappuccino', 'Iced Coffee']

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-zinc-900/95 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] backdrop-blur-md border border-white/20 dark:border-zinc-800/50 p-8 md:p-12">
        <DialogHeader className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
          <DialogTitle className="text-3xl font-black text-starbucks-dark dark:text-white uppercase tracking-tighter">
            {searchData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative group">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 p-2 z-10`}
          >
            <Search className="h-7 w-7 text-gray-400 group-focus-within:text-starbucks-green transition-colors" />
          </motion.div>
          <Input
            ref={inputRef}
            type="text"
            placeholder={searchData.placeholder}
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`w-full py-8 text-2xl ${isRTL ? 'pr-20 pl-8' : 'pl-20 pr-8'}`}
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
      </DialogContent>
    </Dialog>
  )
}

export { SearchModal }
