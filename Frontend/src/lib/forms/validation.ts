import { ZodSchema, ZodError, ZodObject } from 'zod';
import { AppError, ErrorType } from '@/lib/error';

/**
 * Validate data against a Zod schema
 * Throws AppError on validation failure
 */
export function validateData<T>(
  data: unknown,
  schema: ZodSchema,
  context?: string
): T {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');

      throw new AppError(
        `Validation failed${context ? ` (${context})` : ''}: ${message}`,
        ErrorType.VALIDATION,
        400,
        'Bad Request'
      );
    }
    throw error;
  }
}

/**
 * Safely validate data without throwing
 * Returns validation result with errors
 */
export function safeValidateData<T>(
  data: unknown,
  schema: ZodSchema
): { success: boolean; data?: T; errors?: string[] } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData as T };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map(
        issue => `${issue.path.join('.')}: ${issue.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Create a validated API response handler
 */
export function createValidatedResponseHandler<T>(schema: ZodSchema) {
  return (response: unknown, context?: string): T => {
    return validateData<T>(response, schema, context);
  };
}

/**
 * Validate and transform API response
 */
export async function validateApiResponse<T>(
  response: Response,
  schema: ZodSchema,
  context?: string
): Promise<T> {
  if (!response.ok) {
    throw new AppError(
      `API request failed: ${response.status} ${response.statusText}`,
      ErrorType.GENERAL,
      response.status
    );
  }

  try {
    const data = await response.json();
    return validateData<T>(data, schema, context);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Failed to parse API response${context ? ` (${context})` : ''}`,
      ErrorType.GENERAL,
      response.status
    );
  }
}

/**
 * Batch validate multiple items
 */
export function validateBatch<T>(
  items: unknown[],
  schema: ZodSchema,
  context?: string
): { valid: T[]; invalid: Array<{ item: unknown; errors: string[] }> } {
  const valid: T[] = [];
  const invalid: Array<{ item: unknown; errors: string[] }> = [];

  for (const item of items) {
    const result = safeValidateData<T>(item, schema);
    if (result.success && result.data) {
      valid.push(result.data);
    } else {
      invalid.push({
        item,
        errors: result.errors || ['Unknown error'],
      });
    }
  }

  return { valid, invalid };
}

/**
 * Create a type guard from a Zod schema
 */
export function createTypeGuard<T>(schema: ZodSchema) {
  return (value: unknown): value is T => {
    try {
      schema.parse(value);
      return true;
    } catch {
      return false;
    }
  };
}

/**
 * Merge multiple schemas
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeSchemas<T extends ZodObject<any, any>[]>(...schemas: T) {
  return schemas.reduce((acc, schema) => acc.merge(schema));
}

/**
 * Create a partial schema (all fields optional)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createPartialSchema<T extends ZodObject<any, any>>(schema: T) {
  return schema.partial();
}

/**
 * Create a strict schema (no extra properties)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStrictSchema<T extends ZodObject<any, any>>({ schema }: { schema: T; }) {
  return schema.strict();
}
