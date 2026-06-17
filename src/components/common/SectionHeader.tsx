import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Consistent heading row with optional icon, description, and action. */
export function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 shrink-0">
            <Icon className="w-5 h-5" aria-hidden />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 leading-tight">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
