import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { ResumeAnalysis } from '../types/resume';
import type {
  AnalysisRecord,
  ApplicationRecord,
  ApplicationStatus,
  NewApplicationInput,
} from '../types/application';

const ANALYSES = 'analyses';
const APPLICATIONS = 'applications';

/** Saves a resume analysis for the signed-in user. */
export async function saveAnalysis(
  userId: string,
  filename: string,
  analysis: ResumeAnalysis,
): Promise<void> {
  await addDoc(collection(db, ANALYSES), {
    userId,
    filename,
    score: analysis.score,
    atsScore: analysis.atsScore,
    sectionScores: analysis.sectionScores,
    parsedData: analysis.parsedData,
    missingKeywords: analysis.missingKeywords,
    suggestions: analysis.suggestions,
    createdAt: Timestamp.now(),
  });
}

/** Fetches all resume analyses for a user, newest first. */
export async function fetchAnalyses(userId: string): Promise<AnalysisRecord[]> {
  const q = query(
    collection(db, ANALYSES),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as AnalysisRecord);
}

/** Deletes a single analysis document by id. */
export async function deleteAnalysis(id: string): Promise<void> {
  await deleteDoc(doc(db, ANALYSES, id));
}

/** Saves a targeted application for the signed-in user. */
export async function saveApplication(input: NewApplicationInput): Promise<void> {
  await addDoc(collection(db, APPLICATIONS), {
    ...input,
    status: input.status ?? 'saved',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

/** Fetches all applications for a user, newest first. */
export async function fetchApplications(userId: string): Promise<ApplicationRecord[]> {
  const q = query(
    collection(db, APPLICATIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return { id: d.id, status: 'saved', ...data } as ApplicationRecord;
  });
}

/** Updates the status of an application document. */
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  await updateDoc(doc(db, APPLICATIONS, id), {
    status,
    updatedAt: Timestamp.now(),
  });
}

/** Deletes a single application document by id. */
export async function deleteApplication(id: string): Promise<void> {
  await deleteDoc(doc(db, APPLICATIONS, id));
}
