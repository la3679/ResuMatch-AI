import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { ROUTES } from '../../constants';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-100 text-brand-700 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Google Gemini
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl">
            Land more interviews with an{' '}
            <span className="text-brand-600">AI-optimized resume</span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-2xl">
            Upload your resume for instant AI analysis and ATS scoring, scan it against any job
            description, generate tailored cover letters, and track your applications — all in one
            place.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
            <Link to={ROUTES.analyze}>
              <Button size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
                Analyze my resume
              </Button>
            </Link>
            <Link to={ROUTES.scan}>
              <Button size="lg" variant="secondary" leftIcon={<ArrowRight className="w-5 h-5" />}>
                Run a targeted scan
              </Button>
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4" /> No sign-up required to analyze. Files are processed in
            memory, not stored.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
