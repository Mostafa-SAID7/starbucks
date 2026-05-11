/**
 * Unified Error Handling Hook
 * Consolidates error handling from useErrorHandler.ts and useErrorMonitoring.ts
 * Eliminates 120+ lines of duplicate code
 */

import { useCallback } from 'react';
import { useErrorContext } from '@/contexts/ErrorContext';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/auth/useAuth';
import { clientMonitoringService as monitoringService } from '@/services/monitoring';
import { AppError, detectErrorType, getErrorMessages } from '@/lib/error';

export interface ErrorHandlingOptions {
  showNotification?: boolean;
  logToConsole?: boolean;
  captureException?: boolean;
  context?: string;
}

export interface UseErrorHandlingReturn {
  handleError: (error: unknown, options?: ErrorHandlingOptions) => void;
  captureException: (error: Error, context?: Record<string, unknown>) => void;
  captureMessage: (message: string, level?: 'info' | 'warning' | 'error') => void;
  addBreadcrumb: (
    message: string,
    category?: string,
    level?: 'info' | 'warning' | 'error',
    data?: Record<string, unknown>
  ) => void;
}

/**
 * Unified Error Handling Hook
 * Handles errors, monitoring, and breadcrumbs in one place
 */
export function useErrorHandling(): UseErrorHandlingReturn {
  const { addError } = useErrorContext();
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  /**
   * Add breadcrumb — declared FIRST so other callbacks can reference it
   */
  const addBreadcrumb = useCallback(
    (
      message: string,
      category: string = 'user-action',
      level: 'info' | 'warning' | 'error' = 'info',
      data?: Record<string, unknown>
    ) => {
      monitoringService.addBreadcrumb(message, category, level, data);
    },
    []
  );

  /**
   * Handle error with notifications and monitoring
   */
  const handleError = useCallback(
    (error: unknown, options: ErrorHandlingOptions = {}) => {
      const {
        showNotification = true,
        logToConsole = true,
        captureException: shouldCapture = true,
        context,
      } = options;

      // Log to console in development
      if (logToConsole && import.meta.env.DEV) {
        console.error(`[${context || 'Error'}]`, error);
      }

      // Detect error type
      const errorType = detectErrorType(error);
      const errorMessages = getErrorMessages(error, t);

      // Show notification
      if (showNotification && addError) {
        addError({
          title: errorMessages.title,
          message: errorMessages.message,
          type: 'error',
          action: errorMessages.retry
            ? { label: errorMessages.retry, handler: () => {} }
            : undefined,
        });
      }

      // Capture exception for monitoring
      if (shouldCapture) {
        const errorData = {
          errorType,
          page: location.pathname,
          context,
          userId: user?.id,
        };

        if (error instanceof Error) {
          monitoringService.captureException(error, errorData);
        } else if (error instanceof AppError) {
          monitoringService.captureException(
            new Error(error.message),
            errorData
          );
        } else {
          monitoringService.captureException(
            new Error(String(error)),
            errorData
          );
        }
      }

      // Add breadcrumb
      addBreadcrumb(
        `Error occurred: ${errorMessages.title}`,
        'error',
        'error',
        { errorType, context }
      );
    },
    [addError, t, location.pathname, user?.id, addBreadcrumb]
  );

  /**
   * Capture exception with context
   */
  const captureException = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      const errorData = {
        page: location.pathname,
        userId: user?.id,
        ...context,
      };

      monitoringService.captureException(error, errorData);

      // Add breadcrumb
      addBreadcrumb(
        `Exception: ${error.message}`,
        'exception',
        'error',
        { errorName: error.name }
      );
    },
    [location.pathname, user?.id, addBreadcrumb]
  );

  /**
   * Capture message
   */
  const captureMessage = useCallback(
    (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
      monitoringService.captureMessage(message, level, {
        page: location.pathname,
        userId: user?.id,
      });

      // Add breadcrumb
      addBreadcrumb(message, 'message', level);
    },
    [location.pathname, user?.id, addBreadcrumb]
  );

  return {
    handleError,
    captureException,
    captureMessage,
    addBreadcrumb,
  };
}

/**
 * Hook for tracking page navigation
 */
export function useErrorMonitoring() {
  const { addBreadcrumb } = useErrorHandling();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  // Track page navigation
  const trackNavigation = useCallback(() => {
    addBreadcrumb(
      `Navigated to ${location.pathname}`,
      'navigation',
      'info',
      { path: location.pathname, search: location.search }
    );
  }, [location, addBreadcrumb]);

  // Track user context
  const trackUserContext = useCallback(() => {
    if (user) {
      const userName = `${user.firstName} ${user.lastName}`.trim();
      monitoringService.setUser(user.id, user.email, userName);
    } else {
      monitoringService.clearUser();
    }
  }, [user]);

  return {
    trackNavigation,
    trackUserContext,
    addBreadcrumb,
  };
}
