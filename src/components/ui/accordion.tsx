import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  title: string
  content: string | React.ReactNode
  isOpen: boolean
  onClick: () => void
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isOpen, onClick }) => {
  return (
    <div className={`mb-4 overflow-hidden rounded-2xl border transition-all duration-300 ${
      isOpen 
        ? 'border-starbucks-green bg-starbucks-green/[0.03] dark:bg-starbucks-green/[0.05] shadow-sm' 
        : 'border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 hover:border-starbucks-green/30 hover:shadow-md'
    }`}>
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between px-6 py-6 text-start focus:outline-none group"
        aria-expanded={isOpen}
      >
        <div className="flex w-full items-center gap-5">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-colors order-last ${
              isOpen ? 'bg-starbucks-green text-white' : 'bg-gray-100 dark:bg-zinc-800 text-starbucks-green'
            }`}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
          <span className={`text-lg font-extrabold transition-colors flex-1 text-start ${
            isOpen ? 'text-starbucks-green' : 'text-starbucks-dark dark:text-white group-hover:text-starbucks-green'
          }`}>
            {title}
          </span>
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed text-base text-start">
              {typeof content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                content
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface AccordionProps {
  items: { title: string; content: string | React.ReactNode }[]
  allowMultiple?: boolean
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false, className = '' }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const handleItemClick = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      )
    } else {
      setOpenIndexes(prev => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndexes.includes(index)}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  )
}
