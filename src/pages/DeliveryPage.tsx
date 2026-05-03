import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SEO, Button, Logo, MenuPromoVideo, Accordion } from '../components'
import { delivery as data } from '../data'

import talabatLogo from '../assets/talabat.png'

const DeliveryPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.title[lang]} />

      {/* ─── Hero Section ─── */}
      <section className="bg-[#f7f7f7] dark:bg-zinc-950 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12">
          <div className="flex flex-col-reverse items-center gap-10 lg:flex-row-reverse">
            {/* Main Text */}
            <div className="flex-1 text-start space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold text-starbucks-dark dark:text-white lg:text-5xl leading-tight"
              >
                {data.hero.title[lang]}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {data.hero.description[lang]}
              </motion.p>

              {/* Partners Card */}
              <div className="mt-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <p className="mb-4 text-base font-extrabold text-starbucks-dark dark:text-white text-center">
                  {data.partners.title[lang]}
                </p>
                <div className="flex items-center justify-center gap-3 mb-6">
                  {/* Starbucks logo */}
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700 shadow">
                    <Logo className="h-full w-full object-cover" />
                  </div>
                  {/* Plus / separator */}
                  <div className="h-8 w-px bg-gray-200 dark:bg-zinc-700" />
                  {/* Talabat logo */}
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700 shadow">
                    <img
                      src={talabatLogo}
                      alt="Talabat"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-center text-sm font-bold text-starbucks-dark dark:text-white mb-1">
                  {data.partners.status[lang]}
                </p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">
                  {data.partners.subStatus[lang]}
                </p>
                <a href={data.urls.talabat} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full rounded-full bg-starbucks-green py-6 font-extrabold text-white hover:bg-starbucks-dark transition-all">
                    {data.hero.cta[lang]}
                  </Button>
                </a>
              </div>
            </div>

            {/* Video Section */}
            <div className="flex-1 w-full max-w-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-6 text-center"
              >
                <MenuPromoVideo />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-starbucks-dark dark:text-white">
                    {data.videoSection.title[lang]}
                  </h3>
                  <a href={data.urls.talabat} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="rounded-2xl bg-starbucks-green px-12 py-7 text-lg font-extrabold text-white shadow-xl hover:bg-starbucks-dark transition-all transform hover:scale-105 active:scale-95">
                      {data.hero.cta[lang]}
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Enjoy at Home Section ─── */}
      <section className="py-16 md:py-24 border-b border-gray-100 dark:border-zinc-800">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12">
          <div className="flex flex-col items-center gap-10 lg:flex-row">
            <div className="flex-1">
              <motion.img
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                src={data.homeSection.image}
                alt={data.homeSection.title[lang]}
                className="w-full rounded-3xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = data.homeSection.fallbackImage
                }}
              />
            </div>
            <div className="flex-1 text-start space-y-6">
              <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white lg:text-4xl leading-snug">
                {data.homeSection.title[lang]}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {data.homeSection.description[lang]}
              </p>
              <Link to="/our-coffees">
                <Button
                  variant="outline"
                  className="rounded-full border-2 border-starbucks-dark px-10 py-6 font-extrabold text-starbucks-dark hover:bg-starbucks-dark hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  {data.homeSection.cta[lang]}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-16 md:py-24 bg-[#f9f9f9] dark:bg-zinc-950">
        <div className="container mx-auto max-w-4xl px-6">
          <h2 className="mb-12 text-start text-3xl font-extrabold text-starbucks-dark dark:text-white">
            {data.faqs.title[lang]}
          </h2>
          <div className="mt-12">
            <Accordion 
              items={data.faqs.items.map((faq: any) => ({
                title: faq.q[lang],
                content: faq.a[lang]
              }))} 
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default DeliveryPage
