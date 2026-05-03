import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import InnerHeader from '../components/InnerHeader'
import { middleEast as data } from '../data'

const MiddleEastPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.title[lang]} />

      <InnerHeader
        title={data.title[lang]}
        subtitle={data.subtitle[lang]}
        variant="dark"
      />

      <div className="container mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {/* Main Statement Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-right leading-relaxed text-gray-700 dark:text-gray-300 text-base lg:text-lg border-b border-gray-100 dark:border-zinc-800 pb-12 mb-12"
        >
          {data.paragraphs[lang].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <div>
          <h2 className="mb-10 text-2xl font-extrabold text-starbucks-green text-right">
            {lang === 'ar' ? 'أسئلة وأجوبة :' : 'Q&A :'}
          </h2>
          <div className="space-y-8">
            {data.faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-right"
              >
                <h3 className="mb-3 text-base font-extrabold text-starbucks-dark dark:text-white lg:text-lg">
                  {faq.q[lang]}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.a[lang]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Publication Note */}
        <div className="mt-12 p-6 text-center border border-gray-100 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/30">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.updateNote[lang]}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MiddleEastPage
