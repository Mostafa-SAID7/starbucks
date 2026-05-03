import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MainLayout from './layouts/MainLayout'

// Lazy load pages for performance optimization
const HomePage = lazy(() => import('./pages/HomePage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const DeliveryPage = lazy(() => import('./pages/DeliveryPage'))
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'))
const SustainabilityPage = lazy(() => import('./pages/SustainabilityPage'))
const MiddleEastPage = lazy(() => import('./pages/MiddleEastPage'))
const LocationsPage = lazy(() => import('./pages/LocationsPage'))
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'))
const PrivacyStatementPage = lazy(() => import('./pages/PrivacyStatementPage'))
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'))
const CookieNoticePage = lazy(() => import('./pages/CookieNoticePage'))
const GenericPage = lazy(() => import('./pages/GenericPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Simple loading fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-starbucks-green border-t-transparent"></div>
  </div>
)

// Helper component to sync document direction with language
const LanguageDirectionHandler = () => {
  const { i18n } = useTranslation()
  
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return null
}

function App() {
  return (
    <Router>
      <LanguageDirectionHandler />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="locations" element={<LocationsPage />} />
            
            {/* Informational Pages */}
            <Route path="delivery" element={<DeliveryPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="social-impact-sustainability" element={<SustainabilityPage />} />
            <Route path="privacy-statement" element={<PrivacyStatementPage />} />
            <Route path="terms-of-use" element={<TermsOfUsePage />} />
            <Route path="our-coffees" element={<GenericPage />} />
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="cookie-notice" element={<CookieNoticePage />} />
            <Route path="starbucks-middle-east" element={<MiddleEastPage />} />
            <Route path="starbucks-for-the-record" element={<GenericPage />} />
            <Route path="community-impact-starbucks" element={<GenericPage />} />
            <Route path="new-era-same-icons" element={<GenericPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
