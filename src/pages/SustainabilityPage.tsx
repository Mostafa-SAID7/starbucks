import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import InnerHeader from '../components/InnerHeader'
import { Button } from '../components/ui'
import { ExternalLink } from 'lucide-react'
import { sustainability as data } from '../data'

const SustainabilityPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.title[lang]} />

      <InnerHeader
        title={data.title[lang]}
        subtitle={data.sections[0].subtitle[lang]}
        variant="dark"
      />

      {data.sections.map((section, idx) => {
        const isEven = idx % 2 === 0
        
        return (
          <section 
            key={section.id} 
            className={`py-16 lg:py-24 border-b border-gray-100 dark:border-zinc-800 ${!isEven ? 'bg-[#f7f7f7] dark:bg-zinc-950' : ''}`}
          >
            <div className="container mx-auto max-w-5xl px-6 lg:px-8">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                <div className="flex-1">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    src={section.image}
                    alt={section.title[lang]}
                    className="w-full rounded-3xl shadow-2xl"
                    onError={(e) => {
                      if (section.fallbackImage) e.currentTarget.src = section.fallbackImage
                    }}
                  />
                </div>
                <div className="flex-1 text-right space-y-6">
                  {section.link ? (
                    <a href={section.link} target="_blank" rel="noopener noreferrer" className="inline-block">
                      <h2 className="text-3xl font-extrabold text-starbucks-green underline underline-offset-4 lg:text-4xl leading-snug hover:text-starbucks-dark transition-colors">
                        {section.title[lang]}
                      </h2>
                    </a>
                  ) : (
                    <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white leading-snug lg:text-4xl">
                      {section.title[lang]}
                    </h2>
                  )}

                  {section.subHeading && (
                    <h3 className="text-xl font-extrabold text-starbucks-dark dark:text-white">
                      {section.subHeading[lang]}
                    </h3>
                  )}

                  {Array.isArray(section.content) ? (
                    section.content.map((p: any, pIdx: number) => (
                      <p key={pIdx} className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {p[lang]}
                      </p>
                    ))
                  ) : (
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      {section.content[lang]}
                    </p>
                  )}

                  {section.tipsTitle && (
                    <div className="bg-starbucks-green/10 dark:bg-starbucks-green/5 border border-starbucks-green/20 rounded-2xl p-6 text-right">
                      <p className="font-bold text-starbucks-dark dark:text-white mb-4">{section.tipsTitle[lang]}</p>
                      <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                        {section.tips?.map((tip: any, tIdx: number) => (
                          <li key={tIdx} className="flex items-start gap-3">
                            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-starbucks-green" />
                            <span>{tip[lang]}</span>
                          </li>
                        ))}
                      </ul>
                      {section.note && (
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                          {section.note[lang]}
                        </p>
                      )}
                    </div>
                  )}

                  {section.cta && (
                    <a href={section.ctaLink} target="_blank" rel="noopener noreferrer">
                      <Button className="rounded-full bg-starbucks-dark px-10 py-6 font-extrabold hover:bg-starbucks-green transition-all flex items-center gap-2">
                        {section.cta[lang]}
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default SustainabilityPage
