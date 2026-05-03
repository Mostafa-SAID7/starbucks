import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { hero as data } from '../../data'

export const Banner: React.FC = () => {
  const { i18n } = useTranslation()
  const localizedData = (data as any)[i18n.language] || data.en

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={localizedData.imageUrl}
        alt={localizedData.imageAlt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent rtl:bg-gradient-to-l">
        <div className="container mx-auto h-full flex items-center px-6 lg:px-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: i18n.language === 'ar' ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="mb-6 text-3xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
                {localizedData.title}
              </h1>
              <p className="mb-8 text-lg text-white/90 md:text-xl lg:text-2xl max-w-lg">
                {localizedData.description}
              </p>
              <Link to={localizedData.ctaLink}>
                <Button
                  size="lg"
                  className="rounded-full bg-starbucks-green px-10 py-7 text-lg font-bold text-white hover:bg-starbucks-dark transition-all active:scale-95 shadow-xl"
                >
                  {localizedData.ctaText}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 inset-inline-start-0 h-32 w-full bg-gradient-to-t from-background-light dark:from-background-dark to-transparent" />
    </section>
  )
}
