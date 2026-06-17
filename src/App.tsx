import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { DashboardPage } from './pages/DashboardPage';
import { JobMatchesPage } from './pages/JobMatchesPage';
import { TargetedScanPage } from './pages/TargetedScanPage';
import { HistoryPage } from './pages/HistoryPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { AccountPage } from './pages/AccountPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ROUTES } from './constants';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.home} element={<LandingPage />} />
        <Route path={ROUTES.analyze} element={<AnalyzePage />} />
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.jobs} element={<JobMatchesPage />} />
        <Route path={ROUTES.scan} element={<TargetedScanPage />} />
        <Route path={ROUTES.history} element={<HistoryPage />} />
        <Route path={ROUTES.applications} element={<ApplicationsPage />} />
        <Route path={ROUTES.account} element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
