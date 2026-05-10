import { ErrorType } from "@/types";
import { AppError, BackendErrorResponse } from "./AppError";

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
