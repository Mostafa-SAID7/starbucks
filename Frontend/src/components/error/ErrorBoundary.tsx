import React from "react";
import { motion } from "framer-motion";
import { Coffee, RefreshCw, Home, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button, SectionBackground } from "@/components/ui";
import { LiveRegion } from "@/components/accessibility";
import { logError, getErrorMessages } from "@/lib/error";
import { cn } from "@/lib/ui";
import { useLanguage } from "@/hooks";

interface ErrorFallbackProps extends FallbackProps {
  variant?: "full" | "compact";
}

/**
 * Unified Error Fallback UI following Starbucks Brand Design
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary,
  variant = "full" 
}) => {
  const { t } = useTranslation("common");
  const { lang } = useLanguage();
  
  // Log error for debugging and monitoring
  logError(error, "ErrorBoundary");

  // Get intelligent, localized error messages
  const errorInfo = getErrorMessages(error, t);

  if (variant === "compact") {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden"
        role="alert"
        aria-live="polite"
      >
        <LiveRegion message={errorInfo.title} politeness="assertive" />
        <SectionBackground variant="neutral" className="opacity-30" />
        <div className="relative z-10 text-center">
          <AlertTriangle className="h-10 w-10 text-starbucks-green mb-4 mx-auto" />
          <p className="text-gray-900 dark:text-white font-black mb-4">
            {errorInfo.title}
          </p>
          <Button
            onClick={resetErrorBoundary}
            variant="primary"
            size="sm"
            className="rounded-full px-6 bg-starbucks-green hover:bg-starbucks-dark text-white border-none shadow-lg shadow-starbucks-green/20 transition-all"
          >
            <RefreshCw className="h-4 w-4 me-2" />
            {errorInfo.retry}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 py-12 transition-colors duration-300 relative overflow-hidden">
      <LiveRegion message={`${errorInfo.title}. ${errorInfo.message}`} politeness="assertive" />
      <SectionBackground variant="default" className="opacity-70" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8 relative z-10"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity, 
            repeatDelay: 4 
          }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-starbucks-green/30 blur-3xl rounded-full animate-pulse-slow" />
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-full shadow-2xl relative z-10 border border-starbucks-green/10">
            <Coffee className="h-20 w-20 mx-auto text-starbucks-green" />
          </div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            {errorInfo.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-sm mx-auto">
            {errorInfo.message}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            {errorInfo.help}
          </p>
        </div>

        {import.meta.env.DEV && (
          <details className="text-left rtl:text-right bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl text-sm border border-gray-100 dark:border-zinc-800">
            <summary className="cursor-pointer font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Developer Details
            </summary>
            <pre className="mt-4 p-4 bg-white dark:bg-black rounded-xl overflow-auto max-h-40 font-mono text-xs text-red-600 dark:text-red-400 border border-gray-100 dark:border-zinc-800">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={resetErrorBoundary}
            className="rounded-full px-8 py-6 h-auto text-lg w-full sm:w-auto shadow-xl shadow-starbucks-green/20 bg-starbucks-green hover:bg-starbucks-dark text-white border-none transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className={cn("h-5 w-5 me-2", "transition-transform duration-500")} />
            {errorInfo.retry}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = `/${lang}/`}
            className="rounded-full px-8 py-6 h-auto text-lg w-full sm:w-auto border-2 border-starbucks-green text-starbucks-green hover:bg-starbucks-green hover:text-white transition-all hover:scale-105 active:scale-95"
          >
            <Home className="h-5 w-5 me-2" />
            {t("common:home")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  variant?: "full" | "compact";
  onReset?: () => void;
  fallback?: React.ReactNode;
}

/**
 * Robust, Starbucks-Branded Error Boundary
 */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  variant = "full",
  onReset,
  fallback
}) => {
  return (
    <ReactErrorBoundary
      onReset={onReset}
      fallbackRender={(props) => (
        fallback ? <>{fallback}</> : <ErrorFallback {...props} variant={variant} />
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;


