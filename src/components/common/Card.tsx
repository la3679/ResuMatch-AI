import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

/** Surface container with consistent rounding, border, and soft shadow. */
export function Card({ className, padded = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 shadow-sm',
        padded && 'p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
