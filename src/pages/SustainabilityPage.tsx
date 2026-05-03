import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SEO, Button, Header } from '../components'
import { ExternalLink, Play } from 'lucide-react'
import { sustainability as data } from '../data'

interface ContentItem {
  ar: string
  en: string
}

interface Section {
  id: string
  title: { ar: string; en: string }
  subtitle?: { ar: string; en: string }
  image: string
  fallbackImage?: string
  content?: ContentItem | ContentItem[]
  subHeading?: { ar: string; en: string }
  subContent?: { ar: string; en: string }
  cta?: { ar: string; en: string }
  ctaLink?: string
  tipsTitle?: { ar: string; en: string }
  tips?: { ar: string; en: string }[]
  note?: { ar: string; en: string }
  link?: string
}

const SustainabilityPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden">
      <SEO title={data.title[lang]} />

      <Header
        title={data.title[lang]}
        variant="dark"
      />

      {data.sections.map((section: Section, index) => (
        <section
          key={section.id}
          className={`relative py-24 lg:py-32 ${
            index % 2 === 1 ? 'bg-gray-50 dark:bg-zinc-900/30' : 'bg-white dark:bg-black'
          }`}
        >
          <div className="container mx-auto px-6">
            <div className={`flex flex-col lg:flex-row items-center gap-16 ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              {/* Content */}
              <div className="flex-1 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-starbucks-dark dark:text-white leading-tight">
                    {section.title[lang]}
                  </h2>
                  {section.subtitle && (
                    <p className="text-xl text-starbucks-green font-bold italic">
                      {section.subtitle[lang]}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  {Array.isArray(section.content) ? (
                    section.content.map((p, idx) => (
                      <p key={idx}>{p[lang]}</p>
                    ))
                  ) : (
                    section.content && <p>{section.content[lang]}</p>
                  )}

                  {section.subHeading && (
                    <div className="pt-6 space-y-4">
                      <h3 className="text-2xl font-bold text-starbucks-dark dark:text-white">
                        {section.subHeading[lang]}
                      </h3>
                      {section.subContent && <p>{section.subContent[lang]}</p>}
                    </div>
                  )}

                  {section.tipsTitle && (
                    <div className="pt-6 space-y-4">
                      <p className="font-bold text-starbucks-dark dark:text-white">
                        {section.tipsTitle[lang]}
                      </p>
                      <ul className="space-y-3 ps-6">
                        {section.tips?.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                            <span>{tip[lang]}</span>
                          </li>
                        ))}
                      </ul>
                      {section.note && (
                        <p className="text-sm italic mt-4 p-4 bg-gray-100 dark:bg-zinc-800 rounded-xl border-s-4 border-starbucks-green">
                          {section.note[lang]}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>

                {(section.cta || section.link) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="pt-4"
                  >
                    {section.ctaLink?.includes('youtube') ? (
                      <Button
                        variant="primary"
                        leftIcon={<Play className="w-5 h-5" />}
                        onClick={() => window.open(section.ctaLink, '_blank')}
                      >
                        {section.cta?.[lang]}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        leftIcon={<ExternalLink className="w-5 h-5" />}
                        onClick={() => window.open(section.ctaLink || section.link, '_blank')}
                      >
                        {section.cta?.[lang] || (lang === 'ar' ? 'اعرف المزيد' : 'Learn More')}
                      </Button>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 relative"
              >
                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                  <img
                    src={section.image}
                    alt={section.title[lang]}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                      if (section.fallbackImage) {
                        ;(e.target as HTMLImageElement).src = section.fallbackImage
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Decorative element */}
                <div className={`absolute -z-10 w-64 h-64 bg-starbucks-green/10 rounded-full blur-3xl ${
                  index % 2 === 1 ? '-top-10 -left-10' : '-bottom-10 -right-10'
                }`} />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Sustainability Footer Section */}
      <section className="py-24 bg-starbucks-dark text-white overflow-hidden relative">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold italic">
              {lang === 'ar' ? 'نصنع الفرق معاً' : 'Making a difference together'}
            </h2>
            <p className="text-xl text-gray-400">
              {lang === 'ar' 
                ? 'انضم إلينا في رحلتنا لنكون شركة إيجابية الموارد ونقدم للبيئة أكثر مما نأخذ.'
                : 'Join us on our journey to be a resource-positive company and give back more to the environment than we take.'}
            </p>
            <Button
              variant="primary"
              size="lg"
              className="px-12"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {lang === 'ar' ? 'اكتشف المزيد' : 'Discover More'}
            </Button>
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-starbucks-green/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-starbucks-green/10 rounded-full blur-[120px]" />
      </section>
    </div>
  )
}

export default SustainabilityPage
