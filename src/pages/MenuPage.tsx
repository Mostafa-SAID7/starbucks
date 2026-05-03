import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import MenuGrid from '../components/MenuGrid'
import { VerticalCard } from '../components/ui'
import AllergyInfo from '../components/AllergyInfo'
import SEO from '../components/SEO'
import { Button } from '../components/ui/button'
import MenuPromoVideo from '../components/MenuPromoVideo'
import menuData from '../data/menu.json'

export default function MenuPage() {
  const { i18n } = useTranslation()
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const data = menuData[currentLang]

  return (
    <div className="container mx-auto px-6 py-16 md:py-24 max-w-7xl">
      <SEO title={data.title} />
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar (Appears on the right in RTL) */}
        <div className="w-full md:w-80 lg:w-[350px] flex-shrink-0">
          <div className="sticky top-28">
            <VerticalCard {...data.sidebar} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div className="text-center md:text-start">
            <h1 className="mb-6 text-4xl font-black text-starbucks-dark dark:text-white lg:text-5xl">
              {data.title}
            </h1>
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300 lg:text-xl">
              {data.description}
            </p>
          </div>

          <MenuGrid categories={data.categories} />

          {/* Bottom Video & Links */}
          <div className="mt-12 space-y-8 text-center">
            <MenuPromoVideo />
            
            <div>
              <Button asChild className="rounded-2xl bg-starbucks-green font-bold text-white shadow-sm hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white">
                <Link to="/locations">
                  {currentLang === 'ar' ? 'مواقع محلاتنا' : 'Our Store Locations'}
                </Link>
              </Button>
            </div>

            <div className="mt-8 text-start">
              <AllergyInfo 
                title={data.allergyInfo.title}
                description={data.allergyInfo.description}
                link={data.allergyInfo.link}
                linkLabel={data.allergyInfo.linkLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
