import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function Tooltip({ children, content, side = "bottom", className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  const animation = {
    top: { opacity: 0, y: 10, scale: 0.95 },
    bottom: { opacity: 0, y: -10, scale: 0.95 },
    left: { opacity: 0, x: 10, scale: 0.95 },
    right: { opacity: 0, x: -10, scale: 0.95 },
  }[side]

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocusCapture={() => setIsVisible(true)}
      onBlurCapture={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={animation}
            animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
            exit={animation}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{ left: "50%" }}
            className={cn(
              "absolute z-[100] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white bg-starbucks-dark/95 dark:bg-zinc-800/95 backdrop-blur-md rounded-md whitespace-nowrap shadow-2xl pointer-events-none border border-white/10",
              side === "top" ? "bottom-full mb-3" : "top-full mt-3",
              className
            )}
          >
            {content}
            <div className={cn(
              "absolute w-2 h-2 bg-starbucks-dark dark:bg-zinc-800 rotate-45",
              {
                "bottom-[-4px] left-1/2 -translate-x-1/2": side === "top",
                "top-[-4px] left-1/2 -translate-x-1/2": side === "bottom",
              }
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
