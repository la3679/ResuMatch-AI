import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { SectionHeader } from '../common/SectionHeader';

/**
 * Prioritized AI improvement suggestions. The first item is highlighted as
 * "what to improve first".
 */
export function SuggestionsPanel({ suggestions }: { suggestions: string[] }) {
  const [first, ...rest] = suggestions;

  return (
    <Card className="space-y-4">
      <SectionHeader icon={Lightbulb} title="AI suggestions" description="Prioritized, most impactful first" />
      {suggestions.length === 0 ? (
        <p className="text-sm text-slate-500">No suggestions available.</p>
      ) : (
        <div className="space-y-3">
          {first && (
            <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-700 mb-1">
                Improve this first
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{first}</p>
            </div>
          )}
          <ul className="space-y-3">
            {rest.map((suggestion, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" aria-hidden />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
