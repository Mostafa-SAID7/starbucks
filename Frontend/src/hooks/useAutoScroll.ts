import { useEffect, useRef, useState, DependencyList } from "react";

/**
 * Custom hook for auto-scrolling to an element
 * Useful for chat messages, logs, or any scrollable content
 * 
 * @param dependency - Dependency array to trigger scroll
 * @param options - Scroll options
 * @returns Ref to attach to the element to scroll to
 * 
 * @example
 * ```tsx
 * const messagesEndRef = useAutoScroll([messages]);
 * 
 * return (
 *   <div className="messages">
 *     {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
 *     <div ref={messagesEndRef} />
 *   </div>
 * );
 * ```
 */
export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
  dependency: DependencyList = [],
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "end" }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView(options);
    }
  }, dependency);

  return ref;
}

/**
 * Custom hook for scrolling to top
 * 
 * @param dependency - Dependency array to trigger scroll
 * @returns Function to scroll to top
 * 
 * @example
 * ```tsx
 * const scrollToTop = useScrollToTop([pathname]);
 * 
 * // Or call manually
 * <button onClick={scrollToTop}>Scroll to Top</button>
 * ```
 */
export function useScrollToTop(dependency: DependencyList = []) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, dependency);

  return scrollToTop;
}

/**
 * Custom hook for detecting scroll position
 * 
 * @param threshold - Scroll threshold in pixels
 * @returns Whether scroll position exceeds threshold
 * 
 * @example
 * ```tsx
 * const isScrolled = useScrollPosition(100);
 * 
 * return (
 *   <nav className={isScrolled ? "shadow-lg" : ""}>
 *     {/* ... */}
 *   </nav>
 * );
 * ```
 */
export function useScrollPosition(threshold: number = 0) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
