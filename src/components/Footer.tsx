import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import data from '../data/footer.json'

export default function Footer() {
  const { t } = useTranslation()

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  }

  return (
    <footer className="bg-white pt-16 pb-32 dark:bg-black border-t dark:border-gray-800 transition-colors">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 border-b pb-12 lg:grid-cols-4 dark:border-gray-800 transition-colors">
          {data.sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-6 text-lg font-bold text-starbucks-dark dark:text-foreground-dark uppercase tracking-wider">
                {t(section.title)}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-base text-gray-500 hover:text-starbucks-dark dark:hover:text-foreground-dark transition-colors"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Location Selector (Desktop/Mobile) */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-starbucks-dark dark:text-foreground-dark uppercase tracking-wider">
              {t('footer.location_selector')}
            </h3>
            <div className="group relative">
              <button className="flex items-center gap-3 text-base text-gray-500 hover:text-starbucks-dark dark:hover:text-foreground-dark transition-colors">
                <Globe className="h-5 w-5" />
                <span>{t('footer.location_selector')}</span>
              </button>
              
              <div className="invisible absolute bottom-full left-0 z-50 mb-4 h-64 w-64 overflow-y-auto rounded-xl border bg-white p-4 shadow-2xl group-hover:visible dark:bg-black dark:border-gray-800">
                <ul className="space-y-3">
                  {data.countries.map((country) => (
                    <li key={country.name}>
                      <a
                        href={country.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-gray-500 hover:text-starbucks-green dark:hover:text-starbucks-green transition-colors"
                      >
                        {country.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 py-12 lg:flex-row">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {data.socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-starbucks-dark text-white hover:bg-gray-800 transition-colors"
              >
                {socialIcons[social.name]}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-end">
            {data.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-bold text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark transition-colors"
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 lg:text-left">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}
