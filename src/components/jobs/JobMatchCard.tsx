import { Briefcase, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Progress } from '../common/Progress';
import type { JobMatch } from '../../types/job';

/** A single recommended-role card showing match score and skill gap. */
export function JobMatchCard({ match }: { match: JobMatch }) {
  const { job, match_percentage, matched_skills, missing_skills } = match;

  return (
    <Card className="flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="p-3 bg-brand-50 text-brand-600 rounded-xl shrink-0">
            <Briefcase className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 leading-tight">{job.title}</h3>
            <p className="text-sm text-slate-500">{job.company}</p>
            <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <MapPin className="w-3 h-3" /> {job.location} · {job.type}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-extrabold text-brand-600">{match_percentage}%</div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Match</p>
        </div>
      </div>

      <Progress value={match_percentage} />

      <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>

      {matched_skills.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-2">
            Matched skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {matched_skills.map((skill) => (
              <Badge key={skill} tone="success">
                <CheckCircle2 className="w-3 h-3" /> {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {missing_skills.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-rose-500 mb-2">
            Skills to develop
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {missing_skills.map((skill) => (
              <Badge key={skill} tone="danger">
                <XCircle className="w-3 h-3" /> {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
