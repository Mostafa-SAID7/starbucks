import { Toaster as Sonner } from 'sonner'
import { useTheme } from '@/hooks'
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
      position={isRTL ? 'top-center' : 'top-center'}
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '20px',
          padding: '20px',
          fontSize: '15px',
          fontWeight: '700',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: theme === 'dark' ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          color: theme === 'dark' ? '#fff' : '#1e3932',
        },
        className: 'group toast',
      }}
    />
  )
}
