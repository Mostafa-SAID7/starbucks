import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SEO, Header, Accordion } from '../components'
import { middleEast as data } from '../data'

const MiddleEastPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.title[lang]} />

      <Header
        title={data.title[lang]}
        subtitle={data.subtitle[lang]}
        variant="dark"
      />

      <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24 lg:px-8">
        {/* Main Statement Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-start leading-relaxed text-gray-700 dark:text-gray-300 text-base lg:text-lg border-b border-gray-100 dark:border-zinc-800 pb-12 mb-12"
        >
          {data.paragraphs[lang].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <div>
          <h2 className="mb-10 text-2xl font-extrabold text-starbucks-green text-start">
            {data.faqTitle[lang]}
          </h2>
          <div className="mt-8">
            <Accordion 
              items={data.faqs.map((faq: any) => ({
                title: faq.q[lang],
                content: faq.a[lang]
              }))} 
            />
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
