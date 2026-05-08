import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ANIMATION_CONFIG } from "@/lib/constants"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  title?: string
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children, className, title }, ref) => {
    const [isBrowser, setIsBrowser] = React.useState(false)

    React.useEffect(() => {
      setIsBrowser(true)
    }, [])

    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    const handleEscape = React.useCallback((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }, [onClose])

    React.useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
      }
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen, handleEscape])

    if (!isBrowser) {
      return null
    }

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...ANIMATION_CONFIG.VARIANTS.FADE_IN}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
          >
            <motion.div
              {...ANIMATION_CONFIG.VARIANTS.SCALE_IN}
              transition={ANIMATION_CONFIG.TRANSITIONS.SPRING}
              className={cn(
                "relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl",
                className
              )}
              onClick={(e) => e.stopPropagation()}
              ref={ref}
            >
              {title && (
                <div className="border-b border-gray-100 dark:border-zinc-800 p-6">
                  <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                </div>
              )}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

Modal.displayName = "Modal"