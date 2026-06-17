import {
  Gauge,
  ShieldCheck,
  Target,
  KeyRound,
  FileText,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '../common/Card';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Gauge,
    title: 'AI resume analysis',
    description: 'Overall score plus a breakdown across skills, experience, education, projects, and formatting.',
  },
  {
    icon: ShieldCheck,
    title: 'ATS compatibility',
    description: 'See how easily applicant tracking systems can parse and rank your resume.',
  },
  {
    icon: Target,
    title: 'Job description matching',
    description: 'Paste any role and get a match score with exactly what to add and remove.',
  },
  {
    icon: KeyRound,
    title: 'Keyword gap analysis',
    description: 'Surface the high-value keywords recruiters search for that your resume is missing.',
  },
  {
    icon: FileText,
    title: 'Cover letter generation',
    description: 'Generate, edit, and download a tailored cover letter for every application.',
  },
  {
    icon: Briefcase,
    title: 'Job match recommendations',
    description: 'Discover sample roles that fit your skills, with matched and missing skills highlighted.',
  },
];

export function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900">Everything you need to apply with confidence</h2>
        <p className="mt-3 text-slate-500">
          A complete toolkit for optimizing your resume and tailoring every application.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="hover:shadow-md transition-shadow">
            <div className="p-3 w-fit rounded-xl bg-brand-50 text-brand-600 mb-4">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
