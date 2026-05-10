import { ErrorType } from "@/types";
import { detectErrorType } from "./detection";
import { BackendErrorResponse } from "./AppError";

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
