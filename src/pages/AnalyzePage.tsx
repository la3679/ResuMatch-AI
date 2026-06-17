import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeUpload } from '../components/upload/ResumeUpload';
import { PageContainer } from '../components/layout/PageContainer';
import { ErrorState } from '../components/common/ErrorState';
import { useAnalysis } from '../context/AnalysisContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { uploadResume, analyzeResume } from '../services/apiService';
import { saveAnalysis } from '../services/firebaseService';
import { ROUTES } from '../constants';

export function AnalyzePage() {
  const navigate = useNavigate();
  const { setResult } = useAnalysis();
  const { user } = useAuth();
  const { notify } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('Processing your resume…');
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      setLoadingLabel('Extracting text from your resume…');
      const { text, filename } = await uploadResume(file);

      setLoadingLabel('Analyzing with AI…');
      const analysis = await analyzeResume(text);
      setResult(analysis, filename, text);

      if (user) {
        try {
          await saveAnalysis(user.uid, filename, analysis);
          notify('Analysis saved to your history.', 'success');
        } catch {
          notify('Analyzed, but saving to history failed.', 'error');
        }
      }

      navigate(ROUTES.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process your resume.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Analyze your resume
        </h1>
        <p className="mt-3 text-slate-500">
          Upload your resume to get an instant AI analysis, ATS score, and prioritized improvements.
          {!user && ' Sign in to save your history.'}
        </p>
      </div>

      <ResumeUpload onUpload={handleUpload} isLoading={isLoading} loadingLabel={loadingLabel} />

      {error && (
        <div className="max-w-xl mx-auto mt-6">
          <ErrorState message={error} />
        </div>
      )}
    </PageContainer>
  );
}
