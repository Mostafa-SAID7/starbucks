import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/ui"
import { ANIMATION_CONFIG } from "@/lib/core/constants"

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
  ({ items, className, variant = 'default', defaultIndex = null }) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(defaultIndex)
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([])

    const toggleItem = (index: number) => {
      setOpenIndex(openIndex === index ? null : index)
    }

    // Handle keyboard navigation
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (focusedIndex < 0) return

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault()
            const nextIndex = focusedIndex < items.length - 1 ? focusedIndex + 1 : 0
            setFocusedIndex(nextIndex)
            buttonRefs.current[nextIndex]?.focus()
            break
          }
          case 'ArrowUp': {
            e.preventDefault()
            const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : items.length - 1
            setFocusedIndex(prevIndex)
            buttonRefs.current[prevIndex]?.focus()
            break
          }
          case 'Home': {
            e.preventDefault()
            setFocusedIndex(0)
            buttonRefs.current[0]?.focus()
            break
          }
          case 'End': {
            e.preventDefault()
            const lastIndex = items.length - 1
            setFocusedIndex(lastIndex)
            buttonRefs.current[lastIndex]?.focus()
            break
          }
          default:
            break
        }
      }

      const container = containerRef.current
      if (container) {
        container.addEventListener('keydown', handleKeyDown)
        return () => container.removeEventListener('keydown', handleKeyDown)
      }
    }, [focusedIndex, items.length])

    return (
      <div 
        className={cn(
          "space-y-4", 
          variant === 'minimal' && "space-y-2",
          className
        )} 
        ref={containerRef}
        role="region"
        aria-label="Accordion"
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              "group border transition-all duration-300",
              openIndex === index 
                ? "border-starbucks-green bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl shadow-sm" 
                : "border-gray-100 dark:border-zinc-800 rounded-xl hover:border-gray-200 dark:hover:border-zinc-700"
            )}
            role="region"
            aria-labelledby={`accordion-button-${index}`}
          >
            <button
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              id={`accordion-button-${index}`}
              type="button"
              onClick={() => toggleItem(index)}
              onFocus={() => setFocusedIndex(index)}
              className="flex w-full items-center justify-between p-5 text-start text-lg font-extrabold text-starbucks-dark hover:text-starbucks-green dark:text-white dark:hover:text-starbucks-green transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green rounded-lg"
              aria-expanded={openIndex === index}
              aria-controls={`accordion-content-${index}`}
            >
              <span className="flex-1">{item.title}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={ANIMATION_CONFIG.TRANSITIONS.QUICK_ROTATE as unknown as import("framer-motion").Transition}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full transition-colors",
                  openIndex === index ? "bg-starbucks-green text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-400"
                )}
                aria-hidden="true"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  id={`accordion-content-${index}`}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={ANIMATION_CONFIG.VARIANTS.ACCORDION_EXPAND}
                  transition={ANIMATION_CONFIG.TRANSITIONS.ACCORDION as unknown as import("framer-motion").Transition}
                  role="region"
                  aria-live="polite"
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
