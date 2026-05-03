import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from './ui'
import { ArrowLeft } from 'lucide-react'
import { featuredCards } from '../data'
import type { FeaturedCardsData } from '../types'

export default function FeaturedCards() {
  const { i18n } = useTranslation()
  const localizedData = (featuredCards as any)[i18n.language] || featuredCards.en

  return (
    <section className="py-12 dark:bg-black transition-colors">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
        {localizedData.cards.map((card: any, index: number) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl ${
              card.theme === 'Green' 
                ? 'bg-[#d4e9e2] dark:bg-[#1e3932]' 
                : 'bg-[#f2f0eb] dark:bg-[#2d2926]'
            }`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="h-64 w-full overflow-hidden md:h-auto md:w-1/2">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content Section */}
              <div className="flex w-full flex-col justify-center p-8 text-center md:w-1/2 md:p-12 md:text-left rtl:md:text-right">
                <h3 className="mb-4 text-2xl font-extrabold text-starbucks-dark dark:text-foreground-dark lg:text-3xl">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {card.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <Button
                    variant="outline"
                    className="rounded-full border-2 border-starbucks-dark px-8 py-6 text-lg font-bold text-starbucks-dark hover:bg-starbucks-dark hover:text-white dark:border-foreground-dark dark:text-foreground-dark dark:hover:bg-foreground-dark dark:hover:text-black transition-all"
                    asChild
                  >
                    <a href={card.ctaLink}>
                      {card.cta}
                    </a>
                  </Button>
                  
                  {card.secondaryCta && card.secondaryCtaLink && (
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-lg font-bold text-starbucks-dark dark:text-foreground-dark hover:bg-black/5 dark:hover:bg-white/5"
                      asChild
                    >
                      <a href={card.secondaryCtaLink}>
                        {card.secondaryCta}
                        <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
