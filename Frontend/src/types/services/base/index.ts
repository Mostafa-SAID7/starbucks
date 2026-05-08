/**
 * Base Service Types
 * Core service response and error types
 */

export interface ServiceResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: Record<string, unknown>;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}