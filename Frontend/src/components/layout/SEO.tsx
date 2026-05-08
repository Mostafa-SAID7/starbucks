import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
}

export const SEO = ({ title, description, canonical }: SEOProps) => {
  const { i18n } = useTranslation()
  const siteName = i18n.language === 'ar' ? 'ستاربكس مصر' : 'Starbucks Egypt'
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const defaultDescription = i18n.language === 'ar' 
    ? 'ستاربكس مصر - الصفحة الرئيسية'
    : 'Starbucks Egypt - Home'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <html lang={i18n.language} dir={i18n.dir()} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  )
}
