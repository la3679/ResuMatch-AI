import { APPLICATION_STATUSES } from '../../constants';
import type { ApplicationStatus } from '../../types/application';
import { cn } from '../../lib/utils';

const META = Object.fromEntries(
  APPLICATION_STATUSES.map((s) => [s.value, s]),
) as Record<ApplicationStatus, (typeof APPLICATION_STATUSES)[number]>;

/** Colored pill representing an application's status. */
export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = META[status] ?? META.saved;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border', meta.className)}>
      {meta.label}
    </span>
  );
}
