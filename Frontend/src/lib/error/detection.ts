import { ErrorType } from "@/types";
import { AppError } from "./AppError";

/**
 * Detect error type from an unknown error object
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
 * Create standardized fetch errors from a Response object
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
