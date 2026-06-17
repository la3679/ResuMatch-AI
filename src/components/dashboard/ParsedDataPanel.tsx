import { Briefcase, GraduationCap, FolderGit2, type LucideIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { SectionHeader } from '../common/SectionHeader';
import type { ParsedResumeData } from '../../types/resume';

interface ListBlockProps {
  icon: LucideIcon;
  title: string;
  items: string[];
}

function ListBlock({ icon, title, items }: ListBlockProps) {
  return (
    <Card className="space-y-4">
      <SectionHeader icon={icon} title={title} description={`${items.length} item${items.length === 1 ? '' : 's'}`} />
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing detected for this section.</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** Summaries of experience, education, and projects parsed from the resume. */
export function ParsedDataPanel({ data }: { data: ParsedResumeData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ListBlock icon={Briefcase} title="Experience" items={data.experience} />
      <ListBlock icon={GraduationCap} title="Education" items={data.education} />
      <ListBlock icon={FolderGit2} title="Projects" items={data.projects} />
    </div>
  );
}
