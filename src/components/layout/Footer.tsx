import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { footer as data } from '@/data'

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const footerData = data[lang]

  const socialIcons: Record<string, React.ReactNode> = {
    spotify: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.306c-.215.352-.676.463-1.028.248-2.856-1.745-6.452-2.14-10.686-1.171-.403.093-.812-.154-.905-.557-.093-.404.154-.813.557-.906 1.805-1.059 8.618-.604 11.804 1.341.352.439.581.844.311 1.282zM1.468-3.26c-.27.439-.844.582-1.282.311-3.268-2.009-8.25-2.593-11.645-1.42-.496.151-1.022-.128-1.173-.625-.152-.496.128-1.022.625-1.173.496 4.305-1.306 11.438-.051 15.945 1.625.539.32.713 1.014.394 1.554zm.127-3.418c-.27.439-.844.582-1.282.311-3.918-2.327-10.375-2.541-14.135-1.399-.6.182-1.235-.164-1.417-.765-.183-.601.164-1.236.765-1.418 4.305-1.306 11.438-.051 15.945 1.625.539.32.713 1.014.394 1.554z"/>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    pinterest: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283.949.599 1.369 2.239 1.369 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.36 31.493 1.296 1.312 2.25.062 2.594z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12.525.02c1.31 0 2.59.34 3.72 1a6.49 6.49 0 0 1 3.57 5.1c0 .02 0 .04 0 .06a6.49 6.49 0 0 0-3.15-1.55v7.2a4.91 4.91 0 0 1-4.91 4.91 4.91 4.91 0 0 1-4.91-4.91 4.91 4.91 0 0 1 4.91-4.91c.21 0 .41.01.62.04v2.54a2.41 2.41 0 0 0-.62-.08 2.37 2.37 0 1 0 2.37 2.37v-12c0-.02 0-.04 0-.06.01-1.07.72-2.01 1.75-2.28a2.38 2.38 0 0 1 1.65.57 6.49 6.49 0 0 0 3.15 1.55c0-.2 0-.41 0-.62 0-1.33-.42-2.61-1.2-3.69A6.49 6.49 0 0 0 16.245.02h-3.72z"/>
      </svg>
    )
  }

  return (
    <footer className="bg-starbucks-dark pt-16 pb-12 text-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 lg:grid-cols-4">
          {footerData.sections.map((section: FooterSection) => (
            <div key={section.title}>
              <h3 className="mb-6 text-lg font-extrabold uppercase tracking-widest text-white">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link: FooterLink) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-base text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Location Selector */}
          <div>
            <h3 className="mb-6 text-lg font-extrabold uppercase tracking-widest text-white">
              {footerData.locationSelector}
            </h3>
            <div className="group relative inline-block">
              <button className="flex items-center gap-3 text-base text-gray-400 hover:text-white transition-colors cursor-pointer py-2">
                <Globe className="h-5 w-5 text-starbucks-green" />
                <span className="font-bold underline decoration-white/20 underline-offset-8 group-hover:decoration-starbucks-green transition-all">
                  {footerData.locationSelector}
                </span>
                <svg className="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="invisible absolute bottom-[calc(100%+12px)] inset-inline-start-0 z-50 w-80 rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl transition-all opacity-0 scale-95 origin-bottom-start group-hover:visible group-hover:opacity-100 group-hover:scale-100 overflow-hidden">
                <div className="h-[300px] overflow-y-auto scrollbar-thin rtl">
                  <div className="p-5 px-6">
                    <div className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                      {footerData.selectRegion}
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

        {/* Bottom Section: Socials, Legal and App */}
        <div className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              {footerData.legal.map((link: FooterLink) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-base font-bold text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              {data.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
                >
                  {socialIcons[social.name]}
                </a>
              ))}
            </div>
          </div>

          {/* App Download Card */}
          <div className="flex justify-end lg:justify-end">
            <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
              <h4 className="mb-3 text-xl font-extrabold text-white">
                {footerData.app.title}
              </h4>
              <p className="mb-8 text-base text-gray-400">
                {footerData.app.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="flex h-12 items-center gap-3 rounded-lg border border-white/20 bg-black px-5 transition-all hover:bg-white/5"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.4-.18-.84-.28-1.29-.28s-.9.1-1.3.28c-1.01.47-2.02.51-2.95-.42C5.9 17.78 4.28 12.35 6.8 7.9c1.23-2.17 3.4-3.4 5.6-3.4 1.1 0 2.15.25 3 .75.65.35 1.25.35 1.9 0 .95-.5 2-.8 3.1-.75 1.55.05 2.85.7 3.65 1.85-3.35 1.95-2.8 6.35.55 7.8-.8 2-1.95 3.95-5.13-.55 7.13zM12 4.45c0-2.3 1.9-4.2 4.2-4.2.1 0 .2 0 .3.05.1 2.3-1.8 4.2-1.8 4.2-.1 0-.2 0-.3-.05z"/>
                  </svg>
                  <div className="text-start">
                    <div className="text-[10px] uppercase leading-none text-gray-400">{footerData.app.appStore.split(' ')[0]}</div>
                    <div className="text-sm font-bold leading-tight">{footerData.app.appStore.split(' ').slice(1).join(' ')}</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex h-12 items-center gap-3 rounded-lg border border-white/20 bg-black px-5 transition-all hover:bg-white/5"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.41-.814V2.628c0-.34.17-.65.41-.814zm11.233 11.233l2.84 2.84L5.672 21.01l9.17-7.963zm2.84-2.84l-2.84 2.84 9.17 7.963L5.672 2.99 3.609 1.814 13.792 12zM14.842 12l-1.05-1.05 4.95-2.115 1.874 1.874a.996.996 0 0 1 0 1.414l-1.874 1.874-3.9-3z"/>
                  </svg>
                  <div className="text-start">
                    <div className="text-[10px] uppercase leading-none text-gray-400">{footerData.app.googlePlay.split(' ').slice(0, 2).join(' ')}</div>
                    <div className="text-sm font-bold leading-tight">{footerData.app.googlePlay.split(' ').slice(2).join(' ')}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 text-start text-[13px] text-gray-500 border-t border-white/10">
          <p>© {new Date().getFullYear()} Starbucks Coffee Company. {footerData.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  )
}