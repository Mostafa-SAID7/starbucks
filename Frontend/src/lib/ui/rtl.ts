/**
 * Utility functions for generating RTL/LTR-aware class names
 * Centralizes duplicated class name logic across components
 */

/**
 * Get text alignment class based on text direction
 */
export function getTextAlignClass(isRTL: boolean): string {
  return isRTL ? "text-right" : "text-left";
}

/**
 * Get items alignment class based on text direction
 */
export function getItemsAlignClass(isRTL: boolean): string {
  return isRTL ? "items-end" : "items-start";
}

/**
 * Get justify alignment class based on text direction
 */
export function getJustifyClass(isRTL: boolean): string {
  return isRTL ? "justify-end" : "justify-start";
}

/**
 * Get margin class based on text direction
 */
export function getMarginClass(
  isRTL: boolean,
  size: "l" | "r" | "x" | "y" | "t" | "b",
  amount: string = "4"
): string {
  if (size === "x" || size === "y" || size === "t" || size === "b") {
    return `m${size}-${amount}`;
  }
  const direction = isRTL && size === "l" ? "r" : isRTL && size === "r" ? "l" : size;
  return `m${direction}-${amount}`;
}

/**
 * Get padding class based on text direction
 */
export function getPaddingClass(
  isRTL: boolean,
  size: "l" | "r" | "x" | "y" | "t" | "b",
  amount: string = "4"
): string {
  if (size === "x" || size === "y" || size === "t" || size === "b") {
    return `p${size}-${amount}`;
  }
  const direction = isRTL && size === "l" ? "r" : isRTL && size === "r" ? "l" : size;
  return `p${direction}-${amount}`;
}

/**
 * Get transform class based on text direction
 */
export function getTranslateClass(
  isRTL: boolean,
  direction: "l" | "r",
  amount: string = "full"
): string {
  const actualDirection = isRTL && direction === "l" ? "r" : isRTL && direction === "r" ? "l" : direction;
  return `translate-${actualDirection === "l" ? "x" : "x"}-${actualDirection === "l" ? "-" : ""}${amount}`;
}

/**
 * Get flex direction class based on text direction
 */
export function getFlexDirectionClass(isRTL: boolean): string {
  return isRTL ? "flex-row-reverse" : "flex-row";
}

/**
 * Get space between class based on text direction
 */
export function getSpaceBetweenClass(isRTL: boolean, size: string = "4"): string {
  return isRTL ? `space-x-reverse space-x-${size}` : `space-x-${size}`;
}

/**
 * Get gap class based on text direction
 */
export function getGapClass(isRTL: boolean, size: string = "4"): string {
  return `gap-${size}`;
}

/**
 * Get border radius class based on text direction
 */
export function getBorderRadiusClass(
  isRTL: boolean,
  position: "l" | "r" | "tl" | "tr" | "bl" | "br",
  amount: string = "lg"
): string {
  if (position === "l") {
    return isRTL ? `rounded-r-${amount}` : `rounded-l-${amount}`;
  }
  if (position === "r") {
    return isRTL ? `rounded-l-${amount}` : `rounded-r-${amount}`;
  }
  return `rounded-${position}-${amount}`;
}

/**
 * Get origin class based on text direction
 */
export function getOriginClass(isRTL: boolean): string {
  return isRTL ? "origin-right" : "origin-left";
}

/**
 * Get position class based on text direction
 */
export function getPositionClass(
  isRTL: boolean,
  position: "l" | "r",
  amount: string = "0"
): string {
  const actualPosition = isRTL && position === "l" ? "r" : isRTL && position === "r" ? "l" : position;
  return `${actualPosition}-${amount}`;
}
