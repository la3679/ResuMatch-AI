import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { ApiError } from '../lib/errors';
import { generateCoverLetter } from '../services/geminiService';

const router = Router();

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError(400, `"${field}" is required.`);
  }
  return value;
}

// POST /api/v1/cover-letter/generate
router.post(
  '/generate',
  asyncHandler(async (req, res) => {
    const resumeText = requireString(req.body?.resumeText, 'resumeText');
    const jobDescription = requireString(req.body?.jobDescription, 'jobDescription');
    const companyName = requireString(req.body?.companyName, 'companyName');
    const jobTitle = requireString(req.body?.jobTitle, 'jobTitle');

    const coverLetter = await generateCoverLetter(
      resumeText,
      jobDescription,
      companyName,
      jobTitle,
    );
    res.json({ coverLetter });
  }),
);

export default router;
