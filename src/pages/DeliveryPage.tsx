import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SEO, Button, Accordion } from '../components'
import { ExternalLink, Play } from 'lucide-react'
import { delivery as data } from '../data'

const DeliveryPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden">
      <SEO title={data.title[lang]} />

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-starbucks-dark">
          <img 
            src="https://www.starbucks.eg/sites/starbucks-eg-pwa/files/styles/c11_banner_full_1600x621/public/2021-01/DeliveryBanner.jpg.webp?h=9e25e982&itok=VzZl-Y6G" 
            alt="Starbucks Delivery"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="container relative mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-8 text-center md:text-start"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              {data.hero.title[lang]}
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed max-w-xl mx-auto md:mx-0">
              {data.hero.description[lang]}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href={data.urls.talabat} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full bg-starbucks-green hover:bg-starbucks-dark px-10 py-7 text-lg font-extrabold shadow-2xl shadow-starbucks-green/20 border-none w-full sm:w-auto">
                  {data.hero.cta[lang]}
                  <ExternalLink className="ms-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-[#f7f7f7] dark:bg-zinc-950">
        <div className="container mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white mb-16">
            {data.partners.title[lang]}
          </h2>
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-12 md:p-20 shadow-xl border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-12 transition-all hover:shadow-2xl">
            <div className="flex-1 space-y-6">
              <img 
                src="https://www.talabat.com/assets/images/talabat-logo.svg" 
                alt="Talabat" 
                className="h-12 mx-auto md:mx-0 dark:invert"
              />
              <h3 className="text-2xl font-extrabold text-starbucks-dark dark:text-white">
                {data.partners.status[lang]}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {data.partners.subStatus[lang]}
              </p>
              <div className="pt-4">
                <a href={data.urls.talabat} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-full border-2 border-starbucks-green text-starbucks-green hover:bg-starbucks-green hover:text-white font-extrabold px-8">
                    {data.hero.cta[lang]}
                  </Button>
                </a>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-starbucks-green/10 rounded-full blur-3xl" />
              <img 
                src="https://www.starbucks.eg/sites/starbucks-eg-pwa/files/styles/c01_vertical_card_1287x1792/public/2021-01/DeliveryImg1.jpg.webp?h=50122822&itok=p_H5y2N0" 
                alt="Order Starbucks"
                className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-starbucks-dark dark:text-white italic">
              {data.faqs.title[lang]}
            </h2>
          </div>
          <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] p-4 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
            <Accordion 
              items={data.faqs.items.map((faq) => ({
                title: faq.q[lang],
                content: faq.a[lang]
              }))} 
            />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-starbucks-dark overflow-hidden">
        <div className="container mx-auto max-w-6xl px-6 lg:px-8">
          <div className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-2xl">
            <img 
              src="https://www.starbucks.eg/sites/starbucks-eg-pwa/files/styles/c11_banner_full_1600x621/public/2021-01/DeliveryBanner.jpg.webp?h=9e25e982&itok=VzZl-Y6G" 
              alt="Starbucks Video"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="h-24 w-24 rounded-full bg-starbucks-green flex items-center justify-center shadow-2xl shadow-starbucks-green/40 group/btn"
              >
                <Play className="h-10 w-10 text-white fill-current ms-1 transition-transform group-hover/btn:scale-110" />
              </motion.button>
              <h3 className="mt-8 text-3xl font-extrabold text-white">
                {data.videoSection.title[lang]}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-[#f7f7f7] dark:bg-zinc-950">
        <div className="container mx-auto max-w-4xl px-6 lg:px-8 text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-starbucks-dark dark:text-white leading-tight italic">
            {data.hero.title[lang]}
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href={data.urls.talabat} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button className="rounded-full bg-starbucks-green px-12 py-8 text-xl font-extrabold shadow-2xl shadow-starbucks-green/20 border-none transition-all hover:scale-105 active:scale-95">
                {data.hero.cta[lang]}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DeliveryPage
