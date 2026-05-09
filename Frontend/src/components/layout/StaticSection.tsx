import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks'

interface StaticSectionProps {
  title?: { ar: string; en: string }
  children: React.ReactNode
  id?: string
  hideTitle?: boolean
  hideSideBorder?: boolean
  image?: string | { ar: string; en: string }
}

export const StaticSection: React.FC<StaticSectionProps> = ({ title, children, id, hideTitle = false, hideSideBorder = false, image }) => {
  const { lang } = useLanguage()
  const imageUrl = image ? (typeof image === 'string' ? image : image[lang]) : null

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      {imageUrl && (
        <div className="mb-8 rounded-[2rem] overflow-hidden shadow-lg aspect-video lg:aspect-[21/9]">
          <img
            src={imageUrl}
            alt={typeof title === 'object' ? title[lang] : ""}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {title && !hideTitle && (
        <h2 className={`text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white ps-4 ${!hideSideBorder ? 'border-s-4 border-starbucks-green' : ''}`}>
          {title[lang]}
        </h2>
      )}
      <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        {children}
      </div>
    </motion.section>
  )
}