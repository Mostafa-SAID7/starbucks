import { errorMonitor } from './errorMonitoring';
import { AppError } from './AppError';

/**
 * Global error logging utility
 * Standardized way to log errors throughout the application
 * Automatically routes to console in dev and monitoring service in prod
 */
export function logError(error: unknown, context?: string) {
  // 1. Prepare the error object
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  
  // 2. Add context if provided
  const errorContext = context ? { context } : {};

  // In development, log to console
  if (import.meta.env.DEV) {
    const prefix = context ? `[${context}] Error:` : 'Error:';
    console.error(prefix, normalizedError);
  }

  // In production, send to monitoring service and backend endpoint
  if (import.meta.env.PROD) {
    try {
      errorMonitor.captureException(normalizedError as Error | AppError, errorContext);
    } catch (err) {
      // Fallback silently if monitoring service fails or is not initialized
    }

    fetch('/api/logging/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: normalizedError.message,
        stack: normalizedError.stack,
        context,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Handle fetch failure silently
    });
  }
}

/**
 * Log a warning message without throwing
 */
export function logWarning(message: string, context?: string) {
  errorMonitor.captureMessage(message, 'warning', context ? { context } : {});
}

/**
 * Log an info message for auditing
 */
export function logInfo(message: string, context?: string) {
  errorMonitor.captureMessage(message, 'info', context ? { context } : {});
}
