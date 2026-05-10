/**
 * Form Helpers
 * Logic for form handling and state management
 */

/**
 * Form error handler
 */
export function getFormError(
  errors: Record<string, any>,
  fieldName: string
): string | undefined {
  const error = errors[fieldName];
  return error?.message;
}

/**
 * Form field helper
 */
export function getFormFieldProps(
  register: any,
  fieldName: string,
  options?: any
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
export function resetForm(reset: any, defaultValues?: any): void {
  reset(defaultValues);
}

/**
 * Async field validation
 */
export async function validateFieldAsync(
  fieldName: string,
  value: any,
  validator: (value: any) => Promise<boolean>
): Promise<string | undefined> {
  try {
    const isValid = await validator(value);
    return isValid ? undefined : `${fieldName} is invalid`;
  } catch (error) {
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
  errors: Record<string, any>;
}

export function getFormState(formState: any): FormState {
  return {
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    errors: formState.errors,
  };
}
