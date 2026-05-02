import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import featuredCardsData from '@/data/featured-cards.json'
import type { FeaturedCardsData } from '@/types'

const data = featuredCardsData as FeaturedCardsData

const FeaturedCards = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {data.cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={`group overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl ${
                  card.theme === 'Green' 
                    ? 'bg-starbucks-green text-white' 
                    : card.theme === 'Gray' 
                    ? 'bg-gray-100 dark:bg-gray-800' 
                    : 'bg-card-light dark:bg-card-dark'
                }`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className={`mb-3 text-right text-2xl font-bold transition-colors ${
                    card.theme === 'Green' ? 'text-white' : 'text-starbucks-dark dark:text-foreground-dark'
                  }`}>
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className={`mb-4 text-right text-sm leading-relaxed transition-colors ${
                      card.theme === 'Green' ? 'text-green-50' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {card.description}
                    </p>
                  )}
                  <div className="flex flex-col gap-3">
                    <Button
                      variant={card.theme === 'Green' ? 'outline' : 'default'}
                      className={`w-full justify-between ${
                        card.theme === 'Green' ? 'border-white text-white hover:bg-white hover:text-starbucks-green' : ''
                      }`}
                      asChild
                    >
                      <a href={card.ctaLink}>
                        {card.cta}
                        <ArrowLeft className="h-4 w-4" />
                      </a>
                    </Button>
                    {card.secondaryCta && (
                      <Button
                        variant="outline"
                        className={`w-full justify-between ${
                          card.theme === 'Green' ? 'border-white text-white hover:bg-white hover:text-starbucks-green' : ''
                        }`}
                        asChild
                      >
                        <a href={card.secondaryCtaLink}>
                          {card.secondaryCta}
                          <ArrowLeft className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCards
