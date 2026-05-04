import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Navigation } from 'lucide-react'
import { SEO } from '@/components'
import { cities, TALABAT_URL } from './constants'

export const LocationsPage: React.FC = () => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={isRTL ? 'ابحث عن مقهى ستاربكس | مصر' : 'Find Your Nearest Starbucks | Egypt'} />

      {/* ─── Main Split Layout ─── */}
      <div className="flex flex-col lg:flex-row min-h-[480px]">

        {/* Left — Hero / Search */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-8 bg-starbucks-dark px-8 py-20 text-white lg:max-w-[45%]">
          {/* Bg image overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://www.starbucks.eg/assets/image-cache/store-locator-hero.jpg"
              alt=""
              className="h-full w-full object-cover opacity-30"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-starbucks-dark/70" />
          </div>

          <div className="relative z-10 text-center w-full max-w-sm">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 text-4xl font-black uppercase tracking-tight leading-none lg:text-5xl"
            >
              {isRTL ? (
                <>ابحث عن أقرب<br />ستاربكس</>
              ) : (
                <>FIND YOUR<br />NEAREST<br />STARBUCKS</>
              )}
            </motion.h1>
            <p className="mb-8 text-lg font-medium text-white/80">
              {isRTL ? 'في مصر' : 'in Egypt'}
            </p>

            {/* Search bar */}
            <div className="relative mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isRTL ? 'ابحث عن فرع...' : 'Find a store'}
                className="w-full rounded-full bg-white/15 backdrop-blur-sm py-3.5 pe-12 ps-4 text-white placeholder-white/60 outline-none ring-1 ring-white/20 focus:ring-white transition-all"
              />
              <Search className="absolute top-1/2 inset-inline-end-4 h-5 w-5 -translate-y-1/2 text-white/60" />
            </div>

            {/* Use my location */}
            <button className="flex items-center gap-2 mx-auto text-sm font-bold text-white/80 hover:text-white transition-colors underline underline-offset-4">
              <Navigation className="h-4 w-4" />
              {isRTL ? 'استخدم موقعي ▼' : 'Use my location ▼'}
            </button>
          </div>
        </div>

        {/* Right — Cards */}
        <div className="flex flex-1 flex-col divide-y divide-gray-100 dark:divide-zinc-800 lg:max-w-[55%]">
          {/* Card 1 — Joy of Coffee */}
          <div className="flex flex-col overflow-hidden md:flex-row-reverse">
            <div className="w-full md:w-1/2 flex-shrink-0">
              <img
                src="https://www.starbucks.eg/assets/image-cache/coffee-beans-hero.jpg"
                alt="The Joy of Starbucks Coffee"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80'
                }}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-8">
              <h2 className="mb-2 text-xl font-bold text-starbucks-dark dark:text-white">
                {isRTL ? 'بهجة قهوة ستاربكس' : 'The Joy of Starbucks Coffee'}
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {isRTL
                  ? <>اكتشف <span className="text-starbucks-green font-bold">طيف تحميص ستاربكس</span> وتعمق في تقنيات التخمير</>
                  : <>Discover <span className="text-starbucks-green font-bold">Starbucks Roast Spectrum</span> and dive deep into brewing techniques</>
                }
              </p>
              <Link
                to={`/${currentLang}/our-coffees`}
                className="inline-block rounded-full border border-starbucks-dark dark:border-white px-5 py-2 text-sm font-bold text-starbucks-dark dark:text-white hover:bg-starbucks-dark hover:text-white dark:hover:bg-white dark:hover:text-black transition-all w-fit"
              >
                {isRTL ? 'اقرأ المزيد' : 'Read more'}
              </Link>
            </div>
          </div>

          {/* Card 2 — Starbucks Delivers */}
          <div className="flex flex-col overflow-hidden md:flex-row-reverse">
            <div className="w-full md:w-1/2 flex-shrink-0">
              <img
                src="https://www.starbucks.eg/assets/image-cache/delivery-cups.jpg"
                alt="Starbucks Delivers"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'
                }}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-8">
              <h2 className="mb-2 text-xl font-bold text-starbucks-dark dark:text-white">
                {isRTL ? 'ستاربكس توصل' : 'Starbucks Delivers'}
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {isRTL
                  ? 'احصل على مشروبك المفضل من ستاربكس حتى بابك!'
                  : 'Get your Starbucks favourite delivered to your door!'}
              </p>
              <a
                href={TALABAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-starbucks-dark dark:border-white px-5 py-2 text-sm font-bold text-starbucks-dark dark:text-white hover:bg-starbucks-dark hover:text-white dark:hover:bg-white dark:hover:text-black transition-all w-fit"
              >
                {isRTL ? 'اطلب الآن' : 'Order now'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── City Directory ─── */}
      <div className="border-t border-gray-100 dark:border-zinc-800 py-12 px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8 text-lg font-extrabold text-starbucks-dark dark:text-white">
            {isRTL ? 'جميع الفروع في مصر' : 'All Locations in Egypt'}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {cities
              .filter(c =>
                search === '' ||
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.nameAr.includes(search)
              )
              .map((city) => (
                <motion.a
                  key={city.slug}
                  href={`https://locations.starbucks.eg/directory/${city.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: isRTL ? 4 : -4 }}
                  className="flex items-center gap-2 text-starbucks-green font-bold hover:underline underline-offset-4"
                >
                  <span>{isRTL ? city.nameAr : city.name}</span>
                  <span className="text-gray-400 font-normal text-sm">({city.count})</span>
                </motion.a>
              ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default LocationsPage
