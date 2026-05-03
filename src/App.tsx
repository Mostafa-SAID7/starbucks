import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout'

// Lazy load pages for performance optimization
const HomePage = lazy(() => import('./pages/HomePage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const MenuCategoryPage = lazy(() => import('./pages/MenuCategoryPage'))
const MenuItemPage = lazy(() => import('./pages/MenuItemPage'))
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

// Page Wrapper for transitions
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
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

const AnimatedRoutes = () => {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="menu" element={<PageWrapper><MenuPage /></PageWrapper>} />
          <Route path="menu/:categoryId" element={<PageWrapper><MenuCategoryPage /></PageWrapper>} />
          <Route path="menu/:categoryId/:itemId" element={<PageWrapper><MenuItemPage /></PageWrapper>} />
          <Route path="locations" element={<PageWrapper><LocationsPage /></PageWrapper>} />
          
          {/* Informational Pages */}
          <Route path="delivery" element={<PageWrapper><DeliveryPage /></PageWrapper>} />
          <Route path="about-us" element={<PageWrapper><AboutUsPage /></PageWrapper>} />
          <Route path="social-impact-sustainability" element={<PageWrapper><SustainabilityPage /></PageWrapper>} />
          <Route path="privacy-statement" element={<PageWrapper><PrivacyStatementPage /></PageWrapper>} />
          <Route path="terms-of-use" element={<PageWrapper><TermsOfUsePage /></PageWrapper>} />
          <Route path="our-coffees" element={<PageWrapper><GenericPage /></PageWrapper>} />
          <Route path="contact-us" element={<PageWrapper><ContactUsPage /></PageWrapper>} />
          <Route path="cookie-notice" element={<PageWrapper><CookieNoticePage /></PageWrapper>} />
          <Route path="starbucks-middle-east" element={<PageWrapper><MiddleEastPage /></PageWrapper>} />
          <Route path="starbucks-for-the-record" element={<PageWrapper><GenericPage /></PageWrapper>} />
          <Route path="community-impact-starbucks" element={<PageWrapper><GenericPage /></PageWrapper>} />
          <Route path="new-era-same-icons" element={<PageWrapper><GenericPage /></PageWrapper>} />
          
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <LanguageDirectionHandler />
      <Suspense fallback={<PageLoader />}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  )
}

export default App
