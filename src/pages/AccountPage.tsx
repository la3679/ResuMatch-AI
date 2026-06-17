import { LogOut, Mail, History as HistoryIcon, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RequireAuthPrompt } from '../components/layout/RequireAuthPrompt';
import { useAuth } from '../hooks/useAuth';
import { useAnalysisHistory } from '../hooks/useAnalysisHistory';
import { useApplications } from '../hooks/useApplications';
import { ROUTES } from '../constants';

export function AccountPage() {
  const { user, logOut } = useAuth();
  const { items: analyses } = useAnalysisHistory();
  const { items: applications } = useApplications();

  if (!user) {
    return (
      <PageContainer narrow>
        <RequireAuthPrompt description="Sign in to view your account and saved data." />
      </PageContainer>
    );
  }

  return (
    <PageContainer narrow>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Account</h1>

      <Card className="flex flex-col sm:flex-row sm:items-center gap-5">
        <img
          src={user.photoURL ?? ''}
          alt={user.displayName ?? 'Profile'}
          className="w-16 h-16 rounded-full border border-slate-200 bg-slate-100"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-900">{user.displayName ?? 'Signed in'}</h2>
          {user.email && (
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
          )}
        </div>
        <Button variant="secondary" onClick={() => void logOut()} leftIcon={<LogOut className="w-4 h-4" />}>
          Sign out
        </Button>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Link to={ROUTES.history}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
                <HistoryIcon className="w-5 h-5" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">{analyses.length}</span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">Saved analyses</h3>
            <p className="text-sm text-slate-500">View your resume analysis history</p>
          </Card>
        </Link>

        <Link to={ROUTES.applications}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">{applications.length}</span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">Saved applications</h3>
            <p className="text-sm text-slate-500">Track your applications and cover letters</p>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}
