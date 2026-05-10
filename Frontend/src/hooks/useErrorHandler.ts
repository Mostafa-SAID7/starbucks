import { useCallback } from 'react';
import { useErrorContext } from '@/contexts/ErrorContext';
import { useTranslation } from 'react-i18next';
import axios, { AxiosError } from 'axios';

interface ErrorHandlerOptions {
  showNotification?: boolean;
  logToConsole?: boolean;
  retryable?: boolean;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { showNotification = true, logToConsole = true, retryable = false } = options;
  const { addError } = useErrorContext();
  const { t } = useTranslation();

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      if (logToConsole) {
        console.error(`[${context || 'Error'}]`, error);
      }

      let title = t('errors.generic.title', 'Error');
      let message = t('errors.generic.message', 'Something went wrong');
      let type: 'error' | 'warning' | 'info' = 'error';

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;

        // Handle specific HTTP status codes
        if (axiosError.response?.status === 400) {
          title = t('errors.validation.title', 'Validation Error');
          message = axiosError.response.data?.userMessage ||
            t('errors.validation.message', 'Please check your input');
        } else if (axiosError.response?.status === 401) {
          title = t('errors.auth.title', 'Authentication Error');
          message = t('errors.auth.message', 'Please log in again');
        } else if (axiosError.response?.status === 403) {
          title = t('errors.forbidden.title', 'Access Denied');
          message = t('errors.forbidden.message', 'You do not have permission');
        } else if (axiosError.response?.status === 404) {
          title = t('errors.notfound.title', 'Not Found');
          message = t('errors.notfound.message', 'The requested resource was not found');
        } else if (axiosError.response?.status === 429) {
          title = t('errors.ratelimit.title', 'Too Many Requests');
          message = t('errors.ratelimit.message', 'Please try again later');
        } else if (axiosError.response?.status >= 500) {
          title = t('errors.server.title', 'Server Error');
          message = t('errors.server.message', 'Our team is working on this');
        } else if (axiosError.code === 'ECONNABORTED') {
          title = t('errors.timeout.title', 'Request Timeout');
          message = t('errors.timeout.message', 'The request took too long');
        } else if (!axiosError.response) {
          title = t('errors.network.title', 'Network Error');
          message = t('errors.network.message', 'Check your internet connection');
        }
      } else if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      if (showNotification) {
        addError({
          type,
          title,
          message,
          action: retryable
            ? {
              label: t('common.retry', 'Retry'),
              handler: () => {
                // Retry logic should be handled by caller
              },
            }
            : undefined,
        });
      }

      return { title, message };
    },
    [addError, showNotification, logToConsole, retryable, t]
  );

  return { handleError };
}
