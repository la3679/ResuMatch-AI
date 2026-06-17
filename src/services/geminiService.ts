/**
 * @deprecated AI calls now run server-side. This module is a thin
 * compatibility shim that re-exports the backend-backed API functions and the
 * shared types. Import from `./apiService` and `../types/resume` directly in
 * new code.
 */
export type { ResumeAnalysis, TargetedAnalysis } from '../types/resume';
export {
  analyzeResume,
  analyzeResumeAgainstJob,
  generateCoverLetter,
} from './apiService';
