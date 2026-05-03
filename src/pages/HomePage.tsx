import { HeroBanner, StatementSection, FeaturedCards, SEO } from '../components'

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
