import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Building2, Briefcase, FileText, Search, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
  ACCEPTED_FILE_EXTENSIONS,
  FILE_INPUT_ACCEPT,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_LABEL,
} from '../../constants';

export interface TargetedScanValues {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

interface TargetedScanFormProps {
  onSubmit: (values: TargetedScanValues) => void;
  isSubmitting: boolean;
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition';

function extensionOf(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx === -1 ? '' : name.slice(idx).toLowerCase();
}

/** Collects company, role, job description, and resume for a targeted scan. */
export function TargetedScanForm({ onSubmit, isSubmitting }: TargetedScanFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const ext = extensionOf(selected.name);
    if (!(ACCEPTED_FILE_EXTENSIONS as readonly string[]).includes(ext)) {
      setFileError(`Please upload a ${ACCEPTED_FILE_EXTENSIONS.join(' or ')} file.`);
      return;
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`);
      return;
    }
    setFileError(null);
    setFile(selected);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError('Please upload your resume.');
      return;
    }
    onSubmit({ companyName, jobTitle, jobDescription, file });
  };

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <Card padded={false}>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="company" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Company name
            </label>
            <input
              id="company"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Northwind Labs"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Job title
            </label>
            <input
              id="title"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="jd" className="text-sm font-semibold text-slate-700">
              Job description
            </label>
            <span className="text-xs text-slate-400">{wordCount} words</span>
          </div>
          <textarea
            id="jd"
            required
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here — responsibilities, requirements, and preferred qualifications."
            className={`${inputClass} h-56 resize-y leading-relaxed`}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="resume" className="text-sm font-semibold text-slate-700">
            Resume <span className="font-normal text-slate-400">(PDF or DOCX)</span>
          </label>
          <input id="resume" type="file" accept={FILE_INPUT_ACCEPT} onChange={onFileChange} className="sr-only" />
          <label
            htmlFor="resume"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-400 hover:bg-brand-50/40 cursor-pointer transition text-sm font-medium text-slate-600"
          >
            {file ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {file.name}
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-slate-400" /> Upload your resume
              </>
            )}
          </label>
          {fileError && (
            <p role="alert" className="text-sm text-rose-600">
              {fileError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<Search className="w-5 h-5" />}
        >
          {isSubmitting ? 'Scanning your resume…' : 'Run targeted scan'}
        </Button>
      </form>
    </Card>
  );
}
