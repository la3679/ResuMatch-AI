/** Per-section quality scores produced by the AI resume analysis (0-100 each). */
export interface SectionScores {
  skills: number;
  experience: number;
  education: number;
  projects: number;
  formatting: number;
}

/** Structured content the AI extracted from the resume. */
export interface ParsedResumeData {
  skills: string[];
  experience: string[];
  education: string[];
  projects: string[];
}

/** Full resume analysis returned by `POST /api/v1/resume/analyze`. */
export interface ResumeAnalysis {
  /** Overall resume score, 0-100. */
  score: number;
  /** ATS (Applicant Tracking System) compatibility score, 0-100. */
  atsScore: number;
  sectionScores: SectionScores;
  parsedData: ParsedResumeData;
  missingKeywords: string[];
  suggestions: string[];
}

/** Targeted scan result returned by `POST /api/v1/resume/targeted-analysis`. */
export interface TargetedAnalysis {
  /** How well the resume matches the job description, 0-100. */
  matchScore: number;
  missingKeywords: string[];
  toAdd: string[];
  toRemove: string[];
  suggestions: string[];
}
