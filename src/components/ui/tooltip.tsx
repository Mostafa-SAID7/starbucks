import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  className?: string
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, side = "top", align = "center", className }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    const positions = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2"
    }

    const alignments = {
      start: "translate-x-0",
      center: "-translate-x-1/2",
      end: "-translate-x-full"
    }

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap",
                positions[side],
                side === "top" || side === "bottom" ? alignments[align] : "",
                className
              )}
              role="tooltip"
            >
              {content}
              <div className="absolute w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Tooltip.displayName = "Tooltip"