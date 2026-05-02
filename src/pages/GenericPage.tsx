import React from 'react'
import { useParams, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import pagesData from '../data/pages.json'

interface PageContent {
  title: string
  content: string
}

interface PageData {
  ar: PageContent
  en: PageContent
}

const typedPagesData = pagesData as unknown as Record<string, PageData>

export default function GenericPage() {
  const { slug: paramSlug } = useParams<{ slug: string }>()
  const location = useLocation()
  
  // Determine slug from params or from current path
  const slug = paramSlug || location.pathname.split('/').pop() || ''
  
  const { i18n } = useTranslation()
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as keyof PageData

  if (!slug || !typedPagesData[slug]) {
    return <Navigate to="/404" replace />
  }

  const page = typedPagesData[slug][currentLang]

  return (
    <div className="min-h-screen bg-white py-20 dark:bg-black transition-colors">
      <SEO title={page.title} />
      
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-12 text-4xl font-extrabold text-starbucks-dark dark:text-foreground-dark lg:text-5xl">
          {page.title}
        </h1>
        
        <div 
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-starbucks-dark dark:prose-headings:text-foreground-dark prose-p:text-gray-600 dark:prose-p:text-gray-400"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  )
}
