import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ResumeAnalysis } from '../types/resume';
import type { JobMatch } from '../types/job';

interface AnalysisContextValue {
  analysis: ResumeAnalysis | null;
  filename: string;
  resumeText: string;
  jobMatches: JobMatch[];
  /** Stores a fresh analysis (clears any stale job matches). */
  setResult: (analysis: ResumeAnalysis, filename: string, resumeText?: string) => void;
  setJobMatches: (matches: JobMatch[]) => void;
  reset: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

/** Holds the active resume analysis so it persists across routed pages. */
export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [filename, setFilename] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);

  const value = useMemo<AnalysisContextValue>(
    () => ({
      analysis,
      filename,
      resumeText,
      jobMatches,
      setResult: (next, name, text = '') => {
        setAnalysis(next);
        setFilename(name);
        setResumeText(text);
        setJobMatches([]);
      },
      setJobMatches,
      reset: () => {
        setAnalysis(null);
        setFilename('');
        setResumeText('');
        setJobMatches([]);
      },
    }),
    [analysis, filename, resumeText, jobMatches],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within an AnalysisProvider');
  return ctx;
}
