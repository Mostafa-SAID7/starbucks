import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Menu as MenuIcon, 
  X,
  Search,
  Moon, 
  Sun 
} from 'lucide-react'
import { toast } from 'sonner'
import Logo from './Logo'
import SearchModal from './SearchModal'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

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
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all duration-500">
        <div className="container mx-auto flex h-20 lg:h-24 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Left Side: Language, Locations, Search */}
          <div className="flex items-center gap-2 lg:gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 font-bold text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-10 px-4"
            >
              <span className="text-sm font-black tracking-tighter">
                {i18n.language === 'ar' ? 'EN' : 'AR'}
              </span>
            </Button>

            <NavLink 
              to="/locations"
              className={({ isActive }) => `group hidden items-center gap-2 text-sm font-bold lg:flex transition-all ${
                isActive ? 'text-starbucks-green' : 'text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span className="hidden xl:inline">{t('common.locations')}</span>
            </NavLink>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="text-starbucks-dark dark:text-foreground-dark rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Center: Nav Items (Desktop) */}
          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `
                  relative flex h-full items-center text-[13px] font-extrabold uppercase tracking-[0.15em] transition-all py-1
                  ${isActive 
                    ? 'text-starbucks-green' 
                    : 'text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark'
                  }
                `}
              >
                {item.label}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-starbucks-green"
                  />
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Side: Logo and Theme/Mobile Menu */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full lg:flex"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.div>
            </Button>

            <Link to="/" className="flex-shrink-0 lg:ml-8">
              <Logo className="h-10 lg:h-14 w-auto aspect-square object-contain hover:scale-110 transition-transform active:scale-95" />
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-starbucks-dark dark:text-foreground-dark rounded-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden border-t bg-white dark:bg-zinc-950 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => `
                        text-2xl font-black uppercase tracking-wider
                        ${isActive ? 'text-starbucks-green' : 'text-starbucks-dark dark:text-white'}
                      `}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 pt-8 border-t dark:border-zinc-800 flex items-center justify-between"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="flex items-center gap-3 text-lg font-bold text-starbucks-dark dark:text-white"
                  >
                    {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>

                  <NavLink to="/locations" className="flex items-center gap-2 text-starbucks-green font-bold text-lg">
                    <MapPin className="h-6 w-6" />
                    {t('common.locations')}
                  </NavLink>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
