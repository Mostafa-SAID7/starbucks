import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SEO, Header } from '@/components'

interface StaticPageLayoutProps {
  title: { ar: string; en: string }
  headerSubtitle?: { ar: string; en: string }
  headerVariant?: 'light' | 'dark'
  children: React.ReactNode
  sidebar?: React.ReactNode
  isRTL?: boolean
}

export const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({
  title,
  headerSubtitle,
  headerVariant = 'light',
  children,
  sidebar,
  isRTL
}) => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={title[lang]} />

      <Header
        title={title[lang]}
        subtitle={headerSubtitle?.[lang]}
        variant={headerVariant}
      />

      <div className="container mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className={`flex flex-col gap-10 ${sidebar ? (isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row') : ''}`}>
          {sidebar && (
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                {sidebar}
              </div>
            </aside>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 space-y-12"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
