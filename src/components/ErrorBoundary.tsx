import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Home, Coffee } from 'lucide-react'
import { Button } from '@/components/ui'
import { useTranslation } from 'react-i18next'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ error, resetError }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Coffee className="h-24 w-24 mx-auto text-starbucks-green" />
        </motion.div>

        <h1 className="text-4xl font-black text-starbucks-dark dark:text-white">
          {isRTL ? 'حدث خطأ ما' : 'Something went wrong'}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {isRTL 
            ? 'نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.'
            : 'We apologize for this error. Please try again.'}
        </p>

        {error && (
          <details className="text-left rtl:text-right bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl text-sm text-gray-500">
            <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
            <pre className="whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={resetError}
            className="rounded-full"
          >
            <RefreshCw className="h-4 w-4 me-2" />
            {isRTL ? 'حاول مرة أخرى' : 'Try Again'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="rounded-full"
          >
            <Home className="h-4 w-4 me-2" />
            {isRTL ? 'العودة للرئيسية' : 'Go Home'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default ErrorBoundary