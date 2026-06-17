import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePreflight, sendError, fail, requireString } from '../../server/lib/http';
import { analyzeResume } from '../../server/services/geminiService';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed.');

  try {
    const resumeText = requireString(req.body, 'resumeText');
    res.status(200).json(await analyzeResume(resumeText));
  } catch (err) {
    fail(res, err);
  }
}
