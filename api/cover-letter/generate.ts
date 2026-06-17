import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePreflight, sendError, fail, requireString } from '../../server/lib/http.js';
import { generateCoverLetter } from '../../server/services/geminiService.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed.');

  try {
    const resumeText = requireString(req.body, 'resumeText');
    const jobDescription = requireString(req.body, 'jobDescription');
    const companyName = requireString(req.body, 'companyName');
    const jobTitle = requireString(req.body, 'jobTitle');
    const coverLetter = await generateCoverLetter(resumeText, jobDescription, companyName, jobTitle);
    res.status(200).json({ coverLetter });
  } catch (err) {
    fail(res, err);
  }
}
