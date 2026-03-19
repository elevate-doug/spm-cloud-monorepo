/**
 * Truncates a string to a specified maximum length, adding an ellipsis if the string is longer.
 * @param text The string to truncate.
 * @param maxLength The maximum length of the string. Defaults to 30.
 * @returns The truncated string.
 */
export function truncateText(text: string | undefined, maxLength = 30): string {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}
