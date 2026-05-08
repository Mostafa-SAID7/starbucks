/**
 * Monitoring Service Types
 * Error reporting and performance monitoring types
 */

export interface ErrorReport {
  error: Error;
  context: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}