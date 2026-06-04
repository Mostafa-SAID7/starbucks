import { useEffect, useCallback, useState } from 'react';

export interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  disabled?: boolean;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    disabled = false,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        case 'Enter':
          event.preventDefault();
          onEnter?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onArrowRight?.();
          break;
        case 'Tab':
          onTab?.();
          break;
      }
    },
    [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, disabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, enabled = true) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, enabled]);
}

export function useArrowKeyNavigation(
  items: HTMLElement[],
  onSelect?: (index: number) => void
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleArrowUp = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);
      items[newIndex]?.focus();
      onSelect?.(newIndex);
      return newIndex;
    });
  }, [items, onSelect]);

  const handleArrowDown = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = Math.min(items.length - 1, prev + 1);
      items[newIndex]?.focus();
      onSelect?.(newIndex);
      return newIndex;
    });
  }, [items, onSelect]);

  useKeyboardNavigation({
    onArrowUp: handleArrowUp,
    onArrowDown: handleArrowDown,
  });

  return { currentIndex };
}
