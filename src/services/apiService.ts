import axios, { AxiosError } from 'axios';
import type { ResumeAnalysis, TargetedAnalysis } from '../types/resume';
import type { JobMatch } from '../types/job';
import type { UploadResult, CoverLetterResult, ApiErrorBody } from '../types/api';

const api = axios.create({ baseURL: '/api/v1' });

/**
 * Normalizes an Axios error into a user-friendly message, preferring the
 * `error` field the backend returns.
 */
function toApiError(err: unknown, fallback: string): Error {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<ApiErrorBody>;
    const serverMessage = axiosErr.response?.data?.error;
    if (serverMessage) return new Error(serverMessage);
    if (axiosErr.code === 'ERR_NETWORK') {
      return new Error('Could not reach the server. Please check your connection and try again.');
    }
  }
  if (err instanceof Error && err.message) return new Error(err.message);
  return new Error(fallback);
}

/** Uploads a resume file and returns the extracted plain text. */
export async function uploadResume(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<UploadResult>('/resume/upload', formData);
    return data;
  } catch (err) {
    throw toApiError(err, 'Failed to read your resume. Please try again.');
  }
}

/** Runs a full AI resume analysis on extracted resume text. */
export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  try {
    const { data } = await api.post<ResumeAnalysis>('/resume/analyze', { resumeText });
    return data;
  } catch (err) {
    throw toApiError(err, 'Failed to analyze your resume. Please try again.');
  }
}

/** Compares resume text against a job description. */
export async function analyzeResumeAgainstJob(
  resumeText: string,
  jobDescription: string,
): Promise<TargetedAnalysis> {
  try {
    const { data } = await api.post<TargetedAnalysis>('/resume/targeted-analysis', {
      resumeText,
      jobDescription,
    });
    return data;
  } catch (err) {
    throw toApiError(err, 'Failed to run the targeted scan. Please try again.');
  }
}

/** Generates a tailored cover letter. */
export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string,
  jobTitle: string,
): Promise<string> {
  try {
    const { data } = await api.post<CoverLetterResult>('/cover-letter/generate', {
      resumeText,
      jobDescription,
      companyName,
      jobTitle,
    });
    return data.coverLetter;
  } catch (err) {
    throw toApiError(err, 'Failed to generate the cover letter. Please try again.');
  }
}

/** Matches a list of resume skills against sample roles. */
export async function matchJobs(skills: string[]): Promise<JobMatch[]> {
  try {
    const { data } = await api.post<JobMatch[]>('/jobs/match', { resume_skills: skills });
    return data;
  } catch (err) {
    throw toApiError(err, 'Failed to find matching roles. Please try again.');
  }
}
