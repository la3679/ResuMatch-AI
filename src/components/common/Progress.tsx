import { cn } from '../../lib/utils';

interface ProgressProps {
  /** 0-100. */
  value: number;
  className?: string;
  /** Bar color tone derived from the value when omitted. */
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  label?: string;
}

function toneForValue(value: number): NonNullable<ProgressProps['tone']> {
  if (value >= 80) return 'success';
  if (value >= 60) return 'brand';
  if (value >= 40) return 'warning';
  return 'danger';
}

const TONE_BG: Record<NonNullable<ProgressProps['tone']>, string> = {
  brand: 'bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
};

/** Horizontal progress/score bar with accessible value semantics. */
export function Progress({ value, className, tone, label }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const resolvedTone = tone ?? toneForValue(clamped);

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between mb-1.5 text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <span className="font-semibold text-slate-900">{clamped}</span>
        </div>
      )}
      <div
        className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-700', TONE_BG[resolvedTone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
