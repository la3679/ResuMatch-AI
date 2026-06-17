import { JobMatchCard } from './JobMatchCard';
import type { JobMatch } from '../../types/job';

/** Responsive grid of job-match cards. */
export function JobMatches({ matches }: { matches: JobMatch[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {matches.map((match) => (
        <JobMatchCard key={match.job.id} match={match} />
      ))}
    </div>
  );
}
