import { BarChart3 } from 'lucide-react';
import { Card } from '../common/Card';
import { Progress } from '../common/Progress';
import { SectionHeader } from '../common/SectionHeader';
import type { SectionScores as SectionScoresType } from '../../types/resume';

const LABELS: { key: keyof SectionScoresType; label: string }[] = [
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'projects', label: 'Projects' },
  { key: 'formatting', label: 'Formatting' },
];

/** Per-section score breakdown as labeled progress bars. */
export function SectionScores({ scores }: { scores: SectionScoresType }) {
  return (
    <Card className="space-y-5">
      <SectionHeader icon={BarChart3} title="Section breakdown" description="Quality score per resume section" />
      <div className="space-y-4">
        {LABELS.map(({ key, label }) => (
          <Progress key={key} label={label} value={scores[key]} />
        ))}
      </div>
    </Card>
  );
}
