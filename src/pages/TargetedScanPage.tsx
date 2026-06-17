import { useState } from 'react';
import { ArrowLeft, Target, FileText } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { Tabs, type TabItem } from '../components/common/Tabs';
import { TargetedScanForm, type TargetedScanValues } from '../components/targeted/TargetedScanForm';
import { TargetedScanResults } from '../components/targeted/TargetedScanResults';
import { CoverLetterEditor } from '../components/targeted/CoverLetterEditor';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  uploadResume,
  analyzeResumeAgainstJob,
  generateCoverLetter,
} from '../services/apiService';
import { saveApplication } from '../services/firebaseService';
import type { TargetedAnalysis } from '../types/resume';

interface ScanContext {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeFilename: string;
  resumeText: string;
}

const TABS: TabItem[] = [
  { id: 'insights', label: 'Insights', icon: <Target className="w-4 h-4" /> },
  { id: 'cover', label: 'Cover Letter', icon: <FileText className="w-4 h-4" /> },
];

export function TargetedScanPage() {
  const { user } = useAuth();
  const { notify } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<TargetedAnalysis | null>(null);
  const [ctx, setCtx] = useState<ScanContext | null>(null);
  const [activeTab, setActiveTab] = useState('insights');

  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const runScan = async (values: TargetedScanValues) => {
    setIsSubmitting(true);
    try {
      const { text, filename } = await uploadResume(values.file);
      const result = await analyzeResumeAgainstJob(text, values.jobDescription);
      setAnalysis(result);
      setCtx({
        companyName: values.companyName,
        jobTitle: values.jobTitle,
        jobDescription: values.jobDescription,
        resumeFilename: filename,
        resumeText: text,
      });
      setCoverLetter('');
      setActiveTab('insights');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'The targeted scan failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = async () => {
    if (!ctx) return;
    setIsGenerating(true);
    try {
      const letter = await generateCoverLetter(
        ctx.resumeText,
        ctx.jobDescription,
        ctx.companyName,
        ctx.jobTitle,
      );
      setCoverLetter(letter);
      notify('Cover letter generated.', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to generate the cover letter.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!ctx || !analysis || !user) return;
    setIsSaving(true);
    try {
      await saveApplication({
        userId: user.uid,
        companyName: ctx.companyName,
        jobTitle: ctx.jobTitle,
        jobDescription: ctx.jobDescription,
        resumeFilename: ctx.resumeFilename,
        coverLetter,
        analysis,
      });
      notify('Application saved.', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save the application.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setCtx(null);
    setCoverLetter('');
  };

  return (
    <PageContainer narrow={!analysis}>
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Targeted job scan
        </h1>
        <p className="mt-3 text-slate-500">
          Compare your resume against a specific role to see your match score, keyword gaps, and a
          tailored cover letter.
        </p>
      </div>

      {!analysis || !ctx ? (
        <TargetedScanForm onSubmit={runScan} isSubmitting={isSubmitting} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" size="sm" onClick={reset} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              New scan
            </Button>
            <p className="text-sm text-slate-500 truncate">
              {ctx.jobTitle} · {ctx.companyName}
            </p>
          </div>

          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

          {activeTab === 'insights' ? (
            <TargetedScanResults analysis={analysis} />
          ) : (
            <CoverLetterEditor
              value={coverLetter}
              onChange={setCoverLetter}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onSave={handleSave}
              isSaving={isSaving}
              isSignedIn={Boolean(user)}
              companyName={ctx.companyName}
            />
          )}
        </div>
      )}
    </PageContainer>
  );
}
