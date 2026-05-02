import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import footerData from '@/data/footer.json'
import type { FooterData } from '@/types'

const data: FooterData = footerData

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [showCountries, setShowCountries] = useState(false)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="bg-starbucks-dark text-white transition-colors">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Desktop Footer */}
        <div className="hidden grid-cols-4 gap-8 md:grid">
          {/* Logo */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="h-16 w-16"
            >
              <circle cx="32" cy="32" r="31" fill="#fff" />
              <path
                fill="#006241"
                d="M32 14c1.5 0 2.8.2 3.1.3.2 0 .2-.1.1-.2l-3.2-2.4-3.2 2.4c-.1.1-.1.2.1.2h.1c.4-.1 1.6-.3 3-.3m-2.4 15.8c0-.2.2-.2.2-.2s.8.2 2.2.2c1.4 0 2.2-.2 2.2-.2s.2.1.2.2c-.2.1-.3.3-.5.5-.4.5-1 1.1-1.9 1.1-1 0-1.5-.6-1.9-1.1-.2-.2-.4-.4-.5-.5"
              />
            </svg>
          </div>

          {/* Links Columns */}
          {Object.entries(data.sections).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Footer - Accordion */}
        <div className="space-y-4 md:hidden">
          {Object.entries(data.sections).map(([key, section]) => (
            <div key={key} className="border-b border-gray-600 pb-4">
              <button
                onClick={() => toggleSection(key)}
                className="flex w-full items-center justify-between text-right"
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSection === key ? 'rotate-180' : ''
                  }`}
                />
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </button>
              <AnimatePresence>
                {openSection === key && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="block text-right text-sm text-gray-300"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Country Selector */}
        <div className="mt-12 border-t border-gray-600 pt-8">
          <div className="relative">
            <button
              onClick={() => setShowCountries(!showCountries)}
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-gray-300"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showCountries ? 'rotate-180' : ''
                }`}
              />
              <span>{data.locationSelector}</span>
              <Globe className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showCountries && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-xl"
                >
                  <ul className="space-y-2">
                    {data.countries.map((country) => (
                      <li key={country}>
                        <a
                          href="#"
                          className="block rounded px-3 py-2 text-right text-sm text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {country}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-600 pt-6 text-center text-xs text-gray-400">
          <p>{data.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
