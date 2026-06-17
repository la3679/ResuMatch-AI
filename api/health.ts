import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePreflight } from '../server/lib/http.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (handlePreflight(req, res)) return;
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'resumatch-ai',
  });
}
