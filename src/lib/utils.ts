
/**
 * Utility for client-side input sanitization.
 * Prevents basic XSS and ensures only relevant characters are submitted.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  
  // 1. Remove HTML tags
  let sanitized = input.replace(/<[^>]*>?/gm, "");
  
  // 2. Restrict to alphanumeric, spaces, and basic punctuation
  // This helps prevent prompt injection and PII leakage (like emails/phones)
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-\.\(\)]/g, "");
  
  // 3. Trim whitespace
  return sanitized.trim().slice(0, 100); // Also cap length to prevent abuse
}
