import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePreflight, sendError, fail, requireString } from '../../server/lib/http';
import { analyzeResumeAgainstJob } from '../../server/services/geminiService';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed.');

  try {
    const resumeText = requireString(req.body, 'resumeText');
    const jobDescription = requireString(req.body, 'jobDescription');
    res.status(200).json(await analyzeResumeAgainstJob(resumeText, jobDescription));
  } catch (err) {
    fail(res, err);
  }
}
