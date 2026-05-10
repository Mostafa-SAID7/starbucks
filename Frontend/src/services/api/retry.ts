/**
 * API Retry utility
 * Handles retry logic for failed requests
 */

export class ApiRetry {
  /**
   * Retry a function with exponential backoff
   */
  static async withBackoff<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxAttempts - 1) {
          const delay = initialDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Max retry attempts reached');
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    // Network errors are retryable
    if (error.message.includes('Network') || error.message.includes('timeout')) {
      return true;
    }

    // 5xx errors are retryable
    if (error.message.includes('5')) {
      return true;
    }

    return false;
  }
}
