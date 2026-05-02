import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Home } from 'lucide-react'
import SEO from '../components/SEO'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <SEO title={t('not_found.title')} />
      <div className="mb-8 rounded-full bg-starbucks-green/10 p-6 text-starbucks-green dark:bg-starbucks-green/20 dark:text-starbucks-light">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          className="h-24 w-24"
          fill="currentColor"
        >
          <circle cx="32" cy="32" r="31" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 25c1.5 0 2.5 1 2.5 2.5S21.5 30 20 30s-2.5-1-2.5-2.5 1-2.5 2.5-2.5zm24 0c1.5 0 2.5 1 2.5 2.5S45.5 30 44 30s-2.5-1-2.5-2.5 1-2.5 2.5-2.5zm-12 15c-5 0-9 4-9 4s4 4 9 4 9-4 9-4-4-4-9-4z" />
        </svg>
      </div>
      <h1 className="mb-4 text-6xl font-bold text-starbucks-green dark:text-starbucks-light">404</h1>
      <h2 className="mb-6 text-2xl font-bold text-foreground-light dark:text-foreground-dark">
        {t('not_found.title')}
      </h2>
      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
        {t('not_found.message')}
      </p>
      <Link to="/">
        <Button className="gap-2">
          <Home className="h-4 w-4" />
          {t('not_found.button')}
        </Button>
      </Link>
    </div>
  )
}
