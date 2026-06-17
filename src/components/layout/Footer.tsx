import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="p-1.5 bg-brand-600 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-bold">ResuMatch AI</span>
          </div>
          <p className="text-sm text-slate-400 text-center">
            © {new Date().getFullYear()} ResuMatch AI · AI-powered career optimization · Powered by Google Gemini
          </p>
        </div>
      </div>
    </footer>
  );
}
