import { motion } from 'framer-motion'
import { Button } from './ui/button'
import heroData from '@/data/hero.json'
import type { HeroBannerData } from '@/types'

const data: HeroBannerData = heroData

const HeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-background-dark transition-colors">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 text-center md:order-1 md:text-right"
          >
            <h1 className="mb-4 text-3xl font-bold leading-tight text-starbucks-dark dark:text-foreground-dark md:text-4xl lg:text-5xl transition-colors">
              {data.title}
            </h1>
            <p className="mb-6 text-base text-gray-700 dark:text-gray-300 md:text-lg transition-colors">
              {data.description}
            </p>
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              {data.ctaText}
            </Button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={data.imageUrl}
                alt={data.imageAlt}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
