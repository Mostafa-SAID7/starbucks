import React, { ReactNode, ErrorInfo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Send to error tracking service
    if (window.__SENTRY__) {
      window.__SENTRY__.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {t('errors.boundary.title', 'Oops! Something went wrong')}
        </h1>

        <p className="text-center text-gray-600 mb-6">
          {t('errors.boundary.message', 'We apologize for the inconvenience. Our team has been notified.')}
        </p>

        {import.meta.env.DEV && error && (
          <div className="bg-gray-100 rounded p-4 mb-6 max-h-40 overflow-auto">
            <p className="text-xs font-mono text-gray-700 break-words">
              {error.toString()}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="flex-1"
          >
            {t('common.home', 'Home')}
          </Button>
          <Button
            onClick={onReset}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.retry', 'Retry')}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          {t('errors.boundary.support', 'If the problem persists, please contact support.')}
        </p>
      </div>
    </div>
  );
}

// Extend window interface for Sentry
declare global {
  interface Window {
    __SENTRY__?: any;
  }
}
