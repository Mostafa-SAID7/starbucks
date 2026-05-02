import HeroBanner from '../components/HeroBanner'
import StatementSection from '../components/StatementSection'
import FeaturedCards from '../components/FeaturedCards'
import SEO from '../components/SEO'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <SEO title="الصفحة الرئيسية" />
      <HeroBanner />
      <StatementSection />
      <FeaturedCards />
    </div>
  )
}
