import { ErrorType } from "@/types";
import { AppError } from "./AppError";

/**
 * Checks if error is retryable (timeout, network, or server error)
 */
export function isRetryableError(error: AppError): boolean {
  return (
    error.type === ErrorType.TIMEOUT ||
    error.type === ErrorType.NETWORK ||
    error.type === ErrorType.SERVER
  );
}

/**
 * Checks if error is a validation error
 */
export function isValidationError(error: AppError): boolean {
  return error.type === ErrorType.VALIDATION;
}

/**
 * Checks if error is an authentication error
 */
export function isAuthenticationError(error: AppError): boolean {
  return error.type === ErrorType.UNAUTHORIZED;
}

/**
 * Checks if error is a not found error
 */
export function isNotFoundError(error: AppError): boolean {
  return error.type === ErrorType.NOT_FOUND;
}

/**
 * Checks if error is a server error
 */
export function isServerError(error: AppError): boolean {
  return error.type === ErrorType.SERVER;
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: AppError): boolean {
  return error.type === ErrorType.NETWORK;
}
