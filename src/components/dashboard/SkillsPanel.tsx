import { Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SectionHeader } from '../common/SectionHeader';

/** Displays the skills extracted from the resume. */
export function SkillsPanel({ skills }: { skills: string[] }) {
  return (
    <Card className="space-y-4">
      <SectionHeader icon={Sparkles} title="Extracted skills" description={`${skills.length} detected`} />
      {skills.length === 0 ? (
        <p className="text-sm text-slate-500">No skills were detected. Add a dedicated Skills section.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} tone="brand">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
