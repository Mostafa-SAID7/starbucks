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
      <div className="flex flex-col min-h-[450px] lg:flex-row">
        {/* Story Side */}
        <div className="relative flex-1 min-h-[300px] lg:min-h-0 overflow-hidden group">
          <img
            src={data.hero.images.store}
            alt="Starbucks store"
            className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900&q=80'
              e.currentTarget.classList.add('grayscale')
            }}
          />
          <div className="absolute inset-0 bg-starbucks-dark/10 group-hover:bg-transparent transition-colors duration-700" />
        </div>

        {/* Cup Side */}
        <div className="flex flex-col justify-between bg-[#f7f7f7] dark:bg-zinc-950 lg:w-[400px]">
          {/* Cup image */}
          <div className="relative flex-1 min-h-[250px] overflow-hidden">
            <img
              src={data.hero.images.cup}
              alt="Starbucks cup"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-starbucks-dark/80 via-starbucks-dark/20 to-transparent" />
            <div className="absolute bottom-8 px-8 w-full text-start inset-inline-start-0">
              <p className="text-sm font-black text-white/70 uppercase tracking-widest mb-2">
                {data.hero.text.history[lang]}
              </p>
              <p className="text-3xl font-black text-white drop-shadow-lg">
                {data.hero.text.title[lang]}
              </p>
            </div>
          </div>
          {/* CTA button */}
          <div className="p-6">
            <a href={data.links.locations} target="_blank" rel="noopener noreferrer">
              <Button className="w-full h-14 rounded-full bg-starbucks-dark text-white font-black text-base hover:bg-starbucks-green transition-all shadow-xl">
                {data.hero.text.cta[lang]}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24 lg:px-8 space-y-24">
        {data.sections.map((section) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8 text-center lg:text-start"
          >
            <h2 className="text-4xl font-black text-starbucks-dark dark:text-white">
              {section.title[lang]}
            </h2>
            
            {section.id === 'intro' && section.content && (
              <div className="space-y-6 text-xl">
                {section.content.map((item: any, idx: number) => {
                  if (item.type === 'lead') {
                    return (
                      <p key={idx} className="text-gray-800 dark:text-gray-200 leading-relaxed font-black border-s-4 border-starbucks-green ps-6 py-2">
                        {item[lang]}
                      </p>
                    )
                  }
                  if (item.type === 'heading') {
                    return (
                      <h3 key={idx} className="text-2xl font-black text-starbucks-dark dark:text-white pt-6">
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
              <div className="space-y-8">
                <p className="text-starbucks-green font-black text-2xl">
                  {section.lead?.[lang]}
                </p>
                <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.timeline?.map((item: any, idx: number) => (
                    <p key={idx} className="relative ps-8 before:absolute before:inset-inline-start-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-starbucks-green lg:before:top-4">
                      {item[lang]}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-6 pt-10 justify-center lg:justify-start">
          <a href={data.links.talabat} target="_blank" rel="noopener noreferrer">
            <Button className="h-16 px-12 rounded-full bg-starbucks-green text-lg font-black text-white hover:bg-starbucks-dark transition-all shadow-2xl transform hover:-translate-y-1">
              {data.buttons.order[lang]}
            </Button>
          </a>
          <a href={data.links.locations} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="h-16 px-12 rounded-full border-2 border-starbucks-dark text-lg font-black text-starbucks-dark dark:border-white dark:text-white hover:bg-starbucks-dark hover:text-white transition-all shadow-xl transform hover:-translate-y-1"
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
