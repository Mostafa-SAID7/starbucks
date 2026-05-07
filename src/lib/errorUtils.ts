/**
 * Error types for better error handling
 */
export enum ErrorType {
  NETWORK = "network",
  TIMEOUT = "timeout",
  SERVER = "server",
  NOT_FOUND = "not_found",
  UNAUTHORIZED = "unauthorized",
  GENERAL = "general",
}

/**
 * Enhanced error class with type information
 */
export class AppError extends Error {
  public type: ErrorType;
  public statusCode?: number;
  public originalError?: Error;

  constructor(
    message: string,
    type: ErrorType = ErrorType.GENERAL,
    statusCode?: number,
    originalError?: Error,
  ) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
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
      retry: t("errors.network.retry"),
      help: t("errors.network.help"),
    },
    [ErrorType.TIMEOUT]: {
      title: t("errors.timeout.title"),
      message: t("errors.timeout.message"),
      retry: t("errors.timeout.retry"),
      help: t("errors.timeout.help"),
    },
    [ErrorType.SERVER]: {
      title: t("errors.server.title"),
      message: t("errors.server.message"),
      retry: t("errors.server.retry"),
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
      retry: t("errors.unauthorized.retry"),
      help: t("errors.unauthorized.help"),
    },
    [ErrorType.GENERAL]: {
      title: t("errors.general.title"),
      message: t("errors.general.message"),
      retry: t("errors.general.retry"),
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
  if (import.meta.env.DEV) {
    console.error(`[${context || "App"}] Error:`, error);
  }

  // TODO: In production, send to error monitoring service
  // Example: Sentry, LogRocket, etc.
  // if (import.meta.env.PROD) {
  //   errorMonitoringService.captureException(error, { context });
  // }
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
 * Retry utility with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
