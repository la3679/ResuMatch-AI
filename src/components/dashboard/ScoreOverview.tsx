import { ShieldCheck, Gauge } from 'lucide-react';
import { ScoreRing } from '../common/ScoreRing';
import { Card } from '../common/Card';

interface ScoreOverviewProps {
  score: number;
  atsScore: number;
}

/** Hero score panel: overall resume score + ATS compatibility. */
export function ScoreOverview({ score, atsScore }: ScoreOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card className="flex items-center gap-6">
        <ScoreRing value={score} size={120} />
        <div>
          <div className="flex items-center gap-2 text-brand-600">
            <Gauge className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Overall Score</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 max-w-[200px]">
            A weighted measure of skills, experience, projects, formatting, and keywords.
          </p>
        </div>
      </Card>

      <Card className="flex items-center gap-6">
        <ScoreRing value={atsScore} size={120} />
        <div>
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">ATS Score</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 max-w-[200px]">
            How easily applicant tracking systems can parse and rank your resume.
          </p>
        </div>
      </Card>
    </div>
  );
}
