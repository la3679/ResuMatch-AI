import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePreflight, sendError, fail } from '../../server/lib/http';
import { ApiError } from '../../server/lib/ApiError';
import { matchJobsToSkills } from '../../server/services/jobMatch';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed.');

  try {
    const skills = (req.body as { resume_skills?: unknown } | null)?.resume_skills;
    if (!Array.isArray(skills) || skills.some((s) => typeof s !== 'string')) {
      throw new ApiError(400, '"resume_skills" must be an array of strings.');
    }
    res.status(200).json(matchJobsToSkills(skills as string[]));
  } catch (err) {
    fail(res, err);
  }
}
