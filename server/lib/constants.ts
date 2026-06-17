/**
 * Maximum resume upload size in bytes (kept in sync with the client).
 * Capped at 4MB to stay under Vercel's ~4.5MB serverless request-body limit.
 */
export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

/** Human-readable maximum file size. */
export const MAX_FILE_SIZE_LABEL = '4MB';

/** Accepted upload extensions. */
export const ACCEPTED_EXTENSIONS = ['pdf', 'docx'] as const;
