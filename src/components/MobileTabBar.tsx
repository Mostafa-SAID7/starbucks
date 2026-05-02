import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, MapPin, ShoppingBag, User } from 'lucide-react'

export default function MobileTabBar() {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-border-light bg-card-light pb-safe shadow-md transition-colors dark:border-border-dark dark:bg-card-dark md:hidden">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center gap-1 w-full h-full ${
          location.pathname === '/' 
            ? 'text-starbucks-green dark:text-starbucks-light' 
            : 'text-gray-500 hover:text-starbucks-green dark:text-gray-400 dark:hover:text-starbucks-light'
        }`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs font-semibold">{t('common.home')}</span>
      </Link>

      <Link
        to="/menu"
        className={`flex flex-col items-center justify-center gap-1 w-full h-full ${
          location.pathname === '/menu' 
            ? 'text-starbucks-green dark:text-starbucks-light' 
            : 'text-gray-500 hover:text-starbucks-green dark:text-gray-400 dark:hover:text-starbucks-light'
        }`}
      >
        <ShoppingBag className="h-6 w-6" />
        <span className="text-xs font-semibold">{t('common.menu')}</span>
      </Link>
      
      <Link
        to="/locations"
        className={`flex flex-col items-center justify-center gap-1 w-full h-full ${
          location.pathname === '/locations' 
            ? 'text-starbucks-green dark:text-starbucks-light' 
            : 'text-gray-500 hover:text-starbucks-green dark:text-gray-400 dark:hover:text-starbucks-light'
        }`}
      >
        <MapPin className="h-6 w-6" />
        <span className="text-xs font-semibold">{t('common.locations')}</span>
      </Link>

      <Link
        to="/account"
        className={`flex flex-col items-center justify-center gap-1 w-full h-full ${
          location.pathname.startsWith('/account') 
            ? 'text-starbucks-green dark:text-starbucks-light' 
            : 'text-gray-500 hover:text-starbucks-green dark:text-gray-400 dark:hover:text-starbucks-light'
        }`}
      >
        <User className="h-6 w-6" />
        <span className="text-xs font-semibold">{t('common.account')}</span>
      </Link>
    </div>
  )
}
