import React from 'react';
import { Briefcase, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  skills: string[];
  description: string;
}

interface JobMatchCardProps {
  job: Job;
  matchPercentage: number;
  missing_skills: string[];
}

export const JobMatchCard: React.FC<JobMatchCardProps> = ({ job, matchPercentage, missing_skills }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
            <p className="text-gray-500 text-sm">{job.company}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{matchPercentage}%</div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Match</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Key Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <span 
                key={i} 
                className={cn(
                  "px-2 py-1 rounded-md text-xs font-medium",
                  missing_skills.includes(skill) 
                    ? "bg-gray-100 text-gray-500" 
                    : "bg-green-50 text-green-700 border border-green-100"
                )}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {missing_skills.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-red-400 uppercase mb-2">Missing Skills</h4>
            <div className="flex flex-wrap gap-2">
              {missing_skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                  <XCircle className="w-3 h-3" /> {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
        View Job Details <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

import { cn } from '@/src/lib/utils';
