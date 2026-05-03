import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Home, Coffee } from 'lucide-react'
import { SEO, Logo } from '../components'
import bg404 from '../assets/bg-404.png'

export default function NotFound() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <SEO title={t('not_found.title', 'Page Not Found')} />

      {/* Full-screen background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bg404}
          alt=""
          className="h-full w-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-starbucks-dark/70 dark:bg-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Starbucks siren icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="mb-8"
        >
          <Logo className="h-24 w-24 drop-shadow-2xl" />
        </motion.div>

        {/* 404 Number */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-8xl font-black tracking-tight text-white drop-shadow-2xl lg:text-9xl"
          style={{ textShadow: '0 4px 32px rgba(0,0,0,0.4)' }}
        >
          404
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 h-px w-32 bg-starbucks-green"
        />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4 text-2xl font-extrabold text-white lg:text-3xl"
        >
          {isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 max-w-sm text-base text-white/75 leading-relaxed"
        >
          {isRTL
            ? 'يبدو أن الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها.'
            : "The page you're looking for doesn't exist. It may have been moved or removed."}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link to="/">
            <button className="flex items-center gap-2 rounded-full bg-starbucks-green px-10 py-4 font-extrabold text-white shadow-lg hover:bg-white hover:text-starbucks-dark transition-all">
              <Home className="h-5 w-5" />
              {isRTL ? 'الصفحة الرئيسية' : 'Go Home'}
            </button>
          </Link>
          <Link to="/menu">
            <button className="flex items-center gap-2 rounded-full border-2 border-white/60 px-10 py-4 font-extrabold text-white hover:border-white hover:bg-white hover:text-starbucks-dark transition-all">
              <Coffee className="h-5 w-5" />
              {isRTL ? 'تصفح القائمة' : 'Browse Menu'}
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
