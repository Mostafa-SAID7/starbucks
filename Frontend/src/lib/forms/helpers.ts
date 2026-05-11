/**
 * Form Helpers
 * Logic for form handling and state management
 */

/**
 * Form error handler
 */
export function getFormError(
  errors: Record<string, unknown>,
  fieldName: string
): string | undefined {
  const error = errors[fieldName] as { message?: string } | undefined;
  return error?.message;
}

/**
 * Form field helper
 */
export function getFormFieldProps(
  register: (name: string, options?: unknown) => unknown,
  fieldName: string,
  options?: unknown
) {
  return register(fieldName, options);
}

/**
 * Form submission handler
 */
export async function handleFormSubmit<T>(
  data: T,
  onSubmit: (data: T) => Promise<void>,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    await onSubmit(data);
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
    throw error;
  }
}

/**
 * Form reset helper
 */
export function resetForm(reset: (values?: unknown) => void, defaultValues?: unknown): void {
  reset(defaultValues);
}

/**
 * Async field validation
 */
export async function validateFieldAsync(
  fieldName: string,
  value: unknown,
  validator: (value: unknown) => Promise<boolean>
): Promise<string | undefined> {
  try {
    const isValid = await validator(value);
    return isValid ? undefined : `${fieldName} is invalid`;
  } catch (_error) {
    return `Error validating ${fieldName}`;
  }
}

/**
 * Form state helper
 */
export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, unknown>;
}

export function getFormState(formState: {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, unknown>;
}): FormState {
  return {
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    errors: formState.errors,
  };
}
