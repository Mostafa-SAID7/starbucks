import { useEffect, useRef, useState, DependencyList } from 'react';

/**
 * Custom hook for auto-scrolling to an element
 * Useful for chat messages, logs, or any scrollable content
 */
export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
  dependency: DependencyList = [],
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'end' }
) {
  const ref = useRef<T>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView(options);
    }
  }, dependency);

  return ref;
}

/**
 * Custom hook for scrolling to top
 */
export function useScrollToTop(dependency: DependencyList = []) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    scrollToTop();
  }, dependency);

  return scrollToTop;
}

/**
 * Custom hook for detecting scroll position
 */
export function useScrollPosition(threshold: number = 0) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}
