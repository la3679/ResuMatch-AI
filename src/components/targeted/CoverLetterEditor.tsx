import { Sparkles, Copy, Download, Save, RefreshCw, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { SectionHeader } from '../common/SectionHeader';
import { useToast } from '../../hooks/useToast';
import { downloadTextFile } from '../../lib/format';

interface CoverLetterEditorProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onSave: () => void;
  isSaving: boolean;
  isSignedIn: boolean;
  companyName: string;
}

/** Editable, downloadable AI cover letter with generate/regenerate/save. */
export function CoverLetterEditor({
  value,
  onChange,
  onGenerate,
  isGenerating,
  onSave,
  isSaving,
  isSignedIn,
  companyName,
}: CoverLetterEditorProps) {
  const { notify } = useToast();
  const hasContent = value.trim().length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      notify('Cover letter copied to clipboard.', 'success');
    } catch {
      notify('Could not copy to clipboard.', 'error');
    }
  };

  const handleDownload = () => {
    const safeCompany = companyName.trim().replace(/\s+/g, '_') || 'Cover_Letter';
    downloadTextFile(`Cover_Letter_${safeCompany}.txt`, value);
  };

  return (
    <Card className="space-y-4">
      <SectionHeader
        icon={FileText}
        title="Cover letter"
        description="Tailored to this role — edit before saving or downloading"
        action={
          hasContent ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onGenerate}
              isLoading={isGenerating}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Regenerate
            </Button>
          ) : undefined
        }
      />

      {!hasContent ? (
        <div className="flex flex-col items-center justify-center text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-2xl">
          <Sparkles className="w-10 h-10 text-brand-300 mb-3" aria-hidden />
          <p className="text-sm text-slate-500 max-w-sm mb-5">
            Generate a professional cover letter tailored to {companyName || 'this company'} using
            your resume and the job description.
          </p>
          <Button onClick={onGenerate} isLoading={isGenerating} leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate with AI
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <label htmlFor="cover-letter" className="sr-only">
            Cover letter
          </label>
          <textarea
            id="cover-letter"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-80 p-4 text-sm text-slate-700 bg-slate-50 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none resize-y leading-relaxed font-serif"
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopy} leftIcon={<Copy className="w-4 h-4" />}>
              Copy
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              isLoading={isSaving}
              disabled={!isSignedIn}
              leftIcon={<Save className="w-4 h-4" />}
              title={isSignedIn ? undefined : 'Sign in to save applications'}
            >
              {isSignedIn ? 'Save application' : 'Sign in to save'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
