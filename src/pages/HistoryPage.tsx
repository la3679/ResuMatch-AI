import { useNavigate } from 'react-router-dom';
import { Clock, Sparkles } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { RequireAuthPrompt } from '../components/layout/RequireAuthPrompt';
import { AnalysisHistory } from '../components/history/AnalysisHistory';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useAnalysisHistory } from '../hooks/useAnalysisHistory';
import { useAnalysis } from '../context/AnalysisContext';
import { ROUTES } from '../constants';
import type { AnalysisRecord } from '../types/application';

export function HistoryPage() {
  const { user } = useAuth();
  const { items, loading, error, refresh, remove } = useAnalysisHistory();
  const { setResult } = useAnalysis();
  const { notify } = useToast();
  const navigate = useNavigate();

  const openAnalysis = (record: AnalysisRecord) => {
    setResult(
      {
        score: record.score,
        atsScore: record.atsScore,
        sectionScores: record.sectionScores,
        parsedData: record.parsedData,
        missingKeywords: record.missingKeywords,
        suggestions: record.suggestions,
      },
      record.filename,
    );
    navigate(ROUTES.dashboard);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      notify('Analysis deleted.', 'info');
    } catch {
      notify('Failed to delete analysis.', 'error');
    }
  };

  return (
    <PageContainer narrow>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Analysis history</h1>
        <p className="text-slate-500 mt-1">Revisit and reopen your past resume analyses.</p>
      </div>

      {!user ? (
        <RequireAuthPrompt description="Sign in to view and manage your saved resume analyses." />
      ) : loading ? (
        <LoadingState title="Loading your history…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No analyses yet"
          description="Analyze a resume and it will be saved here automatically."
          action={
            <Button onClick={() => navigate(ROUTES.analyze)} leftIcon={<Sparkles className="w-4 h-4" />}>
              Analyze a resume
            </Button>
          }
        />
      ) : (
        <AnalysisHistory items={items} onSelect={openAnalysis} onDelete={handleDelete} />
      )}
    </PageContainer>
  );
}
