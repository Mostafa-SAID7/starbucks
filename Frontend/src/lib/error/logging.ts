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

  // 3. Capture with global monitoring service
  try {
    errorMonitor.captureException(normalizedError as Error | AppError, errorContext);
  } catch (err) {
    // Fallback if monitoring service fails or is not initialized
    console.error(`[CRITICAL] Error logging failed:`, err);
    console.error(`[Original Error]:`, error);
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
