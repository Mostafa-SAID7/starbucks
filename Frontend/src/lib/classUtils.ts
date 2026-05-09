/**
 * Utility functions for generating RTL/LTR-aware class names
 * Centralizes duplicated class name logic across components
 */

/**
 * Get text alignment class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @returns Tailwind class for text alignment
 */
export function getTextAlignClass(isRTL: boolean): string {
  return isRTL ? "text-right" : "text-left";
}

/**
 * Get items alignment class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @returns Tailwind class for items alignment
 */
export function getItemsAlignClass(isRTL: boolean): string {
  return isRTL ? "items-end" : "items-start";
}

/**
 * Get justify alignment class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @returns Tailwind class for justify alignment
 */
export function getJustifyClass(isRTL: boolean): string {
  return isRTL ? "justify-end" : "justify-start";
}

/**
 * Get margin class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @param size - Size of margin (e.g., 'l', 'r', 'x', 'y')
 * @returns Tailwind class for margin
 */
export function getMarginClass(
  isRTL: boolean,
  size: "l" | "r" | "x" | "y" | "t" | "b",
  amount: string = "4"
): string {
  if (size === "x" || size === "y" || size === "t" || size === "b") {
    return `m${size}-${amount}`;
  }

  // For left/right, swap based on direction
  const direction = isRTL && size === "l" ? "r" : isRTL && size === "r" ? "l" : size;
  return `m${direction}-${amount}`;
}

/**
 * Get padding class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @param size - Size of padding (e.g., 'l', 'r', 'x', 'y')
 * @returns Tailwind class for padding
 */
export function getPaddingClass(
  isRTL: boolean,
  size: "l" | "r" | "x" | "y" | "t" | "b",
  amount: string = "4"
): string {
  if (size === "x" || size === "y" || size === "t" || size === "b") {
    return `p${size}-${amount}`;
  }

  // For left/right, swap based on direction
  const direction = isRTL && size === "l" ? "r" : isRTL && size === "r" ? "l" : size;
  return `p${direction}-${amount}`;
}

/**
 * Get transform class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @param direction - Direction to translate ('l' or 'r')
 * @returns Tailwind class for transform
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
 * @param isRTL - Whether the text direction is RTL
 * @returns Tailwind class for flex direction
 */
export function getFlexDirectionClass(isRTL: boolean): string {
  return isRTL ? "flex-row-reverse" : "flex-row";
}

/**
 * Get space between class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @param size - Size of space (e.g., '2', '4', '6')
 * @returns Tailwind class for space between
 */
export function getSpaceBetweenClass(isRTL: boolean, size: string = "4"): string {
  return isRTL ? `space-x-reverse space-x-${size}` : `space-x-${size}`;
}

/**
 * Get gap class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @param size - Size of gap (e.g., '2', '4', '6')
 * @returns Tailwind class for gap
 */
export function getGapClass(isRTL: boolean, size: string = "4"): string {
  return `gap-${size}`;
}

/**
 * Get border radius class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @param position - Position of border radius ('l', 'r', 'tl', 'tr', 'bl', 'br')
 * @returns Tailwind class for border radius
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
 * @param isRTL - Whether the text direction is RTL
 * @returns Tailwind class for transform origin
 */
export function getOriginClass(isRTL: boolean): string {
  return isRTL ? "origin-right" : "origin-left";
}

/**
 * Get position class based on text direction
 * @param isRTL - Whether the text direction is RTL
 * @param position - Position ('l' or 'r')
 * @param amount - Amount (e.g., '0', '4', '8')
 * @returns Tailwind class for position
 */
export function getPositionClass(
  isRTL: boolean,
  position: "l" | "r",
  amount: string = "0"
): string {
  const actualPosition = isRTL && position === "l" ? "r" : isRTL && position === "r" ? "l" : position;
  return `${actualPosition}-${amount}`;
}
