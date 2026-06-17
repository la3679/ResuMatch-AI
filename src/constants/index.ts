import type { ApplicationStatus } from '../types/application';

/** Accepted resume file extensions (PDF + DOCX, matching backend support). */
export const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.docx'] as const;

/** Accepted MIME types for resume uploads. */
export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/** `accept` attribute value for file inputs. */
export const FILE_INPUT_ACCEPT = ACCEPTED_FILE_EXTENSIONS.join(',');

/** Maximum resume upload size, in bytes (matches the serverless body limit). */
export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

/** Human-readable maximum file size. */
export const MAX_FILE_SIZE_LABEL = '4MB';

/** Application status options with display metadata. */
export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  className: string;
}[] = [
  { value: 'saved', label: 'Saved', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'applied', label: 'Applied', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'interviewing', label: 'Interviewing', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'offer', label: 'Offer', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'rejected', label: 'Rejected', className: 'bg-rose-50 text-rose-700 border-rose-200' },
];

/** App route paths used across navigation. */
export const ROUTES = {
  home: '/',
  analyze: '/analyze',
  dashboard: '/dashboard',
  jobs: '/jobs',
  scan: '/scan',
  history: '/history',
  applications: '/applications',
  account: '/account',
} as const;
