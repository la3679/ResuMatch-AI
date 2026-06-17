import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Target } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { RequireAuthPrompt } from '../components/layout/RequireAuthPrompt';
import { ApplicationList } from '../components/applications/ApplicationList';
import { ApplicationDetailsModal } from '../components/applications/ApplicationDetailsModal';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useApplications } from '../hooks/useApplications';
import { ROUTES } from '../constants';
import type { ApplicationRecord, ApplicationStatus } from '../types/application';

export function ApplicationsPage() {
  const { user } = useAuth();
  const { items, loading, error, refresh, remove, setStatus } = useApplications();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ApplicationRecord | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      if (selected?.id === id) setSelected(null);
      notify('Application deleted.', 'info');
    } catch {
      notify('Failed to delete application.', 'error');
    }
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await setStatus(id, status);
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
      notify('Status updated.', 'success');
    } catch {
      notify('Failed to update status.', 'error');
    }
  };

  return (
    <PageContainer narrow>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My applications</h1>
        <p className="text-slate-500 mt-1">Track saved applications, cover letters, and their status.</p>
      </div>

      {!user ? (
        <RequireAuthPrompt description="Sign in to save and track your job applications." />
      ) : loading ? (
        <LoadingState title="Loading your applications…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No applications yet"
          description="Run a targeted scan and save it to start tracking your applications here."
          action={
            <Button onClick={() => navigate(ROUTES.scan)} leftIcon={<Target className="w-4 h-4" />}>
              Run a targeted scan
            </Button>
          }
        />
      ) : (
        <ApplicationList items={items} onSelect={setSelected} onDelete={handleDelete} />
      )}

      <ApplicationDetailsModal
        application={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </PageContainer>
  );
}
