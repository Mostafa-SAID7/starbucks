import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { errorMonitor } from '@/lib/errorMonitoring';
import { useAuthStore } from '@/hooks/auth/useAuth';

/**
 * Hook for error monitoring integration
 * Automatically tracks page navigation and user context
 */
export function useErrorMonitoring() {
  const location = useLocation();
  const { user } = useAuthStore();

  // Track page navigation
  useEffect(() => {
    errorMonitor.addBreadcrumb(
      `Navigated to ${location.pathname}`,
      'navigation',
      'info',
      { path: location.pathname, search: location.search }
    );
  }, [location]);

  // Set user context when user changes
  useEffect(() => {
    if (user) {
      const userName = `${user.firstName} ${user.lastName}`.trim();
      errorMonitor.setUser(user.id, user.email, userName);
    } else {
      errorMonitor.clearUser();
    }
  }, [user]);

  // Capture exception
  const captureException = useCallback((error: Error, context?: Record<string, unknown>) => {
    errorMonitor.captureException(error, {
      page: location.pathname,
      ...context,
    });
  }, [location.pathname]);

  // Capture message
  const captureMessage = useCallback(
    (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
      errorMonitor.captureMessage(message, level, {
        page: location.pathname,
      });
    },
    [location.pathname]
  );

  // Add breadcrumb
  const addBreadcrumb = useCallback(
    (
      message: string,
      category: string = 'user-action',
      level: 'info' | 'warning' | 'error' = 'info',
      data?: Record<string, unknown>
    ) => {
      errorMonitor.addBreadcrumb(message, category, level, {
        page: location.pathname,
        ...data,
      });
    },
    [location.pathname]
  );

  return {
    captureException,
    captureMessage,
    addBreadcrumb,
  };
}

export default useErrorMonitoring;
