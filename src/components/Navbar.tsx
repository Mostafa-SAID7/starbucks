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
import Logo from './Logo'

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
    <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-black transition-colors">
      <div className="container mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Left Side: Language, Locations, Search */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 font-bold text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <span className="text-sm font-bold uppercase tracking-wider">{i18n.language === 'ar' ? 'English' : 'AR'}</span>
          </Button>

          <Link 
            to="/locations"
            className="group hidden items-center gap-2 text-sm font-bold text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark lg:flex transition-all"
          >
            <MapPin className="h-5 w-5" />
            <span className="hidden xl:inline">{t('common.locations')}</span>
          </Link>

          <Button variant="ghost" size="icon" className="text-starbucks-dark dark:text-foreground-dark rounded-full">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </Button>
        </div>

        {/* Center: Nav Items */}
        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side: Logo and Theme/Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full lg:flex"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link to="/" className="flex-shrink-0 lg:ml-8">
            <Logo className="h-14 w-14 hover:scale-105 transition-transform" />
          </Link>

          <Button variant="ghost" size="icon" className="lg:hidden text-starbucks-dark dark:text-foreground-dark">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
