import { useState } from 'react'
import { Menu, MapPin, ShoppingCart, User, Moon, Sun } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import navbarData from '@/data/navbar.json'
import type { NavbarData } from '@/types'

const data: NavbarData = navbarData

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full bg-card-light dark:bg-card-dark shadow-sm border-b border-border-light dark:border-border-dark transition-colors">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="h-12 w-12"
            >
              <circle cx="32" cy="32" r="31" fill="#006241" />
              <path
                fill="#fff"
                d="M32 14c1.5 0 2.8.2 3.1.3.2 0 .2-.1.1-.2l-3.2-2.4-3.2 2.4c-.1.1-.1.2.1.2h.1c.4-.1 1.6-.3 3-.3m-2.4 15.8c0-.2.2-.2.2-.2s.8.2 2.2.2c1.4 0 2.2-.2 2.2-.2s.2.1.2.2c-.2.1-.3.3-.5.5-.4.5-1 1.1-1.9 1.1-1 0-1.5-.6-1.9-1.1-.2-.2-.4-.4-.5-.5m2-2.2c.1 0 .2.1.4.1s.3 0 .4-.1c.1 0 .2 0 .3-.1.2 0 .7.2.8.4 0 .1 0 .2-.1.2-.2 0-.4.1-.6.2-.2.1-.5.2-.8.2s-.6-.1-.8-.2c-.2-.1-.4-.1-.6-.2 0-.1 0-.2-.1-.2.1-.2.6-.4.8-.4.1 0 .2 0 .3.1"
              />
            </svg>
          </a>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">
            {data.menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-base font-semibold text-foreground-light dark:text-foreground-dark transition-colors hover:text-starbucks-green"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={data.actions.location}
            >
              <MapPin className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={data.actions.cart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              {data.actions.login}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-card-light dark:bg-card-dark">
              <SheetHeader>
                <SheetTitle className="text-right text-2xl font-bold text-foreground-light dark:text-foreground-dark">
                  القائمة
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {data.menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-right text-lg font-semibold text-foreground-light dark:text-foreground-dark transition-colors hover:text-starbucks-green"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <hr className="my-4 border-border-light dark:border-border-dark" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-full justify-start gap-2"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4" />
                      الوضع الداكن
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      الوضع الفاتح
                    </>
                  )}
                </Button>
                <Button variant="default" className="w-full">
                  <User className="h-4 w-4" />
                  {data.actions.login}
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4" />
                  {data.actions.findStore}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
