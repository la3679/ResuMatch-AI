import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { MAX_FILE_SIZE_LABEL } from './constants';
import { ApiError } from './ApiError';

// Re-export so existing `import { ApiError } from './errors'` paths keep working.
export { ApiError };

/** Centralized Express error handler returning a consistent `{ error }` body. */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // `next` is required so Express recognizes this as an error handler (arity 4).
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.` });
    }
    return res.status(400).json({ error: 'File upload failed. Please try again.' });
  }

  console.error('[error]', err instanceof Error ? err.message : err);
  return res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
};
