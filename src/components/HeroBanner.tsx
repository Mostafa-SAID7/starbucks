import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import data from '../data/hero.json'

const HeroBanner: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-starbucks-green dark:bg-black transition-colors">
      <div className="container mx-auto flex flex-col items-center px-4 py-16 lg:flex-row lg:py-24">
        {/* Content */}
        <div className="z-10 w-full text-center lg:w-1/2 lg:text-left rtl:lg:text-right">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-4xl font-extrabold leading-tight text-white lg:text-6xl"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 text-xl text-white/90 lg:text-2xl"
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to={data.ctaLink}>
              <Button
                size="lg"
                className="rounded-full bg-white px-8 text-lg font-bold text-starbucks-dark hover:bg-gray-100 transition-all active:scale-95"
              >
                {t('hero.cta')}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Image */}
        <div className="mt-12 w-full lg:mt-0 lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
            <img
              src={data.imageUrl}
              alt={data.imageAlt}
              className="relative z-10 w-full object-contain"
            />
          </motion.div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-black/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
    </section>
  )
}

export default HeroBanner
