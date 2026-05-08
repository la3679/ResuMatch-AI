import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  Trash2, 
  FileText, 
  Download,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeFilename: string;
  coverLetter: string;
  analysis: any;
  createdAt: any;
}

interface ApplicationHistoryProps {
  items: Application[];
  onSelect: (item: Application) => void;
  onDelete: (id: string) => void;
}

export const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ items, onSelect, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No applications tracked yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{item.companyName}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Briefcase className="w-4 h-4" /> {item.jobTitle}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                Match: {item.analysis?.matchScore}%
              </div>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> 
                {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" /> 
                {item.resumeFilename}
              </span>
            </div>
            <button 
              onClick={() => onSelect(item)}
              className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
