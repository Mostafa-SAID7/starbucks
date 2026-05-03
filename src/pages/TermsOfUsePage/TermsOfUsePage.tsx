import React from 'react'
import { useTranslation } from 'react-i18next'
import { StaticPageLayout, StaticSection, Accordion } from '@/components'
import { termsOfUse as data } from '@/data'
import type { TermsOfUseSection as Section } from '@/types'

export const TermsOfUsePage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'

  return (
    <StaticPageLayout
      title={data.title}
    >
      <div className="space-y-12">
        {data.sections.map((section: Section) => (
          <StaticSection key={section.id} title={section.title}>
            <div className="space-y-4">
              {section.paragraphs?.map((p, idx) => (
                <p key={idx}>{p[lang]}</p>
              ))}
            </div>

            {section.list && (
              <ul className="space-y-3 ps-6">
                {section.list.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.contactInfo && (
              <div className="mt-8 space-y-4 p-8 bg-starbucks-dark text-white rounded-[2rem] shadow-xl">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                    <a href={`mailto:${section.contactInfo.email}`} className="text-xl font-bold hover:text-starbucks-green transition-colors">
                      {section.contactInfo.email}
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">{lang === 'ar' ? 'الهاتف' : 'Phone'}</p>
                    <a href={`tel:${section.contactInfo.phoneTel}`} className="text-xl font-bold hover:text-starbucks-green transition-colors">
                      {section.contactInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </StaticSection>
        ))}
      </div>

      <div className="mt-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white italic">
            {lang === 'ar' ? 'شروط إضافية' : 'Additional Terms'}
          </h2>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] p-4 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
          <Accordion 
            items={data.sections.slice(1, 6).map((section: Section) => ({
              title: section.title[lang],
              content: section.paragraphs?.[0]?.[lang] || ''
            }))} 
          />
        </div>
      </div>
    </StaticPageLayout>
  )
}

export default TermsOfUsePage
