import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout'

// Lazy load pages for performance optimization
import { 
  HomePage, 
  MenuPage, 
  MenuCategoryPage, 
  MenuItemPage, 
  DeliveryPage, 
  AboutUsPage, 
  SustainabilityPage, 
  MiddleEastPage, 
  LocationsPage, 
  TermsOfUsePage, 
  PrivacyStatementPage, 
  ContactUsPage, 
  CookieNoticePage, 
  GenericPage, 
  NotFound 
} from './pages'

import { Skeleton } from './components/ui'

// Premium Skeleton loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-white dark:bg-black">
    {/* Hero Skeleton */}
    <div className="h-[350px] lg:h-[450px] w-full bg-gray-50 dark:bg-zinc-950 flex flex-col lg:flex-row border-b border-gray-100 dark:border-zinc-800">
      <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center space-y-8">
        <Skeleton className="h-14 w-3/4 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full rounded-lg" />
          <Skeleton className="h-6 w-5/6 rounded-lg" />
          <Skeleton className="h-6 w-2/3 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-48 rounded-full" />
      </div>
      <div className="hidden lg:block flex-1 bg-gray-100 dark:bg-zinc-900 animate-pulse" />
    </div>

    {/* Content Area Skeleton */}
    <div className="container mx-auto max-w-4xl px-6 py-20 space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
      </div>
    </div>
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
