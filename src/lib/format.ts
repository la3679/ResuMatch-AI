import type { FirestoreDate } from '../types/application';

/** Safely converts a Firestore date value to a JS Date, or null. */
export function toDate(value: FirestoreDate): Date | null {
  if (!value) return null;
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof (value as { seconds?: number }).seconds === 'number') {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
}

/** Formats a Firestore date as a short, human-readable string. */
export function formatDate(value: FirestoreDate): string {
  const date = toDate(value);
  if (!date) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Triggers a client-side text file download. */
export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
