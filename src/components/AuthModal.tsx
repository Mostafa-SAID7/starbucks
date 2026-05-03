import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal, Button, Input } from './ui'
import { navbar } from '../data'

interface AuthData {
  login: {
    title: string
    email: string
    password: string
    submit: string
    forgot: string
    remember: string
    no_account: string
    register: string
  }
  register: {
    title: string
    first_name: string
    last_name: string
    email: string
    password: string
    submit: string
    have_account: string
    login: string
    terms: string
  }
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  const isRTL = lang === 'ar'
  
  // Safe type access for navbar auth data
  const authData = navbar[lang as keyof typeof navbar].auth as AuthData

  const [mode, setMode] = useState<'login' | 'register'>('login')

  const toggleMode = () => setMode(prev => prev === 'login' ? 'register' : 'login')

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="max-w-xl"
    >
      <div className="relative" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Mode Toggle Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-10 relative">
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-700 rounded-xl shadow-sm"
            initial={false}
            animate={{ 
              x: mode === 'login' 
                ? '0%' 
                : (isRTL ? '-100%' : '100%') 
            }}
            style={{ [isRTL ? 'right' : 'left']: '4px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setMode('login')}
            className={`relative z-10 flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors ${
              mode === 'login' ? 'text-starbucks-green' : 'text-gray-500'
            }`}
          >
            {authData.login.title}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`relative z-10 flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors ${
              mode === 'register' ? 'text-starbucks-green' : 'text-gray-500'
            }`}
          >
            {authData.register.title}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    type="email" 
                    placeholder={authData.login.email}
                    className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                  />
                </div>
                <div className="relative">
                  <Input 
                    type="password" 
                    placeholder={authData.login.password}
                    className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="hidden peer" />
                  <div className="h-5 w-5 rounded border-2 border-gray-200 peer-checked:border-starbucks-green peer-checked:bg-starbucks-green flex items-center justify-center transition-all">
                    <svg className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-starbucks-dark dark:group-hover:text-white transition-colors">
                    {authData.login.remember}
                  </span>
                </label>
                <button className="text-sm font-bold text-starbucks-green hover:underline decoration-2 underline-offset-4">
                  {authData.login.forgot}
                </button>
              </div>

              <Button className="w-full h-14 rounded-full text-lg font-black uppercase tracking-widest shadow-xl shadow-starbucks-green/20 hover:scale-[1.02] transition-all">
                {authData.login.submit}
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {authData.login.no_account}{' '}
                <button 
                  type="button"
                  onClick={toggleMode} 
                  className="font-black text-starbucks-green hover:underline decoration-2 underline-offset-4"
                >
                  {authData.login.register}
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder={authData.register.first_name}
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
                <Input 
                  placeholder={authData.register.last_name}
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
              </div>
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder={authData.register.email}
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
              </div>
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder={authData.register.password}
                  className="h-14 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all px-6"
                />
              </div>

              <div className="px-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="hidden peer" />
                  <div className="mt-0.5 h-5 w-5 rounded border-2 border-gray-200 peer-checked:border-starbucks-green peer-checked:bg-starbucks-green flex items-center justify-center transition-all flex-shrink-0">
                    <svg className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-starbucks-dark dark:group-hover:text-white transition-colors leading-relaxed">
                    {authData.register.terms}
                  </span>
                </label>
              </div>

              <Button className="w-full h-14 rounded-full text-lg font-black uppercase tracking-widest shadow-xl shadow-starbucks-green/20 hover:scale-[1.02] transition-all">
                {authData.register.submit}
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {authData.register.have_account}{' '}
                <button 
                  type="button"
                  onClick={toggleMode} 
                  className="font-black text-starbucks-green hover:underline decoration-2 underline-offset-4"
                >
                  {authData.register.login}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}
