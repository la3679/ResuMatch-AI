import { XCircle, PlusCircle, MinusCircle, Lightbulb, CheckCircle2, type LucideIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ScoreRing } from '../common/ScoreRing';
import { SectionHeader } from '../common/SectionHeader';
import type { TargetedAnalysis } from '../../types/resume';

interface ListSectionProps {
  icon: LucideIcon;
  title: string;
  items: string[];
  emptyText: string;
  bullet?: 'add' | 'remove';
}

function ListSection({ icon, title, items, emptyText, bullet }: ListSectionProps) {
  const BulletIcon = bullet === 'remove' ? MinusCircle : bullet === 'add' ? CheckCircle2 : CheckCircle2;
  const bulletColor = bullet === 'remove' ? 'text-amber-500' : 'text-emerald-500';
  return (
    <Card className="space-y-4">
      <SectionHeader icon={icon} title={title} />
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
              <BulletIcon className={`w-4 h-4 shrink-0 mt-0.5 ${bulletColor}`} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** Renders the targeted-scan analysis: score, missing keywords, add/remove, suggestions. */
export function TargetedScanResults({ analysis }: { analysis: TargetedAnalysis }) {
  return (
    <div className="space-y-6">
      <Card className="flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing value={analysis.matchScore} size={120} label="Match score" />
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold text-slate-900">How well you match this role</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md">
            Based on how strongly your resume evidences this job's requirements. Use the suggestions
            below to close the gap before you apply.
          </p>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionHeader icon={XCircle} title="Missing keywords" description="Required terms absent from your resume" />
        {analysis.missingKeywords.length === 0 ? (
          <p className="text-sm text-emerald-600">No critical keywords missing — strong alignment.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((k) => (
              <Badge key={k} tone="danger">
                {k}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListSection
          icon={PlusCircle}
          title="What to add"
          items={analysis.toAdd}
          emptyText="No additions suggested."
          bullet="add"
        />
        <ListSection
          icon={MinusCircle}
          title="What to remove"
          items={analysis.toRemove}
          emptyText="Nothing to remove."
          bullet="remove"
        />
      </div>

      <ListSection
        icon={Lightbulb}
        title="Tailoring suggestions"
        items={analysis.suggestions}
        emptyText="No suggestions available."
        bullet="add"
      />
    </div>
  );
}
