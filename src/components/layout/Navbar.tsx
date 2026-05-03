import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Menu as MenuIcon, 
  X,
  Search,
  Moon, 
  Sun,
  User
} from 'lucide-react'
import { toast } from 'sonner'
import { Logo, Button, Tooltip } from '@/components/ui'
import { SearchModal } from '@/components'
import { AuthModal } from '@/components'
import { navbar } from '@/data'

export function Navbar() {
  const { i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const location = useLocation()
  
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const isRTL = lang === 'ar'
  const navData = navbar[lang]

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setTimeout(() => setIsMobileMenuOpen(false), 0)
    }
  }, [location.pathname, isMobileMenuOpen])

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
          {/* Left Side: Logo & Nav Items */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link to="/" className="flex-shrink-0">
              <Logo className="h-10 lg:h-12 w-auto aspect-square object-contain hover:scale-110 transition-transform active:scale-95" />
            </Link>

            {/* Nav Items (Desktop) */}
            <div className="hidden items-center gap-8 lg:flex h-full">
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
                      className="absolute -bottom-6 left-0 right-0 h-1 bg-starbucks-green rounded-t-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <div className="absolute -bottom-6 left-1/2 right-1/2 h-1 bg-starbucks-green opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 transition-all duration-300 rounded-t-full" />
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side: Utilities (Search, Location, Language, Theme, Profile) */}
          <div className="flex items-center gap-2 lg:gap-3">
            <Tooltip content={lang === 'ar' ? 'الفروع' : 'Find a store'}>
              <NavLink 
                to="/locations"
                className={({ isActive }) => `group flex items-center justify-center h-11 w-11 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all ${
                  isActive ? 'text-starbucks-green' : 'text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark'
                }`}
              >
                <MapPin className="h-5 w-5" />
              </NavLink>
            </Tooltip>

            <Tooltip content={lang === 'ar' ? 'بحث' : 'Search'}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="text-starbucks-dark dark:text-foreground-dark rounded-full h-11 w-11 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:scale-110 active:scale-95 transition-all"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Tooltip>

            <div className="hidden lg:flex items-center gap-3">
              <Tooltip content={lang === 'ar' ? 'تغيير اللغة' : 'Change Language'}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="group relative flex items-center gap-2 font-bold text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-11 px-4 transition-all"
                >
                  <span className="text-sm font-black uppercase tracking-tighter">
                    {i18n.language === 'ar' ? 'EN' : 'AR'}
                  </span>
                </Button>
              </Tooltip>

              <Tooltip content={theme === 'dark' ? (lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-11 w-11 transition-all hover:scale-110 active:scale-95"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  >
                    {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
                  </motion.div>
                </Button>
              </Tooltip>

              <Tooltip content={lang === 'ar' ? 'الحساب' : 'Account'}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAuthOpen(true)}
                  className="text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-11 w-11 transition-all hover:scale-110 active:scale-95 border-2 border-transparent hover:border-starbucks-green/20"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Tooltip>
            </div>

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
              className="lg:hidden border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto max-h-[calc(100vh-5rem)] lg:max-h-[calc(100vh-6rem)] shadow-2xl scrollbar-hide"
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
                  <div className="flex flex-col gap-4 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={toggleTheme}
                      className="flex items-center gap-4 text-lg font-bold text-starbucks-dark dark:text-white rounded-full px-8 py-6 w-full border-2 border-gray-100 dark:border-zinc-800"
                    >
                      <motion.div animate={{ rotate: theme === 'dark' ? 180 : 0 }}>
                        {theme === 'dark' ? <Sun className="h-6 w-6 text-amber-400" /> : <Moon className="h-6 w-6" />}
                      </motion.div>
                      {theme === 'dark' ? (lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={toggleLanguage}
                      className="flex items-center gap-4 text-lg font-bold text-starbucks-dark dark:text-white rounded-full px-8 py-6 w-full border-2 border-gray-100 dark:border-zinc-800"
                    >
                      <span className="text-xl font-black">{lang === 'ar' ? 'EN' : 'AR'}</span>
                      {lang === 'ar' ? 'English' : 'العربية'}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsAuthOpen(true)
                      }}
                      className="flex items-center gap-4 text-lg font-bold text-starbucks-dark dark:text-white rounded-full px-8 py-6 w-full border-2 border-gray-100 dark:border-zinc-800"
                    >
                      <User className="h-6 w-6" />
                      {lang === 'ar' ? 'الحساب' : 'Account'}
                    </Button>
                  </div>

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
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}
