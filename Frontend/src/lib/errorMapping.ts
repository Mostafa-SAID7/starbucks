/**
 * Error Mapping Utility
 * Maps backend errors to frontend AppError format
 */

import { AppError, ErrorType } from './errorUtils';

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
    Forbidden: ErrorType.UNAUTHORIZED, // Treat as unauthorized for frontend
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

    // Determine error type
    let errorType = ErrorType.GENERAL;
    if (backendError.errorType) {
      errorType = mapErrorType(backendError.errorType);
    } else if (statusCode) {
      errorType = mapStatusCodeToErrorType(statusCode);
    }

    // Create AppError
    const appError = new AppError(
      backendError.message || 'An error occurred',
      errorType,
      statusCode || backendError.statusCode
    );

    // Add validation errors if present
    if (backendError.errors) {
      appError.context = {
        validationErrors: backendError.errors,
      };
    }

    // Add trace ID if present
    if (backendError.traceId) {
      appError.context = {
        ...appError.context,
        traceId: backendError.traceId,
      };
    }

    return appError;
  }

  // Fallback for unknown error types
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
 * Formats error message for display
 */
export function formatErrorMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.VALIDATION:
      return 'Please check your input and try again.';
    case ErrorType.UNAUTHORIZED:
      return 'You are not authorized to perform this action.';
    case ErrorType.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorType.TIMEOUT:
      return 'The request took too long. Please try again.';
    case ErrorType.SERVER:
      return 'A server error occurred. Please try again later.';
    case ErrorType.NETWORK:
      return 'A network error occurred. Please check your connection.';
    default:
      return error.message || 'An error occurred. Please try again.';
  }
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
 * Gets HTTP status code from error
 */
export function getErrorStatusCode(error: AppError): number {
  return error.statusCode || 500;
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
