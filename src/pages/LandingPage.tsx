import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Button } from '../components/common/Button';
import { ROUTES } from '../constants';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />

      {/* Privacy note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 flex flex-col md:flex-row items-start gap-6">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your data stays yours</h2>
            <p className="mt-2 text-slate-500 leading-relaxed max-w-2xl">
              Resumes are processed in memory to extract text and are never stored on our servers.
              AI requests run server-side, so API keys are never exposed to your browser. Saved
              analyses and applications are private to your account and accessible only to you.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-brand-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to optimize your resume?</h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Get your AI analysis and ATS score in seconds — no account required to start.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to={ROUTES.analyze}>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-brand-700 hover:bg-brand-50"
                leftIcon={<ArrowRight className="w-5 h-5" />}
              >
                Analyze my resume
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
