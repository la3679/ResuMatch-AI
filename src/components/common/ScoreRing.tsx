import { cn } from '../../lib/utils';

interface ScoreRingProps {
  /** 0-100. */
  value: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Override the auto-derived color. */
  color?: string;
}

function colorForValue(value: number): string {
  if (value >= 80) return '#10b981'; // emerald
  if (value >= 60) return '#4f46e5'; // brand
  if (value >= 40) return '#f59e0b'; // amber
  return '#f43f5e'; // rose
}

/** Circular score gauge rendered with SVG (no chart dependency). */
export function ScoreRing({
  value,
  label,
  size = 120,
  strokeWidth = 10,
  className,
  color,
}: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const stroke = color ?? colorForValue(clamped);

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label ?? 'Score'}: ${clamped} out of 100`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-900">{clamped}</span>
          <span className="text-[10px] font-medium text-slate-400">/ 100</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-slate-600">{label}</span>}
    </div>
  );
}
