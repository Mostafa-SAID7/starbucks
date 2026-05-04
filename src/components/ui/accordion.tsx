import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AccordionItem {
  title: string
  content: string
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, className }, ref) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null)

    const toggleItem = (index: number) => {
      setOpenIndex(openIndex === index ? null : index)
    }

    return (
      <div className={cn("space-y-2", className)} ref={ref}>
        {items.map((item, index) => (
          <div key={index} className="border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between p-4 text-left text-sm font-bold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-zinc-800 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span>{item.title}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
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