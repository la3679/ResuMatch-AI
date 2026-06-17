import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/** Inline error panel with an optional retry action. */
export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-rose-100 bg-rose-50"
    >
      <div className="p-3 rounded-xl bg-white text-rose-600 mb-3">
        <AlertCircle className="w-7 h-7" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-rose-800">{title}</h3>
      <p className="mt-1 text-sm text-rose-600 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
