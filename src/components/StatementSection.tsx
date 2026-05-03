import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from './ui'
import { Link } from 'react-router-dom'
import { statement as data } from '../data'

interface StatementData {
  title: string
  subtitle: string
  paragraphs: string[]
  ctaText: string
  ctaLink: string
}

const StatementSection = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language as keyof typeof data
  const localizedData = (data[lang] || data.en) as StatementData

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
            {localizedData.title}
          </h2>
          <div className="mb-8 space-y-4 text-center">
            <h4 className="text-xl font-semibold text-starbucks-green">
              {localizedData.subtitle}
            </h4>
            {localizedData.paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className="leading-relaxed text-gray-700 dark:text-gray-300 transition-colors">
                {paragraph}
              </p>
            ))}
          </div>
          <Link to={localizedData.ctaLink}>
            <Button variant="outline" size="lg">
              {localizedData.ctaText}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default StatementSection
