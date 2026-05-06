import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface StaticSectionProps {
  title?: { ar: string; en: string }
  children: React.ReactNode
  id?: string
  hideTitle?: boolean
  hideSideBorder?: boolean
}

export const StaticSection: React.FC<StaticSectionProps> = ({ title, children, id, hideTitle = false, hideSideBorder = false }) => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      {title && !hideTitle && (
        <h2 className={`text-2xl font-extrabold text-starbucks-dark dark:text-white ps-4 ${!hideSideBorder ? 'border-s-4 border-starbucks-green' : ''}`}>
          {title[lang]}
        </h2>
      )}
      <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        {children}
      </div>
    </motion.section>
  )
}