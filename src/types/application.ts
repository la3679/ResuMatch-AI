import type { Timestamp } from 'firebase/firestore';
import type { ResumeAnalysis, TargetedAnalysis } from './resume';

/**
 * Firestore `createdAt`/`updatedAt` values. Stored as a Firestore `Timestamp`,
 * but defensively typed since serialized reads can arrive as a plain object.
 */
export type FirestoreDate = Timestamp | { seconds: number; nanoseconds?: number } | null;

/** A saved resume analysis (Firestore `analyses` collection). */
export interface AnalysisRecord extends ResumeAnalysis {
  id: string;
  userId: string;
  filename: string;
  createdAt: FirestoreDate;
}

/** Application lifecycle status. */
export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected';

/** A saved targeted application (Firestore `applications` collection). */
export interface ApplicationRecord {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeFilename: string;
  coverLetter: string;
  analysis: TargetedAnalysis;
  status: ApplicationStatus;
  notes?: string;
  jobUrl?: string;
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
}

/** Payload required to create a new application record. */
export type NewApplicationInput = Omit<
  ApplicationRecord,
  'id' | 'createdAt' | 'updatedAt' | 'status'
> & {
  status?: ApplicationStatus;
};
