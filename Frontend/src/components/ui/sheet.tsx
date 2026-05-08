import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ANIMATION_CONFIG } from "@/lib/constants"
import { SheetProps } from "@/types/components";

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  return (
    <SheetContext.Provider value={{ open: open || false, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetContext = React.createContext<{
  open: boolean
  onOpenChange?: (open: boolean) => void
}>({ open: false })

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(SheetContext)
  return (
    <button
      ref={ref}
      className={className}
      onClick={() => onOpenChange?.(true)}
      {...props}
    >
      {children}
    </button>
  )
})
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: "right" | "left" }
>(({ className, children, side = "right", ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(SheetContext)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <motion.div
            {...ANIMATION_CONFIG.VARIANTS.FADE_IN}
            className="fixed inset-0 bg-black/50"
            onClick={() => onOpenChange?.(false)}
          />
          <motion.div
            ref={ref}
            {...(side === "right" ? ANIMATION_CONFIG.VARIANTS.SLIDE_IN_RIGHT : ANIMATION_CONFIG.VARIANTS.SLIDE_IN_LEFT)}
            transition={ANIMATION_CONFIG.TRANSITIONS.SPRING}
            className={cn(
              "fixed z-50 gap-4 bg-white dark:bg-zinc-900 p-6 shadow-lg border-border-light dark:border-border-dark",
              side === "right" && "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l",
              side === "left" && "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r",
              className
            )}
            {...(props as import("framer-motion").HTMLMotionProps<"div">)}
          >
            <button
              onClick={() => onOpenChange?.(false)}
              className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 text-foreground-light dark:text-foreground-dark"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">إغلاق</span>
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
})
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-right", className)}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold text-foreground-light dark:text-foreground-dark", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle }
