import React from 'react'
import { useTranslation } from 'react-i18next'
import { StaticPageLayout, StaticSection, Logo } from '@/components'
import { cookieNotice as data } from '@/data'
import type { CookieContentSection as ContentSection, LocalizedText } from '@/types'

export const CookieNoticePage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const isRTL = i18n.language === 'ar'

  const Sidebar = (
    <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
      <div className="bg-starbucks-green p-4 text-center">
        <Logo className="mx-auto h-16 w-16 object-contain mb-2" />
      </div>
      <div className="bg-gray-50 dark:bg-zinc-900 p-4 space-y-3">
        <a
          href={data.sidebar?.links?.menu}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-starbucks-green py-3 text-center text-sm font-extrabold text-white hover:bg-starbucks-dark transition-all"
        >
          {(data.sidebar?.menu as LocalizedText)?.[lang]}
        </a>
        <a
          href={data.sidebar?.links?.about}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full border-2 border-starbucks-dark py-3 text-center text-sm font-extrabold text-starbucks-dark dark:border-white dark:text-white hover:bg-starbucks-dark hover:text-white transition-all"
        >
          {(data.sidebar?.about as LocalizedText)?.[lang]}
        </a>
      </div>
    </div>
  )

  return (
    <StaticPageLayout
      title={data.title as LocalizedText}
      sidebar={Sidebar}
    >
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">
            {(data.intro?.title as LocalizedText)?.[lang]}
          </h1>
          <p className="text-sm text-gray-400">
            {(data.lastUpdated as LocalizedText)?.[lang]}
          </p>
          {(data.intro?.paragraphs as LocalizedText[])?.map((p, i) => (
            <p key={i} className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {p[lang]}
            </p>
          ))}
        </div>

        <StaticSection title={data.toc?.title as LocalizedText}>
          <p>{(data.toc?.subtitle as LocalizedText)?.[lang]}</p>
          <ul className={`mt-3 space-y-2 ${isRTL ? 'pr-4' : 'pl-4'} list-disc marker:text-starbucks-green`}>
            {(data.toc?.links as (LocalizedText & { id: string })[])?.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="text-starbucks-green hover:underline">
                  {link[lang]}
                </a>
              </li>
            ))}
          </ul>
        </StaticSection>

        {(data.sections as ContentSection[])?.map((section) => (
          <StaticSection key={section.id} id={section.id} title={section.title}>
            {section.paragraphs?.map((p, i) => (
              <p key={i}>{p[lang]}</p>
            ))}
            {section.definitions && (
              <div className="mt-4 space-y-4">
                {section.definitions.map((def, i) => (
                  <div key={i}>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">
                      {def.term?.[lang]}
                    </strong>
                    <p>{def.definition?.[lang]}</p>
                  </div>
                ))}
              </div>
            )}
            {section.groups && (
              <div className="mt-6 space-y-6">
                {section.groups.map((group, i) => (
                  <div key={i}>
                    <strong className="text-lg text-starbucks-dark dark:text-white font-bold border-b-2 border-starbucks-green inline-block pb-1 mb-2">
                      {group.title?.[lang]}
                    </strong>
                    {group.paragraphs?.map((p, j) => (
                      <p key={j} className={j > 0 ? "mt-2" : ""}>{p[lang]}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {section.list && (
              <ul className={`mt-3 space-y-2 ${isRTL ? 'pr-4' : 'pl-4'} list-disc marker:text-starbucks-green`}>
                {section.list.map((item, i) => (
                  <li key={i}>
                    {item[lang]}
                    {item.link && (
                      <a href={item.link} dir="ltr" className="inline-block text-starbucks-green hover:underline ml-1">
                        {item.link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </StaticSection>
        ))}
      </div>
    </StaticPageLayout>
  )
}

export default CookieNoticePage
