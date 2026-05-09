/**
 * Form Validation Hook
 * Reusable hook for form validation using Zod schemas
 */

import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

export interface ValidationError {
  [key: string]: string | string[];
}

export interface UseFormValidationReturn<T> {
  errors: ValidationError;
  isValid: boolean;
  validate: (data: unknown) => boolean;
  setErrors: (errors: ValidationError) => void;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
}

/**
 * Hook for form validation using Zod schemas
 * @param schema - Zod schema for validation
 * @returns Validation state and methods
 */
export function useFormValidation<T>(
  schema: ZodSchema
): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<ValidationError>({});

  const validate = useCallback(
    (data: unknown): boolean => {
      try {
        schema.parse(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors: ValidationError = {};
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            if (fieldErrors[path]) {
              if (Array.isArray(fieldErrors[path])) {
                (fieldErrors[path] as string[]).push(err.message);
              } else {
                fieldErrors[path] = [fieldErrors[path] as string, err.message];
              }
            } else {
              fieldErrors[path] = err.message;
            }
          });
          setErrors(fieldErrors);
          return false;
        }
        return false;
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    validate,
    setErrors,
    clearErrors,
    clearFieldError,
  };
}

/**
 * Hook for validating individual fields
 * @param schema - Zod schema for validation
 * @returns Field validation function
 */
export function useFieldValidation(schema: ZodSchema) {
  const validateField = useCallback(
    (fieldName: string, value: unknown): string | null => {
      try {
        const fieldSchema = (schema as any).pick({ [fieldName]: true });
        fieldSchema.parse({ [fieldName]: value });
        return null;
      } catch (error) {
        if (error instanceof ZodError) {
          return error.errors[0]?.message || 'Validation error';
        }
        return 'Validation error';
      }
    },
    [schema]
  );

  return validateField;
}

/**
 * Hook for async form validation
 * @param schema - Zod schema for validation
 * @param onValidate - Optional async validation function
 * @returns Validation state and methods
 */
export function useAsyncFormValidation<T>(
  schema: ZodSchema,
  onValidate?: (data: T) => Promise<ValidationError>
) {
  const [errors, setErrors] = useState<ValidationError>({});
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(
    async (data: unknown): Promise<boolean> => {
      try {
        setIsValidating(true);

        // First, validate with schema
        const validData = schema.parse(data) as T;

        // Then, run async validation if provided
        if (onValidate) {
          const asyncErrors = await onValidate(validData);
          if (Object.keys(asyncErrors).length > 0) {
            setErrors(asyncErrors);
            return false;
          }
        }

        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors: ValidationError = {};
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            fieldErrors[path] = err.message;
          });
          setErrors(fieldErrors);
        }
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [schema, onValidate]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    isValidating,
    validate,
    setErrors,
    clearErrors,
    clearFieldError,
  };
}
