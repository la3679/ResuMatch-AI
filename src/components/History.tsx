import React from 'react';
import { Clock, FileText, ChevronRight, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeAnalysis } from '../services/geminiService';

interface HistoryItem {
  id: string;
  filename: string;
  score: number;
  atsScore: number;
  createdAt: any;
  analysis: ResumeAnalysis;
}

interface HistoryProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ items, onSelect, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No past analyses found.</p>
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
          className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => onSelect(item)}>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 line-clamp-1">{item.filename}</h4>
              <p className="text-xs text-gray-400">
                {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()} • Score: {item.score}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelect(item)}
              className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
