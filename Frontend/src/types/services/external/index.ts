/**
 * External Service Types
 * Third-party service integrations (payments, maps, etc.)
 */

export interface PaymentProvider {
  name: string;
  initialize(config: Record<string, unknown>): Promise<void>;
  processPayment(amount: number, currency: string, metadata?: Record<string, unknown>): Promise<PaymentResult>;
  refund(transactionId: string, amount?: number): Promise<RefundResult>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, unknown>;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
  name?: string;
}

export interface MapConfig {
  apiKey: string;
  defaultZoom: number;
  defaultCenter: MapLocation;
  style?: string;
}