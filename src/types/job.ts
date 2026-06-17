/** A sample/recommended role used for skill-based job matching (static data). */
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  description: string;
}

/** A scored job match returned by `POST /api/v1/jobs/match`. */
export interface JobMatch {
  job: Job;
  /** Percentage of the role's skills present in the resume, 0-100. */
  match_percentage: number;
  /** Resume skills that the role requires (present). */
  matched_skills: string[];
  /** Role skills missing from the resume. */
  missing_skills: string[];
}
