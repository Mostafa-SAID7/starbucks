import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Logo } from './ui'
import { cookies as data } from '../data'

const COOKIE_KEY = 'starbucks_cookie_consent'

interface Prefs {
  functional: boolean
  advertising: boolean
}

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? 'bg-starbucks-green' : 'bg-gray-300 dark:bg-zinc-600'}`}
    role="switch"
    aria-checked={checked}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
)

const CookieConsent: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const cookieData = (data as Record<string, any>)[lang]

  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({ functional: true, advertising: false })

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) {
      setVisible(true)
    }
  }, [])

  const save = (value: string) => {
    localStorage.setItem(COOKIE_KEY, value)
    setVisible(false)
  }

  const acceptAll = () => save('accepted')
  const declineAll = () => save('declined')
  const submitPrefs = () => save(JSON.stringify({ required: true, ...prefs }))

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-zinc-900 shadow-[0_-4px_40px_rgba(0,0,0,0.18)] border-t border-gray-200 dark:border-zinc-700"
        >
          {/* ── Preferences Panel ── */}
          <AnimatePresence>
            {showPrefs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-gray-200 dark:border-zinc-700"
              >
                <div className="container mx-auto max-w-3xl px-6 py-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Logo className="h-8 w-8 object-contain" />
                    <h2 className="text-base font-extrabold text-starbucks-dark dark:text-white">
                      {cookieData.title}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cookieData.prefsDesc}
                  </p>

                  {/* Required — always on */}
                  <div className="flex items-start justify-between gap-4 rounded-xl bg-gray-50 dark:bg-zinc-800 p-5 border dark:border-zinc-700">
                    <div className="flex-1">
                      <p className="font-extrabold text-starbucks-dark dark:text-white mb-1">
                        {cookieData.requiredTitle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cookieData.requiredDesc}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs font-bold text-starbucks-green uppercase tracking-widest">{cookieData.alwaysOn}</span>
                    </div>
                  </div>

                  {/* Functional */}
                  <div className="flex items-start justify-between gap-4 rounded-xl bg-gray-50 dark:bg-zinc-800 p-5 border dark:border-zinc-700">
                    <div className="flex-1">
                      <p className="font-extrabold text-starbucks-dark dark:text-white mb-1">
                        {cookieData.functionalTitle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cookieData.functionalDesc}
                      </p>
                    </div>
                    <Toggle checked={prefs.functional} onChange={() => setPrefs(p => ({ ...p, functional: !p.functional }))} />
                  </div>

                  {/* Advertising */}
                  <div className="flex items-start justify-between gap-4 rounded-xl bg-gray-50 dark:bg-zinc-800 p-5 border dark:border-zinc-700">
                    <div className="flex-1">
                      <p className="font-extrabold text-starbucks-dark dark:text-white mb-1">
                        {cookieData.advertisingTitle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cookieData.advertisingDesc}
                      </p>
                    </div>
                    <Toggle checked={prefs.advertising} onChange={() => setPrefs(p => ({ ...p, advertising: !p.advertising }))} />
                  </div>

                  {/* Functionality list */}
                  <div className="rounded-xl border dark:border-zinc-700 overflow-hidden">
                    <div className="bg-gray-100 dark:bg-zinc-800 px-5 py-3 border-b dark:border-zinc-700">
                      <p className="text-sm font-extrabold text-starbucks-dark dark:text-white">{cookieData.functionalityAllowed}</p>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-zinc-700">
                      {cookieData.items.map((item: string) => (
                        <li key={item} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prefs actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setShowPrefs(false)}
                      className="rounded-full border-2 border-gray-300 dark:border-zinc-600 px-8 py-3 text-sm font-extrabold text-gray-600 dark:text-gray-300 hover:border-starbucks-dark hover:text-starbucks-dark dark:hover:border-white dark:hover:text-white transition-all"
                    >
                      {cookieData.cancel}
                    </button>
                    <button
                      onClick={submitPrefs}
                      className="rounded-full bg-starbucks-green px-8 py-3 text-sm font-extrabold text-white hover:bg-starbucks-dark transition-all"
                    >
                      {cookieData.submitPrefs}
                    </button>
                    <button
                      onClick={declineAll}
                      className="rounded-full border-2 border-gray-300 dark:border-zinc-600 px-8 py-3 text-sm font-extrabold text-gray-600 dark:text-gray-300 hover:border-starbucks-dark hover:text-starbucks-dark transition-all"
                    >
                      {cookieData.decline}
                    </button>
                  </div>

                  {/* TrustArc + legal links */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t dark:border-zinc-700">
                    <div className="flex gap-4 text-xs text-gray-400">
                      <Link to="/privacy-statement" className="hover:text-starbucks-green transition-colors" onClick={acceptAll}>{cookieData.privacyPolicy}</Link>
                      <Link to="/terms-of-use" className="hover:text-starbucks-green transition-colors" onClick={acceptAll}>{cookieData.termsOfUse}</Link>
                      <Link to="/cookie-notice" className="hover:text-starbucks-green transition-colors" onClick={acceptAll}>{cookieData.cookieNotice}</Link>
                      <Link to="/cookie-notice" className="hover:text-starbucks-green transition-colors" onClick={acceptAll}>{cookieData.cookiePolicy}</Link>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{cookieData.poweredBy}</span>
                      <span className="font-bold text-gray-500 dark:text-gray-400">TrustArc</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main Bar ── */}
          <div className="container mx-auto max-w-6xl px-6 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left: logo + text */}
              <div className="flex items-start gap-3 flex-1">
                <Logo className="h-8 w-8 flex-shrink-0 object-contain mt-0.5" />
                <div>
                  <p className="text-sm font-extrabold text-starbucks-dark dark:text-white mb-0.5">
                    {cookieData.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                    {cookieData.body}
                  </p>
                </div>
              </div>

              {/* Right: buttons */}
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <button
                  onClick={acceptAll}
                  className="rounded-full bg-starbucks-green px-6 py-2.5 text-sm font-extrabold text-white hover:bg-starbucks-dark transition-all"
                >
                  {cookieData.agree}
                </button>
                <button
                  onClick={declineAll}
                  className="rounded-full border-2 border-gray-300 dark:border-zinc-600 px-6 py-2.5 text-sm font-extrabold text-gray-600 dark:text-gray-300 hover:border-starbucks-dark hover:text-starbucks-dark transition-all"
                >
                  {cookieData.decline}
                </button>
                <button
                  onClick={() => setShowPrefs(v => !v)}
                  className="rounded-full px-6 py-2.5 text-sm font-extrabold text-starbucks-green hover:underline transition-all"
                >
                  {cookieData.more}
                </button>
                <button onClick={declineAll} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent
