import { JOBS } from '../data/jobs';
import type { JobMatch } from '../../src/types/job';

/** Lowercases, trims, and de-duplicates a list of skills. */
function normalizeSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  for (const skill of skills) {
    const norm = skill.trim().toLowerCase();
    if (norm) seen.add(norm);
  }
  return [...seen];
}

/** True when a job skill is present in the resume skills (with partial matches). */
function hasSkill(resumeSkills: string[], jobSkill: string): boolean {
  const target = jobSkill.trim().toLowerCase();
  return resumeSkills.some(
    (rs) => rs === target || rs.includes(target) || target.includes(rs),
  );
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Scores every sample role against the resume skills and returns the top
 * matches sorted by percentage. Results are static sample roles.
 */
export function matchJobsToSkills(rawSkills: string[], limit = 6): JobMatch[] {
  const resumeSkills = normalizeSkills(rawSkills);

  const scored: JobMatch[] = JOBS.map((job) => {
    const matched_skills: string[] = [];
    const missing_skills: string[] = [];

    for (const jobSkill of job.skills) {
      if (hasSkill(resumeSkills, jobSkill)) matched_skills.push(jobSkill);
      else missing_skills.push(jobSkill);
    }

    const pct = job.skills.length ? (matched_skills.length / job.skills.length) * 100 : 0;
    return { job, match_percentage: round1(pct), matched_skills, missing_skills };
  });

  return scored
    .sort((a, b) => b.match_percentage - a.match_percentage)
    .slice(0, limit);
}
