import { ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { logError } from "@/lib/errorUtils";

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
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";

  // Log error for debugging and monitoring
  logError(error, "ErrorBoundary");

  return (
    <div
      className="min-h-[400px] flex items-center justify-center bg-background p-6"
      dir={isRTL ? "rtl" : "ltr"}
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
          {lang === "ar" ? "حدث خطأ غير متوقع" : "Something went wrong"}
        </h2>

        {/* Error Message */}
        <p
          className="text-foreground/70 mb-6 leading-relaxed"
          id="error-description"
        >
          {lang === "ar"
            ? "عذراً، حدث خطأ أثناء تحميل هذا المحتوى. يرجى المحاولة مرة أخرى."
            : "Sorry, there was an error loading this content. Please try again."}
        </p>

        {/* Error Details (Development Only) */}
        {import.meta.env.DEV && error.message && (
          <details className="mb-6 text-left">
            <summary
              className="cursor-pointer text-sm font-medium text-foreground/80 mb-2"
              aria-label={
                lang === "ar" ? "عرض تفاصيل الخطأ" : "Show error details"
              }
            >
              {lang === "ar" ? "تفاصيل الخطأ" : "Error Details"}
            </summary>
            <pre
              className="text-xs bg-card border border-border p-4 rounded-lg overflow-auto max-h-40 text-red-600 dark:text-red-400"
              role="region"
              aria-label={
                lang === "ar"
                  ? "رسالة الخطأ التقنية"
                  : "Technical error message"
              }
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
          aria-label={
            lang === "ar"
              ? "إعادة المحاولة لتحميل المحتوى"
              : "Retry loading content"
          }
          aria-describedby="error-description"
        >
          <RefreshCw className="h-5 w-5" aria-hidden="true" />
          <span>{lang === "ar" ? "إعادة المحاولة" : "Try Again"}</span>
        </Button>

        {/* Help Text */}
        <p className="mt-6 text-sm text-foreground/60">
          {lang === "ar"
            ? "إذا استمرت المشكلة، يرجى تحديث الصفحة أو الاتصال بالدعم."
            : "If the problem persists, please refresh the page or contact support."}
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
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

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
        {lang === "ar" ? "حدث خطأ" : "Error occurred"}
      </p>
      <Button
        onClick={resetErrorBoundary}
        variant="primary"
        size="sm"
        className="text-sm"
        aria-label={
          lang === "ar"
            ? "إعادة المحاولة لتحميل المحتوى"
            : "Retry loading content"
        }
        aria-describedby="compact-error-message"
      >
        {lang === "ar" ? "إعادة المحاولة" : "Retry"}
      </Button>
    </div>
  );
}

export default QueryErrorBoundary;
