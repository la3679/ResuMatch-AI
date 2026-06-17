import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

/** Centered spinner with an optional message for in-progress views. */
export function LoadingState({ title = 'Loading…', description, className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16', className)}>
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" aria-hidden />
      <p className="text-slate-700 font-medium" role="status">
        {title}
      </p>
      {description && <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>}
    </div>
  );
}

/** Rectangular shimmer placeholder. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />;
}
