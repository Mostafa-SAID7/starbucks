/**
 * Analytics Service Types
 * User tracking and analytics event types
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
  sessionId: string;
  timestamp: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  sampleRate: number;
  debug: boolean;
}