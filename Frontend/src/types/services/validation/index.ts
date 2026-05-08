/**
 * Validation Service Types
 * Form validation and data validation types
 */

export interface ValidationRule {
  field: string;
  rules: string[];
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}