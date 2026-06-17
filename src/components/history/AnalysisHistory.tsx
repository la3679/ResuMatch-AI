import { FileText, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '../common/Badge';
import { formatDate } from '../../lib/format';
import type { AnalysisRecord } from '../../types/application';

interface AnalysisHistoryProps {
  items: AnalysisRecord[];
  onSelect: (item: AnalysisRecord) => void;
  onDelete: (id: string) => void;
}

/** List of saved resume analyses with open and delete actions. */
export function AnalysisHistory({ items, onSelect, onDelete }: AnalysisHistoryProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="group bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-brand-200 hover:shadow-sm transition-all flex items-center gap-4"
        >
          <button
            onClick={() => onSelect(item)}
            className="flex items-center gap-4 flex-1 min-w-0 text-left"
          >
            <span className="p-3 bg-brand-50 text-brand-600 rounded-xl shrink-0">
              <FileText className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-900 line-clamp-1">{item.filename}</h4>
              <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <Badge tone="brand">Score {item.score}</Badge>
            <Badge tone="success">ATS {item.atsScore}</Badge>
            <button
              onClick={() => onDelete(item.id)}
              aria-label={`Delete analysis for ${item.filename}`}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelect(item)}
              aria-label={`Open analysis for ${item.filename}`}
              className="p-2 text-slate-400 group-hover:text-brand-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
