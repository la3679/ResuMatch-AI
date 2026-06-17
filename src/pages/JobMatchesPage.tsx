import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Briefcase, Target, Info } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { JobMatches } from '../components/jobs/JobMatches';
import { useAnalysis } from '../context/AnalysisContext';
import { useToast } from '../hooks/useToast';
import { matchJobs } from '../services/apiService';
import { ROUTES } from '../constants';

export function JobMatchesPage() {
  const { analysis, jobMatches, setJobMatches } = useAnalysis();
  const { notify } = useToast();
  const [isMatching, setIsMatching] = useState(false);

  if (!analysis) {
    return <Navigate to={ROUTES.analyze} replace />;
  }

  const runMatch = async () => {
    setIsMatching(true);
    try {
      setJobMatches(await matchJobs(analysis.parsedData.skills));
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to find matching roles.', 'error');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Recommended roles</h1>
        <p className="text-slate-500 mt-1">Sample roles ranked by how well they match your skills.</p>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-xl bg-slate-100 text-slate-500 text-sm">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          These are static <strong>sample roles</strong> for demonstration, not live job listings.
        </p>
      </div>

      {isMatching ? (
        <LoadingState title="Finding roles that match your skills…" />
      ) : jobMatches.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No matches yet"
          description="Run a match against your analyzed resume to see recommended roles."
          action={
            <Button onClick={runMatch} leftIcon={<Target className="w-4 h-4" />}>
              Find matching roles
            </Button>
          }
        />
      ) : (
        <JobMatches matches={jobMatches} />
      )}
    </PageContainer>
  );
}
