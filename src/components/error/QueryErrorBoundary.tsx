import { ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { logError, getErrorMessages } from "@/lib/errorUtils";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Error Fallback Component
 * Displays a user-friendly error message with retry functionality
 * Enhanced with ARIA attributes for screen reader accessibility
 * Now uses i18n translations for better error messages
 */
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const { t } = useTranslation("common");

  // Log error for debugging and monitoring
  logError(error, "ErrorBoundary");

  // Get intelligent error messages
  const errorInfo = getErrorMessages(error, t);

  return (
    <div
      className="min-h-[400px] flex items-center justify-center bg-background p-6"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div className="rounded-full bg-red-50 dark:bg-red-900/20 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Title */}
        <h2
          className="text-2xl font-bold text-foreground mb-3"
          id="error-title"
        >
          {errorInfo.title}
        </h2>

        {/* Error Message */}
        <p
          className="text-foreground/70 mb-6 leading-relaxed"
          id="error-description"
        >
          {errorInfo.message}
        </p>

        {/* Error Details (Development Only) */}
        {import.meta.env.DEV && error.message && (
          <details className="mb-6 text-left">
            <summary
              className="cursor-pointer text-sm font-medium text-foreground/80 mb-2"
              aria-label={t("errors.general.show_details") || "Show details"}
            >
              {t("errors.general.details") || "Error Details"}
            </summary>
            <pre
              className="text-xs bg-card border border-border p-4 rounded-lg overflow-auto max-h-40 text-red-600 dark:text-red-400"
              role="region"
            >
              {error.message}
            </pre>
          </details>
        )}

        {/* Retry Button */}
        <Button
          onClick={resetErrorBoundary}
          variant="primary"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-lg"
          aria-label={t("common:retry_aria")}
        >
          <RefreshCw className="h-5 w-5" aria-hidden="true" />
          <span>{errorInfo.retry}</span>
        </Button>

        {/* Help Text */}
        <p className="mt-6 text-sm text-foreground/60">
          {errorInfo.help}
        </p>
      </div>
    </div>
  );
}

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Query Error Boundary Component
 * Wraps components that use TanStack Query and provides error handling
 *
 * Usage:
 * ```tsx
 * <QueryErrorBoundary>
 *   <YourComponent />
 * </QueryErrorBoundary>
 * ```
 */
export function QueryErrorBoundary({
  children,
  fallback,
}: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          onReset={reset}
          fallbackRender={
            fallback
              ? () => <>{fallback}</>
              : (props: FallbackProps) => (
                  <ErrorFallback
                    error={props.error as Error}
                    resetErrorBoundary={props.resetErrorBoundary}
                  />
                )
          }
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

/**
 * Compact Error Fallback for smaller components
 * Enhanced with ARIA attributes for accessibility
 */
export function CompactErrorFallback({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  const { t } = useTranslation("common");

  return (
    <div
      className="flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-border shadow-sm"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <AlertTriangle
        className="h-8 w-8 text-red-600 dark:text-red-400 mb-3"
        aria-hidden="true"
      />
      <p
        className="text-sm text-foreground/70 mb-3 text-center"
        id="compact-error-message"
      >
        {t("errors.general.title")}
      </p>
      <Button
        onClick={resetErrorBoundary}
        variant="primary"
        size="sm"
        className="text-sm"
        aria-label={t("common:retry_aria")}
      >
        {t("common:retry")}
      </Button>
    </div>
  );
}

export default QueryErrorBoundary;
