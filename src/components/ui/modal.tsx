import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog'
import { useTranslation } from 'react-i18next'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children, className = '' }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`max-w-3xl overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-zinc-900/95 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] backdrop-blur-md border border-white/20 dark:border-zinc-800/50 p-8 md:p-12 ${className}`}>
        {(title || description) && (
          <DialogHeader className={`flex flex-col mb-10 ${isRTL ? 'items-end' : 'items-start'}`}>
            {title && (
              <DialogTitle className="text-3xl font-black text-starbucks-dark dark:text-white uppercase tracking-tighter">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className={`text-gray-500 dark:text-gray-400 mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}
