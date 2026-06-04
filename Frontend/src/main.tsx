import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components'
import { initSentry } from './lib/error/errorMonitoring'
import './i18n'
import './index.css'
import App from './App.tsx'

// 1. Initialize Sentry FIRST — before any React code runs
initSentry()

// Synchronously set dir/lang from URL BEFORE React renders — prevents any FOID flash
;(function () {
  const m = window.location.pathname.match(/^\/(ar|en)(\/|$)/)
  const l = m ? m[1] : 'ar'
  document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', l)
})()

import { APIProvider } from '@vis.gl/react-google-maps'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
            <App />
          </APIProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)