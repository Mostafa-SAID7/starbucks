import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { Button } from '../components/ui'
import { aboutUs as data } from '../data'

const AboutUsPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.hero.text.title[lang]} />

      {/* ─── Hero Split ─── */}
      <div className="flex flex-col lg:flex-row min-h-[380px]">
        {/* Left — B&W store photo */}
        <div className="relative flex-1 min-h-[280px] lg:min-h-0 overflow-hidden">
          <img
            src={data.hero.images.store}
            alt="Starbucks store"
            className="absolute inset-0 h-full w-full object-cover grayscale"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900&q=80'
              e.currentTarget.classList.add('grayscale')
            }}
          />
        </div>

        {/* Right — cup card + CTA */}
        <div className="flex flex-col justify-between bg-[#f7f7f7] dark:bg-zinc-950 lg:w-72 xl:w-80">
          {/* Cup image */}
          <div className="relative flex-1 min-h-[220px] overflow-hidden">
            <img
              src={data.hero.images.cup}
              alt="Starbucks cup"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-starbucks-dark/60 to-transparent" />
            <div className="absolute bottom-4 right-4 left-4 text-right">
              <p className="text-xs font-bold text-white/80 mb-0.5">
                {data.hero.text.history[lang]}
              </p>
              <p className="text-lg font-extrabold text-white">
                {data.hero.text.title[lang]}
              </p>
            </div>
          </div>
          {/* CTA button */}
          <div className="p-4">
            <a href={data.links.locations} target="_blank" rel="noopener noreferrer">
              <Button className="w-full rounded-full bg-white text-starbucks-dark font-extrabold text-sm hover:bg-starbucks-green hover:text-white transition-all border-2 border-starbucks-dark dark:border-white dark:bg-zinc-800 dark:text-white py-5">
                {data.hero.text.cta[lang]}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="container mx-auto max-w-4xl px-6 py-16 lg:px-8 space-y-16">
        {data.sections.map((section) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-right space-y-5"
          >
            <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white">
              {section.title[lang]}
            </h2>
            
            {section.id === 'intro' && section.content && (
              <div className="space-y-5">
                {section.content.map((item: any, idx: number) => {
                  if (item.type === 'lead') {
                    return (
                      <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-bold">
                        {item[lang]}
                      </p>
                    )
                  }
                  if (item.type === 'heading') {
                    return (
                      <h3 key={idx} className="text-xl font-extrabold text-starbucks-dark dark:text-white pt-2">
                        {item[lang]}
                      </h3>
                    )
                  }
                  return (
                    <p key={idx} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item[lang]}
                    </p>
                  )
                })}
              </div>
            )}

            {section.id === 'history' && (
              <div className="space-y-6">
                <p className="text-starbucks-green font-bold">
                  {section.lead?.[lang]}
                </p>
                <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.timeline?.map((item: any, idx: number) => (
                    <p key={idx}>{item[lang]}</p>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-end pt-4">
          <a href={data.links.talabat} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-full bg-starbucks-green px-10 py-6 font-extrabold text-white hover:bg-starbucks-dark transition-all">
              {data.buttons.order[lang]}
            </Button>
          </a>
          <a href={data.links.locations} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="rounded-full border-2 border-starbucks-dark px-10 py-6 font-extrabold text-starbucks-dark dark:border-white dark:text-white hover:bg-starbucks-dark hover:text-white transition-all"
            >
              {data.buttons.discover[lang]}
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage
