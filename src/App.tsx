import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

// Layout & Components
import { MainLayout, SkipNav } from '@/components'
import { ANIMATIONS } from '@/constants'
import { 
  HomeSkeleton, 
  MenuSkeleton, 
  StaticPageSkeleton, 
  ContactSkeleton 
} from '@/components/skeletons'

// Lazy loaded Pages for performance
const HomePage = lazy(() => import('@/pages/HomePage'))
const MenuCategoryPage = lazy(() => import('@/pages/MenuCategoryPage'))
const MenuItemPage = lazy(() => import('@/pages/MenuItemPage'))
const DeliveryPage = lazy(() => import('@/pages/DeliveryPage'))
const AboutUsPage = lazy(() => import('@/pages/AboutUsPage'))
const SustainabilityPage = lazy(() => import('@/pages/SustainabilityPage'))
const LocationsPage = lazy(() => import('@/pages/LocationsPage'))
const TermsOfUsePage = lazy(() => import('@/pages/TermsOfUsePage'))
const PrivacyStatementPage = lazy(() => import('@/pages/PrivacyStatementPage'))
const ContactUsPage = lazy(() => import('@/pages/ContactUsPage'))
const CookieNoticePage = lazy(() => import('@/pages/CookieNoticePage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Page Wrapper for transitions using centralized constants and specific skeletons
const PageWrapper = ({ children, skeleton }: { children: React.ReactNode, skeleton?: React.ReactNode }) => (
  <motion.div
    initial={ANIMATIONS.fadeInUp.initial}
    animate={ANIMATIONS.fadeInUp.animate}
    exit={{ opacity: 0, y: -10 }}
    transition={ANIMATIONS.fadeInUp.transition}
  >
    <Suspense fallback={skeleton || <div className="min-h-screen bg-white dark:bg-black" />}>
      {children}
    </Suspense>
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
          <Route index element={<PageWrapper skeleton={<HomeSkeleton />}><HomePage /></PageWrapper>} />
          <Route path="menu/:categoryId" element={<PageWrapper skeleton={<MenuSkeleton />}><MenuCategoryPage /></PageWrapper>} />
          <Route path="menu/:categoryId/:itemId" element={<PageWrapper skeleton={<MenuSkeleton />}><MenuItemPage /></PageWrapper>} />
          <Route path="locations" element={<PageWrapper skeleton={<StaticPageSkeleton />}><LocationsPage /></PageWrapper>} />
          
          {/* Redirects to prevent 404s on generic sections */}
          <Route path="menu" element={<Navigate to="/menu/drinks" replace />} />
          <Route path="our-coffees" element={<Navigate to="/menu/drinks" replace />} />
          <Route path="starbucks-middle-east" element={<Navigate to="/about-us" replace />} />
          <Route path="account" element={<Navigate to="/" replace />} />
          
          {/* Informational Pages */}
          <Route path="delivery" element={<PageWrapper skeleton={<StaticPageSkeleton />}><DeliveryPage /></PageWrapper>} />
          <Route path="about-us" element={<PageWrapper skeleton={<StaticPageSkeleton />}><AboutUsPage /></PageWrapper>} />
          <Route path="social-impact-sustainability" element={<PageWrapper skeleton={<StaticPageSkeleton />}><SustainabilityPage /></PageWrapper>} />
          <Route path="privacy-statement" element={<PageWrapper skeleton={<StaticPageSkeleton />}><PrivacyStatementPage /></PageWrapper>} />
          <Route path="terms-of-use" element={<PageWrapper skeleton={<StaticPageSkeleton />}><TermsOfUsePage /></PageWrapper>} />
          <Route path="contact-us" element={<PageWrapper skeleton={<ContactSkeleton />}><ContactUsPage /></PageWrapper>} />
          <Route path="cookie-notice" element={<PageWrapper skeleton={<StaticPageSkeleton />}><CookieNoticePage /></PageWrapper>} />
          
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <SkipNav />
      <div id="main-content" />
      <LanguageDirectionHandler />
      <AnimatedRoutes />
    </Router>
  )
}

export default App