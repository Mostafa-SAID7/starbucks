import { ErrorType } from "@/types";
export { ErrorType };

/**
 * Enhanced error class with type information for consistent error handling
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
