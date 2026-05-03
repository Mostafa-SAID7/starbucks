import { useTranslation } from 'react-i18next'
import { HeroBanner, StatementSection, FeaturedCards, SEO } from '../components'
import { pages } from '../data'

export default function HomePage() {
  const { i18n } = useTranslation()
  const pageData = (pages as any)['home'][i18n.language] || (pages as any)['home'].en

  return (
    <div className="flex flex-col">
      <SEO title={pageData.title} />
      <HeroBanner />
      <StatementSection />
      <FeaturedCards />
    </div>
  )
}
