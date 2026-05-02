import Navbar from './components/Navbar'
import HeroBanner from './components/HeroBanner'
import StatementSection from './components/StatementSection'
import FeaturedCards from './components/FeaturedCards'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors scrollbar-custom">
      <Navbar />
      <main>
        <HeroBanner />
        <StatementSection />
        <FeaturedCards />
      </main>
      <Footer />
    </div>
  )
}

export default App
