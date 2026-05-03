import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SEO, InnerHeader, Logo } from '../components'
import { termsOfUse as data } from '../data'

const TermsOfUsePage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.title[lang]} />

      <InnerHeader
        title={data.header[lang]}
        variant="light"
      />

      <div className="container mx-auto max-w-6xl px-6 py-14 lg:px-10">
        <div className={`flex flex-col gap-10 ${isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

          {/* ─── Sidebar ─── */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="bg-starbucks-green p-4 text-center">
                <Logo className="mx-auto h-16 w-16 object-contain mb-2" />
              </div>
              <div className="bg-gray-50 dark:bg-zinc-900 p-4 space-y-3">
                <a
                  href={data.sidebar.links.menu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-starbucks-green py-3 text-center text-sm font-extrabold text-white hover:bg-starbucks-dark transition-all"
                >
                  {data.sidebar.menu[lang]}
                </a>
                <a
                  href={data.sidebar.links.about}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full border-2 border-starbucks-dark py-3 text-center text-sm font-extrabold text-starbucks-dark dark:border-white dark:text-white hover:bg-starbucks-dark hover:text-white transition-all"
                >
                  {data.sidebar.about[lang]}
                </a>
              </div>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex-1 ${isRTL ? 'text-right' : 'text-left'} leading-relaxed text-gray-700 dark:text-gray-300 space-y-8`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {data.sections.map((section) => (
              <Section key={section.id} title={section.title[lang]} isRTL={isRTL}>
                {section.paragraphs?.map((p: any, idx: number) => (
                  <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                    {p[lang]}
                  </p>
                ))}
                
                {section.list && (
                  <ul className={`mt-3 space-y-2 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                    {section.list.map((item: any, i: number) => (
                      <li key={i} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                        <span>{item[lang]}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.contactInfo && (
                  <div className={`space-y-1 text-starbucks-green font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p dir="ltr">
                      <a href={`mailto:${section.contactInfo.email}`} className="hover:underline">{section.contactInfo.email}</a>
                    </p>
                    <p dir="ltr">
                      <a href={`tel:${section.contactInfo.phoneTel}`} className="hover:underline">{section.contactInfo.phone}</a>
                    </p>
                  </div>
                )}
              </Section>
            ))}
          </motion.article>

        </div>
      </div>
    </div>
  )
}

function Section({ title, children, isRTL }: { title: string; children: React.ReactNode; isRTL: boolean }) {
  return (
    <div className="space-y-3">
      <h2 className={`text-lg font-extrabold text-starbucks-dark dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export default TermsOfUsePage
