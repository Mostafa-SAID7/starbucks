import { Toaster as Sonner } from 'sonner'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'

export function Toaster() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <Sonner
      theme={theme as 'light' | 'dark'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="toaster group"
      position="top-center"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600',
          border: 'none',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        className: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-starbucks-dark group-[.toaster]:border-gray-100 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-900 dark:group-[.toaster]:text-white dark:group-[.toaster]:border-zinc-800 backdrop-blur-md',
      }}
    />
  )
}
