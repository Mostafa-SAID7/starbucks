import React from 'react'
import { useParams, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SEO, Button, Header, Accordion } from '../components'
import pagesData from '../data/pages.json'

interface SectionItem {
  name?: string
  logo?: string
  question?: string
  answer?: string
}

interface Section {
  type: 'hero' | 'partners' | 'card' | 'faq' | 'content'
  title?: string
  subtitle?: string
  description?: string
  image?: string
  imageAlt?: string
  cta?: string
  ctaLink?: string
  items?: SectionItem[]
  content?: string
  reverse?: boolean
  bgColor?: string
}

interface PageContent {
  title: string
  content?: string
  sections?: Section[]
}

interface PageData {
  ar: PageContent
  en: PageContent
}

const typedPagesData = pagesData as unknown as Record<string, PageData>

export default function GenericPage() {
  const { slug: paramSlug } = useParams<{ slug: string }>()
  const location = useLocation()
  
  const slug = paramSlug || location.pathname.split('/').pop() || ''
  
  const { i18n } = useTranslation()
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as keyof PageData

  if (!slug || !typedPagesData[slug]) {
    return <Navigate to="/404" replace />
  }

  const page = typedPagesData[slug][currentLang]

  return (
    <div 
      key={`${slug}-${currentLang}`}
      className="min-h-screen bg-white dark:bg-black transition-colors"
    >
      <SEO title={page.title} />
      
      {page.sections ? (
        <div className="flex flex-col">
          {page.sections.map((section, idx) => (
            <PageSection key={idx} section={section} />
          ))}
        </div>
      ) : (
        <>
          <Header title={page.title} variant="dark" />
          <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-starbucks-dark dark:prose-headings:text-foreground-dark prose-p:text-gray-600 dark:prose-p:text-gray-400 text-center md:text-start"
              dangerouslySetInnerHTML={{ __html: page.content || '' }}
            />
          </div>
        </>
      )}
    </div>
  )
}

function PageSection({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero':
      return (
        <section className="relative overflow-hidden bg-[#f7f7f7] dark:bg-zinc-950 py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col-reverse items-center gap-12 lg:flex-row">
              <div className="flex-1 text-center md:text-start">
                <motion.h1 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mb-6 text-4xl font-extrabold text-starbucks-dark dark:text-white lg:text-6xl leading-tight"
                >
                  {section.title}
                </motion.h1>
                <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0"
                >
                  {section.description}
                </motion.p>
                {section.cta && (
                  <Button className="rounded-full bg-starbucks-green px-10 py-6 text-lg font-bold text-white hover:bg-starbucks-dark">
                    {section.cta}
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={section.image} 
                  alt={section.imageAlt} 
                  className="w-full max-w-xl mx-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      )

    case 'partners':
      return (
        <section className="py-16 md:py-24 border-b dark:border-zinc-800">
          <div className="container mx-auto px-6 text-center max-w-7xl">
            <h2 className="mb-12 text-3xl font-extrabold text-starbucks-dark dark:text-white">
              {section.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {section.items?.map((partner, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-4 shadow-xl dark:bg-zinc-800">
                    <img src={partner.logo} alt={partner.name} className="h-full w-full object-contain" />
                  </div>
                  <span className="font-bold dark:text-white">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'card':
      return (
        <section className={`py-16 md:py-24 ${section.bgColor || 'bg-white dark:bg-black'}`}>
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className={`flex flex-col items-center gap-12 lg:flex-row ${section.reverse ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <img src={section.image} alt={section.imageAlt} className="w-full rounded-3xl shadow-lg" />
              </div>
              <div className="flex-1 text-center md:text-start">
                <h2 className="mb-6 text-3xl font-extrabold text-starbucks-dark dark:text-white lg:text-4xl">
                  {section.title}
                </h2>
                <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                  {section.description}
                </p>
                {section.cta && (
                  <Button variant="outline" className="rounded-full border-2 border-starbucks-dark px-10 py-6 text-lg font-bold text-starbucks-dark hover:bg-starbucks-dark hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                    {section.cta}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )

    case 'faq':
      return (
        <section className="py-16 md:py-24 bg-[#f9f9f9] dark:bg-zinc-950">
          <div className="container mx-auto max-w-4xl px-6">
            <h2 className="mb-12 text-3xl font-black text-starbucks-dark dark:text-white text-center md:text-start">
              {section.title}
            </h2>
            <div className="mt-8">
              <Accordion 
                items={section.items?.map((item) => ({
                  title: item.question || '',
                  content: item.answer || ''
                })) || []} 
              />
            </div>
          </div>
        </section>
      )

    case 'content':
      return (
        <section className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-starbucks-dark dark:prose-headings:text-foreground-dark prose-p:text-gray-600 dark:prose-p:text-gray-400"
            dangerouslySetInnerHTML={{ __html: section.content || '' }}
          />
        </section>
      )

    default:
      return null
  }
}
