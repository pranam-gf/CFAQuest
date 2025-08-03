/**
 * Utility functions for handling context length data
 */

/**
 * Formats context length for display
 * @param contextLength - The context length in tokens
 * @returns Formatted string with appropriate units (K, M)
 */
export function formatContextLength(contextLength?: number): string {
  if (!contextLength) return "N/A";
  
  if (contextLength >= 1000000) {
    return `${(contextLength / 1000000).toFixed(1)}M`;
  } else if (contextLength >= 1000) {
    return `${(contextLength / 1000).toFixed(0)}K`;
  } else {
    return contextLength.toString();
  }
}

/**
 * Gets context length category for grouping/filtering
 * @param contextLength - The context length in tokens
 * @returns Category string
 */
export function getContextLengthCategory(contextLength?: number): string {
  if (!contextLength) return "Unknown";
  
  if (contextLength >= 1000000) return "1M+ tokens";
  if (contextLength >= 200000) return "200K+ tokens";
  if (contextLength >= 128000) return "128K+ tokens";
  if (contextLength >= 32000) return "32K+ tokens";
  if (contextLength >= 8000) return "8K+ tokens";
  return "< 8K tokens";
}

/**
 * Compares two context lengths for sorting
 * @param a - First context length
 * @param b - Second context length
 * @returns Comparison result for sorting
 */
export function compareContextLength(a?: number, b?: number): number {
  if (!a && !b) return 0;
  if (!a) return 1; // Put undefined values at the end
  if (!b) return -1;
  return b - a; // Descending order (largest first)
}

/**
 * Gets a color class based on context length for visual indicators
 * @param contextLength - The context length in tokens
 * @returns Tailwind color class
 */
export function getContextLengthColor(contextLength?: number): string {
  if (!contextLength) return "text-gray-500 dark:text-gray-400";
  
  if (contextLength >= 1000000) return "text-purple-600 dark:text-purple-400";
  if (contextLength >= 200000) return "text-blue-600 dark:text-blue-400";
  if (contextLength >= 128000) return "text-green-600 dark:text-green-400";
  if (contextLength >= 32000) return "text-yellow-600 dark:text-yellow-400";
  if (contextLength >= 8000) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}