import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  MinusCircle, 
  Loader2, 
  Sparkles, 
  Download, 
  Save, 
  Edit3,
  Building2,
  Briefcase
} from 'lucide-react';
import { analyzeResumeAgainstJob, generateCoverLetter, TargetedAnalysis as AnalysisResult } from '../services/geminiService';
import { uploadResume } from '../services/apiService';
import { db, collection, addDoc, Timestamp } from '../firebase';
import { cn } from '../lib/utils';

interface TargetedAnalysisProps {
  userId: string | null;
  onSave: () => void;
}

export const TargetedAnalysis: React.FC<TargetedAnalysisProps> = ({ userId, onSave }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [scanMode, setScanMode] = useState<'whole' | 'line'>('whole');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [isEditingCL, setIsEditingCL] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeText, setResumeText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
    } else {
      alert('Please upload a Word file (.docx)');
    }
  };

  const runAnalysis = async () => {
    if (!file || !jobDescription || !companyName || !jobTitle) {
      alert('Please fill in all fields and upload a resume.');
      return;
    }

    setIsAnalyzing(true);
    setScanProgress(0);

    try {
      // 1. Extract text
      const { text } = await uploadResume(file);
      setResumeText(text);

      // 2. Simulate scan animation
      if (scanMode === 'line') {
        const lines = text.split('\n').filter(l => l.trim());
        const totalLines = lines.length;
        const scanSpeed = Math.max(10, Math.min(50, 1000 / totalLines)); // Adjust speed based on length
        
        for (let i = 0; i <= totalLines; i++) {
          setScanProgress(Math.round((i / totalLines) * 100));
          await new Promise(r => setTimeout(r, scanSpeed)); 
        }
      } else {
        setScanProgress(100);
        await new Promise(r => setTimeout(r, 800));
      }

      // 3. Analyze with Gemini
      const result = await analyzeResumeAgainstJob(text, jobDescription);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!analysis || !resumeText) return;
    setIsGeneratingCL(true);
    try {
      const cl = await generateCoverLetter(resumeText, jobDescription, companyName, jobTitle);
      setCoverLetter(cl);
      setIsEditingCL(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate cover letter.');
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const handleSaveApplication = async () => {
    if (!userId) {
      alert('Please sign in to save your application.');
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'applications'), {
        userId,
        companyName,
        jobTitle,
        jobDescription,
        resumeFilename: file?.name,
        coverLetter,
        analysis,
        createdAt: Timestamp.now()
      });
      alert('Application saved successfully!');
      onSave();
    } catch (err) {
      console.error(err);
      alert('Failed to save application.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadCoverLetter = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${companyName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!analysis ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Company Name
              </label>
              <input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Job Title
              </label>
              <input 
                type="text" 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Job Description</label>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Resume (Word only)</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label 
                  htmlFor="resume-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                >
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">
                    {file ? file.name : 'Upload .docx resume'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Scan Mode</label>
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button 
                  onClick={() => setScanMode('whole')}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                    scanMode === 'whole' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  Whole Scan
                </button>
                <button 
                  onClick={() => setScanMode('line')}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                    scanMode === 'line' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  Line by Line
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {scanMode === 'line' ? `Scanning... ${scanProgress}%` : 'Analyzing...'}
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                Start Targeted Scan
              </>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setAnalysis(null)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Input
            </button>
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
              Match Score: {analysis.matchScore}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Keywords & Suggestions */}
            <div className="space-y-6">
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((k, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-100">
                      {k}
                    </span>
                  ))}
                </div>
              </section>

              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600">
                  <PlusCircle className="w-5 h-5" /> What to Add
                </h3>
                <ul className="space-y-2">
                  {analysis.toAdd.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-600">
                  <MinusCircle className="w-5 h-5" /> What to Remove
                </h3>
                <ul className="space-y-2">
                  {analysis.toRemove.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Cover Letter Section */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Cover Letter
                  </h3>
                  {coverLetter && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsEditingCL(!isEditingCL)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={downloadCoverLetter}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {!coverLetter ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl">
                    <Sparkles className="w-12 h-12 text-blue-100 mb-4" />
                    <p className="text-gray-500 text-sm mb-6">
                      Generate a tailored cover letter based on your resume and the job description.
                    </p>
                    <button 
                      onClick={handleGenerateCoverLetter}
                      disabled={isGeneratingCL}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isGeneratingCL ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      Generate with AI
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col space-y-4">
                    {isEditingCL ? (
                      <textarea 
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="flex-1 w-full p-4 text-sm text-gray-600 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none font-serif leading-relaxed"
                      />
                    ) : (
                      <div className="flex-1 p-4 text-sm text-gray-600 bg-gray-50 rounded-xl border border-gray-200 overflow-y-auto font-serif leading-relaxed whitespace-pre-wrap">
                        {coverLetter}
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={handleSaveApplication}
                        disabled={isSaving}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Application
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
