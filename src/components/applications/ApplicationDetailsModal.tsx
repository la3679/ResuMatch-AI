import { Building2, Download, Target } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { APPLICATION_STATUSES } from '../../constants';
import { downloadTextFile } from '../../lib/format';
import type { ApplicationRecord, ApplicationStatus } from '../../types/application';

interface ApplicationDetailsModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

/** Detailed view of a saved application with status control. */
export function ApplicationDetailsModal({
  application,
  onClose,
  onStatusChange,
}: ApplicationDetailsModalProps) {
  const app = application;

  const handleDownload = () => {
    if (!app) return;
    const safeCompany = app.companyName.trim().replace(/\s+/g, '_') || 'Cover_Letter';
    downloadTextFile(`Cover_Letter_${safeCompany}.txt`, app.coverLetter);
  };

  return (
    <Modal
      open={Boolean(app)}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={
        app && (
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-brand-600 text-white rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 truncate">{app.companyName}</h3>
              <p className="text-sm text-slate-500 truncate">{app.jobTitle}</p>
            </div>
          </div>
        )
      }
    >
      {app && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <div className="p-5 rounded-2xl bg-brand-50 border border-brand-100">
              <span className="text-xs font-bold uppercase tracking-wide text-brand-700">Match score</span>
              <div className="text-4xl font-extrabold text-brand-700 mt-1">
                {app.analysis?.matchScore ?? 0}%
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                id="status"
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none"
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-500" /> Missing keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(app.analysis?.missingKeywords ?? []).length === 0 ? (
                  <p className="text-sm text-slate-500">None recorded.</p>
                ) : (
                  app.analysis.missingKeywords.map((k) => (
                    <Badge key={k} tone="danger">
                      {k}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 md:col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700">Cover letter</h4>
                {app.coverLetter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Download
                  </Button>
                )}
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 font-serif leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {app.coverLetter || 'No cover letter was saved with this application.'}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Job description</h4>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-500 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                {app.jobDescription}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
