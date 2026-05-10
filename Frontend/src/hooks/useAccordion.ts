import { useState, useCallback } from 'react';

/**
 * Custom hook for managing accordion state
 * Handles single or multiple open sections
 * 
 * @param defaultOpen - Initial open section ID (optional)
 * @param allowMultiple - Allow multiple sections open at once (default: false)
 * @returns Accordion state and handlers
 * 
 * @example
 * ```tsx
 * const { openSection, toggleSection, isOpen } = useAccordion('intro');
 * 
 * return (
 *   <>
 *     <button onClick={() => toggleSection('section1')}>
 *       Section 1
 *     </button>
 *     {isOpen('section1') && <div>Content</div>}
 *   </>
 * );
 * ```
 */
export function useAccordion(defaultOpen?: string, allowMultiple: boolean = false) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    defaultOpen ? new Set([defaultOpen]) : new Set()
  );

  /**
   * Toggle a section open/closed
   */
  const toggleSection = useCallback((sectionId: string) => {
    setOpenSections((prev: Set<string>) => {
      const newSet = new Set<string>(prev);

      if (allowMultiple) {
        // Multiple mode: toggle individual section
        if (newSet.has(sectionId)) {
          newSet.delete(sectionId);
        } else {
          newSet.add(sectionId);
        }
      } else {
        // Single mode: close others when opening new one
        if (newSet.has(sectionId)) {
          newSet.delete(sectionId);
        } else {
          newSet.clear();
          newSet.add(sectionId);
        }
      }

      return newSet;
    });
  }, [allowMultiple]);

  /**
   * Check if a section is open
   */
  const isOpen = useCallback(
    (sectionId: string) => openSections.has(sectionId),
    [openSections]
  );

  /**
   * Open a specific section
   */
  const openSection = useCallback(
    (sectionId: string) => {
      setOpenSections((prev: Set<string>) => {
        const newSet = allowMultiple ? new Set<string>(prev) : new Set<string>();
        newSet.add(sectionId);
        return newSet;
      });
    },
    [allowMultiple]
  );

  /**
   * Close a specific section
   */
  const closeSection = useCallback((sectionId: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
  }, []);

  /**
   * Close all sections
   */
  const closeAll = useCallback(() => {
    setOpenSections(new Set());
  }, []);

  /**
   * Open all sections (only in multiple mode)
   */
  const openAll = useCallback(
    (sectionIds: string[]) => {
      if (allowMultiple) {
        setOpenSections(new Set(sectionIds));
      }
    },
    [allowMultiple]
  );

  return {
    openSections,
    toggleSection,
    isOpen,
    openSection,
    closeSection,
    closeAll,
    openAll,
  };
}
