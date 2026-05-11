import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks'
import { SEO, Header } from '@/components'

interface StaticPageLayoutProps {
  title: { ar: string; en: string }
  headerSubtitle?: { ar: string; en: string }
  headerVariant?: 'light' | 'dark'
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({
  title,
  headerSubtitle,
  headerVariant = 'light',
  children,
  sidebar,
}) => {
  const { lang } = useLanguage()

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={title[lang]} />

      <Header
        title={title[lang]}
        subtitle={headerSubtitle?.[lang]}
        variant={headerVariant}
      />

      <div className="container mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className={`flex flex-col gap-10 ${sidebar ? 'lg:flex-row' : ''}`}>
          {sidebar && (
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-8">
                {sidebar}
              </div>
            </aside>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 space-y-12"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}