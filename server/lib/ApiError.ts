/**
 * An error carrying an HTTP status code and a client-safe message.
 *
 * Kept dependency-free (no express/multer imports) so it can be reused from
 * both the Express dev server and Vercel serverless functions without
 * bloating bundles.
 */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
