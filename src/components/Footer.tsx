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
    <footer className="bg-starbucks-dark pt-20 pb-10 text-white transition-colors">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 lg:grid-cols-4 transition-colors">
          {data.sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-8 text-lg font-extrabold uppercase tracking-widest text-white">
                {t(section.title)}
              </h3>
              <ul className="space-y-6">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-base text-gray-300 hover:text-white transition-colors"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Location Selector */}
          <div>
            <h3 className="mb-8 text-lg font-extrabold uppercase tracking-widest text-white">
              {t('footer.location_selector')}
            </h3>
            <div className="group relative inline-block">
              <button className="flex items-center gap-3 text-base text-gray-300 hover:text-white transition-colors cursor-pointer py-2">
                <Globe className="h-5 w-5 text-starbucks-green" />
                <span className="font-bold underline decoration-white/20 underline-offset-8 group-hover:decoration-starbucks-green transition-all">
                  {t('footer.location_selector')}
                </span>
              </button>
              
              <div className="invisible absolute bottom-[calc(100%+12px)] left-0 z-50 w-80 rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl transition-all opacity-0 scale-95 origin-bottom group-hover:visible group-hover:opacity-100 group-hover:scale-100 overflow-hidden">
                <div className="h-[300px] overflow-y-auto scrollbar-thin rtl">
                  <div className="p-5 pl-6 pr-6">
                    <div className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                      {t('footer.select_region', 'Select Region')}
                    </div>
                    <ul className="space-y-1">
                      {data.countries.map((country) => (
                        <li key={country.name}>
                          <a
                            href={country.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-starbucks-green transition-all"
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
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-12 py-16 lg:flex-row">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {data.socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-starbucks-green transition-all hover:scale-110 shadow-xl"
              >
                {socialIcons[social.name]}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 lg:justify-end">
            {data.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center text-[13px] text-gray-500">
          <p>© {new Date().getFullYear()} Starbucks Coffee Company. {t('footer.all_rights_reserved', 'جميع الحقوق محفوظة.')}</p>
        </div>
      </div>
    </footer>
  )
}
