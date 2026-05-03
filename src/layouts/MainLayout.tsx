import { Outlet } from 'react-router-dom'
import { Navbar, Footer, MobileTabBar, CookieConsent, Toaster, ChatWidget, ScrollToTop } from '../components'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background-light text-foreground-light transition-colors dark:bg-background-dark dark:text-foreground-dark">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
      <CookieConsent />
      <Toaster />
      <ChatWidget />
      <ScrollToTop />
    </div>
  )
}
