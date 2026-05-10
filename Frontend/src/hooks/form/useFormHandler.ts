import { useCallback, useState } from 'react';
import { useErrorHandling } from '@/hooks/error/useErrorHandling';

/**
 * Hook for form handling with error tracking
 * Provides common form submission logic with error monitoring
 */
export function useFormHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { captureException, addBreadcrumb } = useErrorHandling();

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async <T,>(
      data: T,
      onSubmit: (data: T) => Promise<void>,
      formName?: string
    ) => {
      try {
        setIsSubmitting(true);
        setError(null);

        addBreadcrumb(
          `Form submitted: ${formName || 'unknown'}`,
          'form',
          'info',
          { formName }
        );

        await onSubmit(data);

        addBreadcrumb(
          `Form submission successful: ${formName || 'unknown'}`,
          'form',
          'info',
          { formName }
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Form submission failed';
        setError(errorMessage);

        captureException(
          err instanceof Error ? err : new Error(errorMessage),
          { formName, data }
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [captureException, addBreadcrumb]
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset form state
   */
  const resetFormState = useCallback(() => {
    setIsSubmitting(false);
    setError(null);
  }, []);

  return {
    isSubmitting,
    error,
    handleSubmit,
    clearError,
    resetFormState,
  };
}

export default useFormHandler;
