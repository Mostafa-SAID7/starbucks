import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Logo from './Logo'

const COOKIE_KEY = 'starbucks_cookie_consent'

interface Prefs {
  functional: boolean
  advertising: boolean
}

const CookieConsent: React.FC = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({ functional: true, advertising: false })

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) setVisible(true)
  }, [])

  const save = (value: string) => {
    localStorage.setItem(COOKIE_KEY, value)
    setVisible(false)
  }

  const acceptAll = () => save('accepted')
  const declineAll = () => save('declined')
  const submitPrefs = () => save(JSON.stringify({ required: true, ...prefs }))

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
                      {t('cookies.title', 'Your Choices Regarding Cookies on this Site')}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('cookies.prefs_desc', 'Please choose whether this site may use Functional and/or Advertising cookies, as described below:')}
                  </p>

                  {/* Required — always on */}
                  <div className="flex items-start justify-between gap-4 rounded-xl bg-gray-50 dark:bg-zinc-800 p-5 border dark:border-zinc-700">
                    <div className="flex-1">
                      <p className="font-extrabold text-starbucks-dark dark:text-white mb-1">
                        {t('cookies.required_title', 'Required Cookies')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('cookies.required_desc', 'These cookies are required to enable core site functionality.')}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs font-bold text-starbucks-green uppercase tracking-widest">Always On</span>
                    </div>
                  </div>

                  {/* Functional */}
                  <div className="flex items-start justify-between gap-4 rounded-xl bg-gray-50 dark:bg-zinc-800 p-5 border dark:border-zinc-700">
                    <div className="flex-1">
                      <p className="font-extrabold text-starbucks-dark dark:text-white mb-1">
                        {t('cookies.functional_title', 'Functional Cookies')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('cookies.functional_desc', 'These cookies allow us to analyze site usage so we can measure and improve performance.')}
                      </p>
                    </div>
                    <Toggle checked={prefs.functional} onChange={() => setPrefs(p => ({ ...p, functional: !p.functional }))} />
                  </div>

                  {/* Advertising */}
                  <div className="flex items-start justify-between gap-4 rounded-xl bg-gray-50 dark:bg-zinc-800 p-5 border dark:border-zinc-700">
                    <div className="flex-1">
                      <p className="font-extrabold text-starbucks-dark dark:text-white mb-1">
                        {t('cookies.advertising_title', 'Advertising Cookies')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('cookies.advertising_desc', 'These cookies are used by advertising companies to serve ads that are relevant to your interests.')}
                      </p>
                    </div>
                    <Toggle checked={prefs.advertising} onChange={() => setPrefs(p => ({ ...p, advertising: !p.advertising }))} />
                  </div>

                  {/* Functionality list */}
                  <div className="rounded-xl border dark:border-zinc-700 overflow-hidden">
                    <div className="bg-gray-100 dark:bg-zinc-800 px-5 py-3 border-b dark:border-zinc-700">
                      <p className="text-sm font-extrabold text-starbucks-dark dark:text-white">Functionality Allowed</p>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-zinc-700">
                      {[
                        'Provide secure log-in',
                        'Remember how far you are through an order',
                        'Remember your log-in details',
                        'Remember what is in your shopping cart',
                        'Make sure the website looks consistent',
                        'Allow you to share pages with social networks',
                        'Allow you to post comments',
                        'Serve ads relevant to your interests',
                      ].map((item) => (
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
                      {t('cookies.cancel', 'Cancel')}
                    </button>
                    <button
                      onClick={submitPrefs}
                      className="rounded-full bg-starbucks-green px-8 py-3 text-sm font-extrabold text-white hover:bg-starbucks-dark transition-all"
                    >
                      {t('cookies.submit_prefs', 'Submit Preferences')}
                    </button>
                    <button
                      onClick={declineAll}
                      className="rounded-full border-2 border-gray-300 dark:border-zinc-600 px-8 py-3 text-sm font-extrabold text-gray-600 dark:text-gray-300 hover:border-starbucks-dark hover:text-starbucks-dark transition-all"
                    >
                      {t('cookies.decline', 'Decline All')}
                    </button>
                  </div>

                  {/* TrustArc + legal links */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t dark:border-zinc-700">
                    <div className="flex gap-4 text-xs text-gray-400">
                      <Link to="/privacy-statement" className="hover:text-starbucks-green transition-colors" onClick={acceptAll}>Privacy Policy</Link>
                      <Link to="/terms-of-use" className="hover:text-starbucks-green transition-colors" onClick={acceptAll}>Terms of Use</Link>
                      <Link to="/cookie-notice" className="hover:text-starbucks-green transition-colors" onClick={acceptAll}>Cookie Notice</Link>
                      <Link to="/cookie-notice" className="hover:text-starbucks-green transition-colors" onClick={acceptAll}>Cookie Policy</Link>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{t('cookies.powered_by', 'Powered by:')}</span>
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
                    {t('cookies.title', 'Your Choices Regarding Cookies on this Site')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                    {t('cookies.body', 'Cookies are important to the proper functioning of a site. To improve your experience, we use cookies to remember log-in details and provide secure log-in, collect statistics to optimize site functionality, and deliver content tailored to your interests.')}
                  </p>
                </div>
              </div>

              {/* Right: buttons */}
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <button
                  onClick={acceptAll}
                  className="rounded-full bg-starbucks-green px-6 py-2.5 text-sm font-extrabold text-white hover:bg-starbucks-dark transition-all"
                >
                  {t('cookies.agree', 'Agree and Proceed')}
                </button>
                <button
                  onClick={declineAll}
                  className="rounded-full border-2 border-gray-300 dark:border-zinc-600 px-6 py-2.5 text-sm font-extrabold text-gray-600 dark:text-gray-300 hover:border-starbucks-dark hover:text-starbucks-dark transition-all"
                >
                  {t('cookies.decline', 'Decline All')}
                </button>
                <button
                  onClick={() => setShowPrefs(v => !v)}
                  className="rounded-full px-6 py-2.5 text-sm font-extrabold text-starbucks-green hover:underline transition-all"
                >
                  {t('cookies.more', 'More Information')}
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
