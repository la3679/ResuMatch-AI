import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { ROUTES } from '../constants';

export function NotFoundPage() {
  return (
    <PageContainer narrow>
      <div className="flex flex-col items-center text-center py-20">
        <div className="p-4 rounded-2xl bg-brand-50 text-brand-600 mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <p className="mt-2 text-slate-500">This page doesn't exist.</p>
        <Link to={ROUTES.home} className="mt-6">
          <Button>Back to home</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
