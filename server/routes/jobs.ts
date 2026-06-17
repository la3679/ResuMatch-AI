import { Router } from 'express';
import { ApiError } from '../lib/errors';
import { matchJobsToSkills } from '../services/jobMatch';

const router = Router();

// POST /api/v1/jobs/match — score sample roles against resume skills.
router.post('/match', (req, res) => {
  const { resume_skills } = req.body ?? {};
  if (!Array.isArray(resume_skills) || resume_skills.some((s) => typeof s !== 'string')) {
    throw new ApiError(400, '"resume_skills" must be an array of strings.');
  }
  res.json(matchJobsToSkills(resume_skills));
});

export default router;
