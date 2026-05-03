import { useTranslation } from 'react-i18next'
import { Banner, StatementSection, FeaturedCards, SEO } from '../components'
import { pages } from '../data'

interface LocalizedContent {
  title: string
}

export default function HomePage() {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  
  // Safe access to home page data from pages.json
  const homeData = (pages as Record<string, Record<'ar' | 'en', LocalizedContent>>)['home']
  const pageData = homeData?.[lang] || { title: lang === 'ar' ? 'ستاربكس مصر' : 'Starbucks Egypt' }

  return (
    <div className="flex flex-col">
      <SEO title={pageData.title} />
      <Banner />
      <StatementSection />
      <FeaturedCards />
    </div>
  )
}
