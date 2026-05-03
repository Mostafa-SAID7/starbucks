import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SEO, Header, Logo, Accordion } from '../components'
import { privacyStatement as data } from '../data'

const PrivacyStatementPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.title[lang]} />

      <Header
        title={data.header[lang]}
        variant="light"
      />

      <div className="container mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-10">

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
          className="flex-1 text-start"
          >
            <div className="space-y-4 mb-8">
              <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">{data.header[lang]}</h1>
              <p className="text-sm text-gray-400">{data.lastUpdated[lang]}</p>
            </div>

            <Accordion 
              items={data.sections.map((section) => ({
                title: section.title[lang],
                content: (
                  <div className="space-y-4">
                    {section.paragraphs?.map((p: any, idx: number) => (
                      <p key={idx}>{p[lang]}</p>
                    ))}
                    
                    {section.list && (
                      <ul className="space-y-2 ps-4">
                        {section.list.map((item: any, i: number) => (
                          <li key={i} className="flex items-start gap-3 flex-row text-start">
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                            <span>{item[lang]}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.types && (
                      <div className="space-y-3">
                        {section.types.map((type: any) => (
                          <p key={type.id}>
                            <strong className="font-extrabold text-starbucks-dark dark:text-white">
                              {type.label[lang]}
                            </strong> {type.text[lang]}
                          </p>
                        ))}
                      </div>
                    )}

                    {section.contactNote && (
                      <p>{section.contactNote[lang]}</p>
                    )}

                    {section.contactInfo && (
                      <div className="pt-2 space-y-1 text-starbucks-green font-bold text-start">
                        <p dir="ltr">
                          <a href={`mailto:${section.contactInfo.email}`} className="hover:underline">{section.contactInfo.email}</a>
                        </p>
                        <p dir="ltr">
                          <a href={`tel:${section.contactInfo.phoneTel}`} className="hover:underline">{section.contactInfo.phone}</a>
                        </p>
                        {section.contactInfo.address && (
                          <p className="mt-4 text-sm text-gray-400 font-normal">
                            {section.contactInfo.address[lang]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              }))}
            />
          </motion.article>

        </div>
      </div>
    </div>
  )
}


export default PrivacyStatementPage
