import { ApiError } from './ApiError';

/**
 * Parses JSON returned by an LLM, tolerating markdown code fences and
 * surrounding prose. Throws a client-safe {@link ApiError} if no valid JSON
 * object can be recovered.
 */
export function parseJsonResponse<T>(raw: string): T {
  let text = raw.trim();

  // Strip ```json ... ``` or ``` ... ``` fences.
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) text = fenced[1].trim();

  try {
    return JSON.parse(text) as T;
  } catch {
    // Fall back to the first balanced-looking object in the string.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1)) as T;
      } catch {
        /* fall through */
      }
    }
    throw new ApiError(502, 'The AI returned an unexpected response. Please try again.');
  }
}
