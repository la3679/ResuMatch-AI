import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { MAX_FILE_SIZE_LABEL } from './constants';

/** An error carrying an HTTP status code and a client-safe message. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Centralized Express error handler returning a consistent `{ error }` body. */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
