import { KeyRound } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SectionHeader } from '../common/SectionHeader';

/** Lists high-value keywords missing from the resume. */
export function KeywordGapPanel({ keywords }: { keywords: string[] }) {
  return (
    <Card className="space-y-4">
      <SectionHeader
        icon={KeyRound}
        title="Missing keywords"
        description="High-value terms recruiters and ATS look for"
      />
      {keywords.length === 0 ? (
        <p className="text-sm text-emerald-600">Great — no critical keywords appear to be missing.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <Badge key={keyword} tone="danger">
              {keyword}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
