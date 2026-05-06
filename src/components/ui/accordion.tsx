import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AccordionItem {
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
  variant?: 'default' | 'minimal' | 'sidebar'
  defaultIndex?: number | null
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, className, variant = 'default', defaultIndex = null }, ref) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(defaultIndex)

    const toggleItem = (index: number) => {
      setOpenIndex(openIndex === index ? null : index)
    }

    return (
      <div className={cn(
        "space-y-4", 
        variant === 'minimal' && "space-y-2",
        className
      )} ref={ref}>
        {items.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              "group border transition-all duration-300",
              openIndex === index 
                ? "border-starbucks-green bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl shadow-sm" 
                : "border-gray-100 dark:border-zinc-800 rounded-xl hover:border-gray-200 dark:hover:border-zinc-700"
            )}
          >
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between p-5 text-start text-lg font-extrabold text-starbucks-dark hover:text-starbucks-green dark:text-white dark:hover:text-starbucks-green transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="flex-1">{item.title}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full transition-colors",
                  openIndex === index ? "bg-starbucks-green text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-400"
                )}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 }
                  }}
                  transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-6 pb-6 pt-2 text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100/50 dark:border-zinc-700/50 mt-2">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    )
  }
)

Accordion.displayName = "Accordion"