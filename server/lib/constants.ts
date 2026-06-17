/** Maximum resume upload size in bytes (kept in sync with the client). */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/** Human-readable maximum file size. */
export const MAX_FILE_SIZE_LABEL = '5MB';

/** Accepted upload extensions. */
export const ACCEPTED_EXTENSIONS = ['pdf', 'docx'] as const;
