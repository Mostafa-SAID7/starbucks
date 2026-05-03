import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SEO, Button } from '../components'
import { MapPin, ShoppingBag } from 'lucide-react'
import { aboutUs as data } from '../data'

interface ContentItem {
  type: string
  ar: string
  en: string
}

interface Section {
  id: string
  title: { ar: string; en: string }
  content?: ContentItem[]
  lead?: { ar: string; en: string }
  timeline?: { ar: string; en: string }[]
}

const AboutUsPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.hero.text.title[lang]} />

      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          <div className="relative overflow-hidden group">
            <img
              src={data.hero.images.store}
              alt="Starbucks Store"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          </div>
          <div className="relative hidden lg:block overflow-hidden group border-s-4 border-white dark:border-black">
            <img
              src={data.hero.images.cup}
              alt="Starbucks Cup"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-8"
          >
            <span className="text-xl lg:text-2xl font-bold tracking-widest text-starbucks-green uppercase">
              {data.hero.text.history[lang]}
            </span>
            <h1 className="text-6xl lg:text-8xl font-extrabold italic tracking-tight leading-tight">
              {data.hero.text.title[lang]}
            </h1>
            <div className="pt-8">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<MapPin className="w-5 h-5" />}
                className="px-12 py-6 text-xl rounded-full"
                onClick={() => window.open(data.links.locations, '_blank')}
              >
                {data.hero.text.cta[lang]}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="space-y-16">
            {(data.sections as Section[]).map((section: Section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6">
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-starbucks-dark dark:text-white">
                    {section.title[lang]}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
                </div>

                <div className="space-y-8">
                  {section.content?.map((item, idx) => (
                    <div key={idx}>
                      {item.type === 'lead' && (
                        <p className="text-2xl lg:text-3xl text-starbucks-green font-bold leading-relaxed">
                          {item[lang]}
                        </p>
                      )}
                      {item.type === 'heading' && (
                        <h3 className="text-2xl lg:text-3xl font-bold text-starbucks-dark dark:text-white pt-4">
                          {item[lang]}
                        </h3>
                      )}
                      {(item.type === 'paragraph' || !['lead', 'heading'].includes(item.type)) && (
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item[lang]}
                        </p>
                      )}
                    </div>
                  ))}

                  {section.lead && (
                    <p className="text-2xl lg:text-3xl text-starbucks-green font-bold leading-relaxed">
                      {section.lead[lang]}
                    </p>
                  )}

                  {section.timeline && (
                    <div className="space-y-12 pt-8">
                      {section.timeline.map((text: { ar: string; en: string }, idx: number) => (
                        <div key={idx} className="relative ps-8 border-s-2 border-gray-100 dark:border-zinc-800 pb-8 last:pb-0">
                          <div className="absolute top-0 -start-[9px] w-4 h-4 rounded-full bg-starbucks-green border-4 border-white dark:border-black" />
                          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            {text[lang]}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-starbucks-green text-white p-12 rounded-[3rem] space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-4xl font-extrabold italic">
                  {data.buttons.discover[lang]}
                </h3>
                <p className="text-lg text-white/80">
                  {lang === 'ar' ? 'اكتشف مواقعنا واستمتع بتجربة ستاربكس القريبة منك.' : 'Discover our locations and enjoy the Starbucks experience near you.'}
                </p>
              </div>
              <div>
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<MapPin className="w-5 h-5" />}
                  onClick={() => window.open(data.links.locations, '_blank')}
                  className="w-full md:w-auto"
                >
                  {data.hero.text.cta[lang]}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-starbucks-dark text-white p-12 rounded-[3rem] space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-4xl font-extrabold italic">
                  {data.buttons.order[lang]}
                </h3>
                <p className="text-lg text-gray-400">
                  {lang === 'ar' ? 'اطلب مشروبك المفضل عبر طلبات واستمتع به في منزلك.' : 'Order your favorite drink via Talabat and enjoy it at home.'}
                </p>
              </div>
              <div>
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<ShoppingBag className="w-5 h-5" />}
                  onClick={() => window.open(data.links.talabat, '_blank')}
                  className="w-full md:w-auto"
                >
                  {data.buttons.order[lang]}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUsPage
