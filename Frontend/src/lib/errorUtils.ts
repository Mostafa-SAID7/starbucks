import { ErrorType } from "@/types";
export { ErrorType };

/**
 * Enhanced error class with type information
 */
export class AppError extends Error {
  public type: ErrorType;
  public statusCode?: number;
  public statusText?: string;
  public originalError?: Error;
  public context?: Record<string, unknown>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.GENERAL,
    statusCode?: number,
    statusText?: string,
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.originalError = originalError;
    this.context = context;
  }
}

/**
 * Detect error type from error object
 */
export function detectErrorType(error: unknown): ErrorType {
  if (error instanceof AppError) {
    return error.type;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection") ||
      message.includes("offline")
    ) {
      return ErrorType.NETWORK;
    }

    // Timeout errors
    if (
      message.includes("timeout") ||
      message.includes("aborted") ||
      message.includes("signal")
    ) {
      return ErrorType.TIMEOUT;
    }

    // Not found errors
    if (message.includes("not found") || message.includes("404")) {
      return ErrorType.NOT_FOUND;
    }

    // Unauthorized errors
    if (
      message.includes("unauthorized") ||
      message.includes("401") ||
      message.includes("403")
    ) {
      return ErrorType.UNAUTHORIZED;
    }

    // Server errors
    if (
      message.includes("server") ||
      message.includes("500") ||
      message.includes("502") ||
      message.includes("503")
    ) {
      return ErrorType.SERVER;
    }
  }

  return ErrorType.GENERAL;
}

/**
 * Get localized error messages based on error type
 */
export function getErrorMessages(error: unknown, t: (key: string) => string) {
  const errorType = detectErrorType(error);

  const messages = {
    [ErrorType.NETWORK]: {
      title: t("errors.network.title"),
      message: t("errors.network.message"),
      retry: t("common:retry"),
      help: t("errors.network.help"),
    },
    [ErrorType.TIMEOUT]: {
      title: t("errors.timeout.title"),
      message: t("errors.timeout.message"),
      retry: t("common:retry"),
      help: t("errors.timeout.help"),
    },
    [ErrorType.SERVER]: {
      title: t("errors.server.title"),
      message: t("errors.server.message"),
      retry: t("common:retry"),
      help: t("errors.server.help"),
    },
    [ErrorType.NOT_FOUND]: {
      title: t("errors.not_found.title"),
      message: t("errors.not_found.message"),
      retry: t("errors.not_found.retry"),
      help: t("errors.not_found.help"),
    },
    [ErrorType.UNAUTHORIZED]: {
      title: t("errors.unauthorized.title"),
      message: t("errors.unauthorized.message"),
      retry: t("common:sign_in"),
      help: t("errors.unauthorized.help"),
    },
    [ErrorType.VALIDATION]: {
      title: t("errors.validation.title"),
      message: t("errors.validation.message"),
      retry: t("common:retry"),
      help: t("errors.validation.help"),
    },
    [ErrorType.GENERAL]: {
      title: t("errors.general.title"),
      message: t("errors.general.message"),
      retry: t("common:retry"),
      help: t("errors.general.help"),
    },
  };

  return messages[errorType];
}

/**
 * Create context-specific error messages
 */
export function getContextualErrorMessage(
  error: unknown,
  context: "menu" | "locations" | "contact" | "page",
  t: (key: string) => string,
) {
  const errorType = detectErrorType(error);

  // Context-specific messages for common errors
  if (errorType === ErrorType.NOT_FOUND) {
    switch (context) {
      case "menu":
        return t("errors.menu.category_not_found");
      case "locations":
        return t("errors.locations.no_results");
      default:
        return t("errors.not_found.message");
    }
  }

  if (errorType === ErrorType.GENERAL) {
    switch (context) {
      case "menu":
        return t("errors.menu.load_failed");
      case "locations":
        return t("errors.locations.load_failed");
      case "contact":
        return t("errors.contact.load_failed");
      default:
        return t("errors.general.message");
    }
  }

  // Fall back to general error messages
  const messages = getErrorMessages(error, t);
  return messages.message;
}

/**
 * Log errors for debugging and monitoring
 */
export function logError(error: unknown, context?: string) {
  // Only log to console in development
  if (import.meta.env.DEV) {
    console.error(`[${context || "App"}] Error:`, error);
  }

  // In production, send to error monitoring service
  if (import.meta.env.PROD) {
    // TODO: Implement proper error monitoring service
    // Example: Sentry, LogRocket, etc.
    // errorMonitoringService.captureException(error, { context });
    
    // For now, use a structured logging approach
    const errorData = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    // Send to logging endpoint (implement this endpoint in backend)
    fetch('/api/logging/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData),
    }).catch(() => {
      // Silently fail if logging endpoint is unavailable
    });
  }
}

/**
 * Create standardized fetch errors
 */
export function createFetchError(
  response: Response,
  context?: string,
): AppError {
  let errorType: ErrorType;

  switch (response.status) {
    case 401:
    case 403:
      errorType = ErrorType.UNAUTHORIZED;
      break;
    case 404:
      errorType = ErrorType.NOT_FOUND;
      break;
    case 408:
      errorType = ErrorType.TIMEOUT;
      break;
    case 500:
    case 502:
    case 503:
      errorType = ErrorType.SERVER;
      break;
    default:
      errorType = ErrorType.GENERAL;
  }

  const message = context
    ? `Failed to fetch ${context}: ${response.status} ${response.statusText}`
    : `Request failed: ${response.status} ${response.statusText}`;

  return new AppError(message, errorType, response.status);
}

/**
 * Backend error response format
 */
export interface BackendErrorResponse {
  message: string;
  statusCode?: number;
  errorType?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  traceId?: string;
}

/**
 * Maps backend error type string to frontend ErrorType enum
 */
export function mapErrorType(backendErrorType?: string): ErrorType {
  if (!backendErrorType) {
    return ErrorType.GENERAL;
  }

  const typeMap: Record<string, ErrorType> = {
    Validation: ErrorType.VALIDATION,
    NotFound: ErrorType.NOT_FOUND,
    Unauthorized: ErrorType.UNAUTHORIZED,
    Forbidden: ErrorType.UNAUTHORIZED,
    Conflict: ErrorType.GENERAL,
    Server: ErrorType.SERVER,
    Timeout: ErrorType.TIMEOUT,
    Network: ErrorType.NETWORK,
    General: ErrorType.GENERAL,
  };

  return typeMap[backendErrorType] || ErrorType.GENERAL;
}

/**
 * Maps HTTP status code to ErrorType
 */
export function mapStatusCodeToErrorType(statusCode?: number): ErrorType {
  if (!statusCode) {
    return ErrorType.GENERAL;
  }

  switch (statusCode) {
    case 400:
      return ErrorType.VALIDATION;
    case 401:
      return ErrorType.UNAUTHORIZED;
    case 403:
      return ErrorType.UNAUTHORIZED;
    case 404:
      return ErrorType.NOT_FOUND;
    case 408:
      return ErrorType.TIMEOUT;
    case 409:
      return ErrorType.GENERAL;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorType.SERVER;
    default:
      return ErrorType.GENERAL;
  }
}

/**
 * Converts backend error response to AppError
 */
export function mapBackendErrorToAppError(
  error: BackendErrorResponse | unknown,
  statusCode?: number
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const backendError = error as BackendErrorResponse;

    let errorType = ErrorType.GENERAL;
    if (backendError.errorType) {
      errorType = mapErrorType(backendError.errorType);
    } else if (statusCode) {
      errorType = mapStatusCodeToErrorType(statusCode);
    }

    const appError = new AppError(
      backendError.message || 'An error occurred',
      errorType,
      statusCode || backendError.statusCode
    );

    if (backendError.errors) {
      appError.context = {
        validationErrors: backendError.errors,
      };
    }

    if (backendError.traceId) {
      appError.context = {
        ...appError.context,
        traceId: backendError.traceId,
      };
    }

    return appError;
  }

  return new AppError(
    'An unexpected error occurred',
    ErrorType.GENERAL,
    statusCode
  );
}

/**
 * Extracts validation errors from backend response
 */
export function extractValidationErrors(
  error: BackendErrorResponse
): Record<string, string> {
  if (!error.errors) {
    return {};
  }

  const validationErrors: Record<string, string> = {};

  Object.entries(error.errors).forEach(([field, messages]) => {
    validationErrors[field] = Array.isArray(messages)
      ? messages[0]
      : messages;
  });

  return validationErrors;
}

/**
 * Checks if error is retryable
 */
export function isRetryableError(error: AppError): boolean {
  return (
    error.type === ErrorType.TIMEOUT ||
    error.type === ErrorType.NETWORK ||
    error.type === ErrorType.SERVER
  );
}

/**
 * Checks if error is validation error
 */
export function isValidationError(error: AppError): boolean {
  return error.type === ErrorType.VALIDATION;
}

/**
 * Checks if error is authentication error
 */
export function isAuthenticationError(error: AppError): boolean {
  return error.type === ErrorType.UNAUTHORIZED;
}

/**
 * Checks if error is not found error
 */
export function isNotFoundError(error: AppError): boolean {
  return error.type === ErrorType.NOT_FOUND;
}

/**
 * Checks if error is server error
 */
export function isServerError(error: AppError): boolean {
  return error.type === ErrorType.SERVER;
}

/**
 * Checks if error is network error
 */
export function isNetworkError(error: AppError): boolean {
  return error.type === ErrorType.NETWORK;
}

