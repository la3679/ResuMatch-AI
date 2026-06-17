import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ApiError } from './ApiError.js';

/**
 * Shared helpers for Vercel serverless API routes (kept out of the `/api`
 * directory so Vercel never treats this as a route).
 */

/** Apply permissive CORS headers (same-origin in prod; helps local tooling). */
export function applyCors(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Apply CORS and short-circuit OPTIONS preflight requests.
 * Returns `true` if the request was handled (caller should return).
 */
export function handlePreflight(req: VercelRequest, res: VercelResponse): boolean {
  applyCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

/** Send a JSON error body with the given status. */
export function sendError(res: VercelResponse, status: number, message: string): void {
  res.status(status).json({ error: message });
}

/** Map an unknown error to a client-safe JSON response. */
export function fail(res: VercelResponse, err: unknown): void {
  if (err instanceof ApiError) {
    sendError(res, err.status, err.message);
    return;
  }
  console.error('[api error]', err instanceof Error ? err.message : err);
  sendError(res, 500, 'Something went wrong on the server. Please try again.');
}

/** Validate that a request-body field is a non-empty string. */
export function requireString(body: unknown, field: string): string {
  const value = (body as Record<string, unknown> | null | undefined)?.[field];
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError(400, `"${field}" is required.`);
  }
  return value;
}
