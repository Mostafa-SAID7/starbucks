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
import { navbar } from '../data'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const isRTL = lang === 'ar'
  const navData = (navbar as any)[lang]

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(newLang)
    toast.success(newLang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English')
  }

  const navItems = [
    { label: navData.menu, href: '/menu' },
    { label: navData.delivery, href: '/delivery' },
    { label: navData.sustainability, href: '/social-impact-sustainability' },
    { label: navData.middle_east, href: '/starbucks-middle-east' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl transition-all duration-500">
        <div className="container mx-auto flex h-20 lg:h-24 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Left Side: Language, Locations, Search */}
          <div className="flex items-center gap-2 lg:gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="group relative flex items-center gap-2 font-bold text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-11 px-5 transition-all overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={i18n.language}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-sm font-black tracking-tighter"
                >
                  {i18n.language === 'ar' ? 'EN' : 'AR'}
                </motion.span>
              </AnimatePresence>
              <div className="absolute inset-0 bg-starbucks-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <NavLink 
              to="/locations"
              className={({ isActive }) => `group hidden items-center gap-3 text-sm font-black lg:flex transition-all ${
                isActive ? 'text-starbucks-green' : 'text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark'
              }`}
            >
              <div className="relative p-2 rounded-full group-hover:bg-starbucks-green/10 transition-colors">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="hidden xl:inline uppercase tracking-widest">{navData.locations || (lang === 'ar' ? 'الفروع' : 'Locations')}</span>
            </NavLink>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="text-starbucks-dark dark:text-foreground-dark rounded-full h-11 w-11 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:scale-110 active:scale-95 transition-all"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Center: Nav Items (Desktop) */}
          <div className="hidden flex-1 items-center justify-center gap-10 lg:flex h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `
                  relative flex h-full items-center text-[13px] font-black uppercase tracking-[0.2em] transition-all py-1 group
                  ${isActive 
                    ? 'text-starbucks-green' 
                    : 'text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark'
                  }
                `}
              >
                <span className="relative z-10">{item.label}</span>
                {location.pathname === item.href ? (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-1.5 bg-starbucks-green rounded-t-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <div className="absolute bottom-0 left-1/2 right-1/2 h-1 bg-starbucks-green opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 transition-all duration-300 rounded-t-full" />
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Side: Logo and Theme/Mobile Menu */}
          <div className="flex items-center gap-3 lg:gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-11 w-11 lg:flex transition-all hover:scale-110 active:scale-95"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0, scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-starbucks-dark" />}
              </motion.div>
            </Button>

            <Link to="/" className="flex-shrink-0 lg:ml-4">
              <Logo className="h-10 lg:h-16 w-auto aspect-square object-contain hover:scale-110 transition-transform active:scale-95" />
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-starbucks-dark dark:text-foreground-dark rounded-full h-11 w-11 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xl"
            >
              <div className="container mx-auto px-8 py-12 flex flex-col gap-8">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring', damping: 20 }}
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => `
                        text-3xl font-black uppercase tracking-widest block py-2
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
                  transition={{ delay: 0.35 }}
                  className="mt-6 pt-10 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-6 justify-between"
                >
                  <Button
                    variant="outline"
                    onClick={toggleTheme}
                    className="flex items-center gap-4 text-lg font-bold text-starbucks-dark dark:text-white rounded-full px-8 py-6 w-full sm:w-auto border-2 border-gray-100 dark:border-zinc-800"
                  >
                    <motion.div
                      animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                    >
                      {theme === 'dark' ? <Sun className="h-6 w-6 text-amber-400" /> : <Moon className="h-6 w-6" />}
                    </motion.div>
                    {theme === 'dark' ? (lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
                  </Button>

                  <NavLink to="/locations" className="flex items-center gap-3 text-starbucks-green font-black text-xl uppercase tracking-wider group">
                    <div className="p-3 rounded-full bg-starbucks-green/10 group-hover:bg-starbucks-green group-hover:text-white transition-all">
                      <MapPin className="h-6 w-6" />
                    </div>
                    {lang === 'ar' ? 'الفروع' : 'Locations'}
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
