import React from 'react'
import { useTranslation } from 'react-i18next'
import MenuGrid from '../components/MenuGrid'
import VerticalCard from '../components/VerticalCard'
import SEO from '../components/SEO'
import menuData from '../data/menu.json'

export default function MenuPage() {
  const { i18n } = useTranslation()
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const data = menuData[currentLang]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SEO title={data.title} />
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="mb-6 text-4xl font-bold text-foreground-light dark:text-foreground-dark">
              {data.title}
            </h1>
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {data.description}
            </p>
          </div>

          <MenuGrid categories={data.categories} />

          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
            <h3 className="mb-2 text-xl font-bold text-foreground-light dark:text-foreground-dark">
              {data.allergyInfo.title}
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {data.allergyInfo.description}
            </p>
            <a
              href={data.allergyInfo.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-starbucks-green hover:underline dark:text-starbucks-light"
            >
              {data.allergyInfo.linkLabel}
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <div className="sticky top-28">
            <VerticalCard {...data.sidebar} />
          </div>
        </div>
      </div>
    </div>
  )
}
