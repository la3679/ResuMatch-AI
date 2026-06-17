import { UploadCloud, Sparkles, Target, Send } from 'lucide-react';

const STEPS = [
  { icon: UploadCloud, title: 'Upload your resume', description: 'Drop in a PDF or DOCX. We extract the text instantly — no account needed.' },
  { icon: Sparkles, title: 'Get your AI analysis', description: 'Receive an overall score, ATS score, section breakdown, and prioritized fixes.' },
  { icon: Target, title: 'Scan against a job', description: 'Paste a job description to see your match score and tailoring suggestions.' },
  { icon: Send, title: 'Apply & track', description: 'Generate a cover letter, then save and track applications when signed in.' },
];

export function HowItWorks() {
  return (
    <section className="bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
          <p className="mt-3 text-slate-500">From upload to application in four simple steps.</p>
        </div>

        <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 text-white">
                  <step.icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-bold text-brand-600">Step {i + 1}</span>
              </div>
              <h3 className="font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
