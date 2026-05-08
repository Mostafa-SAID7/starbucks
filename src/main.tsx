import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components'
import './i18n'
import './index.css'
import App from './App.tsx'

// Synchronously set dir/lang from URL BEFORE React renders — prevents any FOID flash
;(function () {
  const m = window.location.pathname.match(/^\/(ar|en)(\/|$)/)
  const l = m ? m[1] : 'ar'
  document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', l)
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)