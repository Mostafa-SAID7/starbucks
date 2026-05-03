import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileTabBar from '../components/MobileTabBar'
import CookieConsent from '../components/CookieConsent'
import { Toaster } from 'sonner'

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
      <Toaster position="top-center" expand={true} richColors />
    </div>
  )
}
