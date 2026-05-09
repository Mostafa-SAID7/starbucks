import { useEffect, useRef } from 'react';

/**
 * Hook for managing focus within a container
 * Useful for modals, dropdowns, and other interactive components
 */
export function useFocusManagement(isOpen: boolean, containerRef: React.RefObject<HTMLElement>) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the container or first focusable element
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        containerRef.current.focus();
      }
    }

    // Restore focus when closing
    return () => {
      if (previousActiveElement.current && previousActiveElement.current.focus) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, containerRef]);
}

/**
 * Hook for keyboard navigation (Tab, Shift+Tab, Escape)
 */
export function useKeyboardNavigation(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement>,
  onEscape?: () => void
) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        const focusableElements = containerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        const activeElement = document.activeElement;

        if (e.shiftKey) {
          // Shift + Tab: move focus backward
          if (activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move focus forward
          if (activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, containerRef, onEscape]);
}

/**
 * Hook for managing focus trap and keyboard navigation together
 */
export function useAccessibleDialog(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement>,
  onClose?: () => void
) {
  useFocusManagement(isOpen, containerRef);
  useKeyboardNavigation(isOpen, containerRef, onClose);
}
