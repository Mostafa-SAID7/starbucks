import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange?: (open: boolean) => void
}>({ open: false })

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <DialogContext.Provider value={{ open: open || false, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
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
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof motion.div>, "children"> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(DialogContext)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange?.(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
          />
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white/95 dark:bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-md border border-white/20 dark:border-zinc-800/50",
              className
            )}
            {...props}
          >
            <button
              onClick={() => onOpenChange?.(false)}
              className="absolute left-4 top-4 rounded-full p-2 opacity-70 transition-all hover:opacity-100 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-right", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-2xl font-black text-starbucks-dark dark:text-white uppercase tracking-tighter", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle }
