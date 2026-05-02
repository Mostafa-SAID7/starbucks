import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from './ui/button'
import { 
  MapPin, 
  Menu, 
  Globe, 
  Moon, 
  Sun 
} from 'lucide-react'
import { toast } from 'sonner'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(newLang)
    toast.success(t('common.language_changed'))
  }

  const navItems = [
    { label: t('navbar.menu'), href: '/menu' },
    { label: t('navbar.delivery'), href: '/delivery' },
    { label: t('navbar.sustainability'), href: '/social-impact-sustainability' },
    { label: t('navbar.middle_east'), href: '/starbucks-middle-east' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-black/80 transition-colors">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo and Nav Items */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex-shrink-0">
            <img 
              src="https://www.starbucks.eg/assets/app/icons/icon-192x192.png" 
              alt="Starbucks" 
              className="h-12 w-12 hover:scale-105 transition-transform"
            />
          </Link>
          
          <div className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-bold uppercase tracking-widest text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 lg:flex">
            <Link 
              to="/locations" 
              className="flex items-center gap-2 text-sm font-bold text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark transition-colors"
            >
              <MapPin className="h-5 w-5" />
              {t('common.locations')}
            </Link>
            
            <div className="flex items-center gap-3 border-r dark:border-gray-800 pr-6 mr-2 transition-colors">
              <Link to="/signin">
                <Button variant="outline" size="sm" className="font-bold border-2 rounded-full px-6 hover:bg-starbucks-green hover:border-starbucks-green hover:text-white transition-all">
                  {t('common.sign_in')}
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="font-bold bg-black text-white rounded-full px-6 hover:bg-gray-800 transition-all">
                  {t('common.join_now')}
                </Button>
              </Link>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 font-bold text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Globe className="h-5 w-5" />
            <span className="min-w-[40px]">{t('common.language')}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
