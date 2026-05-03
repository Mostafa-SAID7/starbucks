import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'
import { featuredCards } from '../../data'
import type { FeaturedCard, FeaturedCardsData } from '../../types'

export const FeaturedCards: React.FC = () => {
  const { i18n } = useTranslation()
  const localizedData: FeaturedCardsData =
    (featuredCards as unknown as Record<string, FeaturedCardsData>)[i18n.language] ?? featuredCards.en

  return (
    <section className="py-16 md:py-24 dark:bg-black transition-colors">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:px-8 md:grid-cols-2">
        {localizedData.cards.map((card: FeaturedCard, index: number) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-3xl shadow-lg transition-all hover:shadow-xl ${
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
                <h3 className="mb-4 text-2xl font-black text-starbucks-dark dark:text-white lg:text-3xl">
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
                    className="rounded-full border-2 border-starbucks-dark px-8 py-6 text-lg font-bold text-starbucks-dark hover:bg-starbucks-dark hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    asChild
                  >
                    <a href={card.ctaLink}>{card.cta}</a>
                  </Button>

                  {card.secondaryCta && card.secondaryCtaLink && (
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-lg font-bold text-starbucks-dark dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
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

export const FeaturedCardsSkeleton: React.FC = () => {
  return (
    <section className="py-16 md:py-24 dark:bg-black transition-colors">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:px-8 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-lg"
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Skeleton */}
              <div className="h-64 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800 md:h-[400px] md:w-1/2" />

              {/* Content Skeleton */}
              <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 gap-3">
                <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
                <div className="h-12 w-36 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
