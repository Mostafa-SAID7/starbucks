import { useRef } from "react";

/**
 * Custom Hook for Dynamic Announcements
 * Announces messages to screen readers programmatically
 */
export function useAnnounce() {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = (
    message: string,
    politeness: "polite" | "assertive" = "polite",
  ) => {
    if (announceRef.current) {
      // Clear previous message
      announceRef.current.textContent = "";

      // Set new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = message;
          announceRef.current.setAttribute("aria-live", politeness);
        }
      }, 100);
    }
  };

  return { announce, announceRef };
}
