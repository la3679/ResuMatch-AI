import { Building2, Briefcase, Calendar, FileText, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '../common/Badge';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../../lib/format';
import type { ApplicationRecord } from '../../types/application';

interface ApplicationListProps {
  items: ApplicationRecord[];
  onSelect: (item: ApplicationRecord) => void;
  onDelete: (id: string) => void;
}

/** List of saved applications with match score, status, and actions. */
export function ApplicationList({ items, onSelect, onDelete }: ApplicationListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="group bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-brand-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <span className="p-3 bg-brand-50 text-brand-600 rounded-xl shrink-0">
                <Building2 className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-900 line-clamp-1">{item.companyName}</h4>
                <p className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Briefcase className="w-3.5 h-3.5" /> {item.jobTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={item.status} />
              <Badge tone="success">{item.analysis?.matchScore ?? 0}%</Badge>
              <button
                onClick={() => onDelete(item.id)}
                aria-label={`Delete application for ${item.companyName}`}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 mt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(item.createdAt)}
              </span>
              <span className="flex items-center gap-1 min-w-0">
                <FileText className="w-3.5 h-3.5" /> <span className="truncate">{item.resumeFilename}</span>
              </span>
            </div>
            <button
              onClick={() => onSelect(item)}
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors shrink-0"
            >
              View details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
