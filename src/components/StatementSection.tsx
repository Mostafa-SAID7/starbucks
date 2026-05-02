import { motion } from 'framer-motion'
import { Button } from './ui/button'
import statementData from '@/data/statement.json'
import type { StatementData } from '@/types'

const data: StatementData = statementData

const StatementSection = () => {
  return (
    <section className="bg-background-light dark:bg-background-dark py-16 transition-colors">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mb-6 text-3xl font-bold text-starbucks-dark dark:text-foreground-dark md:text-4xl transition-colors">
            {data.title}
          </h2>
          <div className="mb-8 space-y-4 text-right">
            <h4 className="text-xl font-semibold text-starbucks-green">
              {data.subtitle}
            </h4>
            {data.paragraphs.map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-gray-700 dark:text-gray-300 transition-colors">
                {paragraph}
              </p>
            ))}
          </div>
          <Button variant="outline" size="lg">
            {data.ctaText}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default StatementSection
