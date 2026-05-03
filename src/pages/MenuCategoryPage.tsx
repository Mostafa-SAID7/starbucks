import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import menuData from '../data/menu.json'
import NotFound from './NotFound'

export default function MenuCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { i18n, t } = useTranslation()
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const data = menuData[currentLang]

  const category = data.categories.find((c) => c.id === categoryId)

  if (!category) {
    return <NotFound />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SEO title={`${category.title} - ${data.title}`} />
      
      {/* Breadcrumb */}
      <nav className="mb-6 flex text-sm text-gray-500 dark:text-gray-400">
        <Link to="/menu" className="hover:text-starbucks-green hover:underline">
          {data.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-gray-800 dark:text-gray-200">{category.title}</span>
      </nav>

      <div className="mb-10">
        <h1 className="mb-4 text-4xl font-bold text-foreground-light dark:text-foreground-dark">
          {category.title}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
          {category.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.items && category.items.map((item: any, index: number) => (
          <Link to={item.href} key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-xl dark:bg-zinc-900 dark:ring-zinc-800"
            >
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-foreground-light group-hover:text-starbucks-green dark:text-foreground-dark dark:group-hover:text-starbucks-light transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
