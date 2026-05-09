/**
 * Error Monitoring Service
 * Handles error tracking and reporting
 * 
 * Supports multiple monitoring backends:
 * - Sentry (recommended for production)
 * - Custom error logging service
 * - Console logging (development)
 */

import * as Sentry from '@sentry/react';
import { AppError, ErrorType } from './errorUtils';

export interface ErrorMonitoringConfig {
  enabled: boolean;
  environment: 'development' | 'staging' | 'production';
  dsn?: string; // Sentry DSN
  tracesSampleRate?: number;
  debug?: boolean;
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  page?: string;
  action?: string;
  [key: string]: unknown;
}

class ErrorMonitoringService {
  private config: ErrorMonitoringConfig;
  private context: ErrorContext = {};
  private initialized = false;

  constructor(config: ErrorMonitoringConfig) {
    this.config = config;
  }

  /**
   * Initialize error monitoring
   * Sets up Sentry or other monitoring service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    if (!this.config.enabled) {
      console.log('Error monitoring is disabled');
      return;
    }

    try {
      // Initialize Sentry
      if (this.config.dsn) {
        Sentry.init({
          dsn: this.config.dsn,
          environment: this.config.environment,
          tracesSampleRate: this.config.tracesSampleRate || 0.1,
          debug: this.config.debug,
          integrations: [
            new Sentry.Replay({
              maskAllText: true,
              blockAllMedia: true,
            }),
          ],
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
        });
      }

      this.initialized = true;
      console.log('Error monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize error monitoring:', error);
    }
  }

  /**
   * Set user context for error tracking
   */
  setUser(userId: string, email?: string, username?: string): void {
    this.context.userId = userId;

    // Set Sentry user context
    Sentry.setUser({ id: userId, email, username });
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    delete this.context.userId;

    // Clear Sentry user context
    Sentry.setUser(null);
  }

  /**
   * Set additional context for error tracking
   */
  setContext(key: string, value: unknown): void {
    this.context[key] = value;

    // Set Sentry context
    Sentry.setContext(key, { [key]: value });
  }

  /**
   * Add breadcrumb for error tracking
   */
  addBreadcrumb(
    message: string,
    category: string = 'user-action',
    level: 'info' | 'warning' | 'error' = 'info',
    data?: Record<string, unknown>
  ): void {
    // Add Sentry breadcrumb
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
    });

    if (this.config.debug) {
      console.log(`[${category}] ${message}`, data);
    }
  }

  /**
   * Capture exception
   */
  captureException(
    error: Error | AppError,
    context?: ErrorContext
  ): void {
    const mergedContext = { ...this.context, ...context };

    // Log to console in development
    if (this.config.environment === 'development') {
      console.error('Error captured:', error, mergedContext);
    }

    // Send to Sentry
    Sentry.captureException(error, {
      contexts: { app: mergedContext },
      tags: {
        errorType: error instanceof AppError ? error.type : 'unknown',
      },
    });

    // Send to custom error logging service
    this.sendToLoggingService(error, mergedContext);
  }

  /**
   * Capture message
   */
  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: ErrorContext
  ): void {
    const mergedContext = { ...this.context, ...context };

    // Log to console in development
    if (this.config.environment === 'development') {
      console.log(`[${level}] ${message}`, mergedContext);
    }

    // Send to Sentry
    Sentry.captureMessage(message, level);
  }

  /**
   * Send error to custom logging service
   */
  private async sendToLoggingService(
    error: Error | AppError,
    context: ErrorContext
  ): Promise<void> {
    try {
      // TODO: Implement custom logging service
      // const response = await fetch('/api/logs/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: error.message,
      //     stack: error.stack,
      //     type: error instanceof AppError ? error.type : 'unknown',
      //     statusCode: error instanceof AppError ? error.statusCode : undefined,
      //     context,
      //     timestamp: new Date().toISOString(),
      //     userAgent: navigator.userAgent,
      //     url: window.location.href,
      //   }),
      // });

      // if (!response.ok) {
      //   console.error('Failed to send error to logging service');
      // }
    } catch (err) {
      console.error('Error sending to logging service:', err);
    }
  }

  /**
   * Get current context
   */
  getContext(): ErrorContext {
    return { ...this.context };
  }

  /**
   * Clear all context
   */
  clearContext(): void {
    this.context = {};
  }
}

/**
 * Global error monitoring instance
 */
let errorMonitoring: ErrorMonitoringService | null = null;

/**
 * Initialize global error monitoring
 */
export function initializeErrorMonitoring(
  config: ErrorMonitoringConfig
): ErrorMonitoringService {
  errorMonitoring = new ErrorMonitoringService(config);
  errorMonitoring.initialize();
  return errorMonitoring;
}

/**
 * Get global error monitoring instance
 */
export function getErrorMonitoring(): ErrorMonitoringService {
  if (!errorMonitoring) {
    throw new Error(
      'Error monitoring not initialized. Call initializeErrorMonitoring first.'
    );
  }
  return errorMonitoring;
}

/**
 * Convenience functions for error monitoring
 */
export const errorMonitor = {
  /**
   * Capture exception
   */
  captureException: (error: Error | AppError, context?: ErrorContext) => {
    getErrorMonitoring().captureException(error, context);
  },

  /**
   * Capture message
   */
  captureMessage: (
    message: string,
    level?: 'info' | 'warning' | 'error',
    context?: ErrorContext
  ) => {
    getErrorMonitoring().captureMessage(message, level, context);
  },

  /**
   * Add breadcrumb
   */
  addBreadcrumb: (
    message: string,
    category?: string,
    level?: 'info' | 'warning' | 'error',
    data?: Record<string, unknown>
  ) => {
    getErrorMonitoring().addBreadcrumb(message, category, level, data);
  },

  /**
   * Set user context
   */
  setUser: (userId: string, email?: string, username?: string) => {
    getErrorMonitoring().setUser(userId, email, username);
  },

  /**
   * Clear user context
   */
  clearUser: () => {
    getErrorMonitoring().clearUser();
  },

  /**
   * Set context
   */
  setContext: (key: string, value: unknown) => {
    getErrorMonitoring().setContext(key, value);
  },

  /**
   * Get context
   */
  getContext: () => {
    return getErrorMonitoring().getContext();
  },

  /**
   * Clear context
   */
  clearContext: () => {
    getErrorMonitoring().clearContext();
  },
};
