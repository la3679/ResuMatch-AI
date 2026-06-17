import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  LayoutDashboard, 
  Briefcase, 
  ChevronRight, 
  Sparkles, 
  Target, 
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Download,
  History as HistoryIcon,
  LogOut,
  LogIn,
  User as UserIcon,
  Loader2,
  Trash2,
  Building2,
  XCircle
} from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ScoreCard } from './components/ScoreCard';
import { JobMatchCard } from './components/JobMatchCard';
import { History } from './components/History';
import { TargetedAnalysis } from './components/TargetedAnalysis';
import { ApplicationHistory } from './components/ApplicationHistory';
import { uploadResume, matchJobs } from './services/apiService';
import { analyzeResume, ResumeAnalysis } from './services/geminiService';
import { cn } from './lib/utils';
import { auth, signIn, logOut, db, collection, addDoc, query, where, getDocs, orderBy, Timestamp } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

export default function App() {
  const [step, setStep] = useState<'upload' | 'dashboard' | 'matching' | 'history' | 'targeted' | 'applications'>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [currentFilename, setCurrentFilename] = useState<string>('');
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchHistory(u.uid);
        fetchApplications(u.uid);
      } else {
        setHistory([]);
        setApplications([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'analyses'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(items);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const fetchApplications = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'applications'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(items);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Upload and extract text
      const { text, filename } = await uploadResume(file);
      setCurrentFilename(filename);

      // 2. Analyze with Gemini
      const analysisResult = await analyzeResume(text);
      setAnalysis(analysisResult);

      // 3. Save to Firebase if logged in
      if (user) {
        await addDoc(collection(db, 'analyses'), {
          userId: user.uid,
          filename,
          score: analysisResult.score,
          atsScore: analysisResult.atsScore,
          sectionScores: analysisResult.sectionScores,
          parsedData: analysisResult.parsedData,
          missingKeywords: analysisResult.missingKeywords,
          suggestions: analysisResult.suggestions,
          createdAt: Timestamp.now()
        });
        fetchHistory(user.uid);
      }

      setStep('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchJobs = async () => {
    if (!analysis) return;
    setIsLoading(true);
    try {
      const matches = await matchJobs(analysis.parsedData.skills);
      setJobMatches(matches);
      setStep('matching');
    } catch (err) {
      setError("Failed to match jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'analyses', id));
      if (user) fetchHistory(user.uid);
    } catch (err) {
      console.error("Error deleting history:", err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'applications', id));
      if (user) fetchApplications(user.uid);
    } catch (err) {
      console.error("Error deleting application:", err);
    }
  };

  const downloadSuggestions = () => {
    if (!analysis) return;
    const content = `AI Resume Suggestions for ${currentFilename}\n\n` +
      `Overall Score: ${analysis.score}/100\n` +
      `ATS Score: ${analysis.atsScore}/100\n\n` +
      `Suggestions:\n` +
      analysis.suggestions.map(s => `- ${s}`).join('\n') +
      `\n\nMissing Keywords:\n` +
      analysis.missingKeywords.map(k => `- ${k}`).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_Suggestions_${currentFilename.split('.')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('upload')}>
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">ResuMatch AI</span>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setStep('targeted')}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  step === 'targeted' ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <Target className="w-4 h-4" /> Targeted Scan
              </button>

              {step !== 'upload' && step !== 'targeted' && step !== 'applications' && (
                <>
                  <button 
                    onClick={() => setStep('dashboard')}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      step === 'dashboard' ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </button>
                  <button 
                    onClick={() => setStep('matching')}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      step === 'matching' ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <Briefcase className="w-4 h-4" /> Job Matches
                  </button>
                </>
              )}

              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                  <button 
                    onClick={() => setStep('applications')}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      step === 'applications' ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <Building2 className="w-4 h-4" /> Applications
                  </button>
                  <button 
                    onClick={() => setStep('history')}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      step === 'history' ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <HistoryIcon className="w-4 h-4" /> History
                  </button>
                  <div className="flex items-center gap-2">
                    <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
                    <button onClick={() => logOut()} className="text-gray-400 hover:text-red-500 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => signIn()}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="max-w-2xl mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                  Optimize your career with <span className="text-blue-600">AI Intelligence</span>
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed">
                  Upload your resume to get instant AI analysis, ATS scoring, and match with top job roles tailored to your skills.
                </p>
              </div>
              
              <FileUpload onUpload={handleUpload} isLoading={isLoading} />
              
              {!user && (
                <p className="mt-6 text-sm text-gray-400">
                  Sign in to save your analysis history and access advanced features.
                </p>
              )}

              {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}
            </motion.div>
          )}

          {step === 'targeted' && (
            <motion.div
              key="targeted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Targeted Analysis</h2>
                <p className="text-gray-500">Scan your resume against a specific job description for maximum impact.</p>
              </div>
              <TargetedAnalysis 
                userId={user?.uid || null} 
                onSave={() => fetchApplications(user?.uid || '')} 
              />
            </motion.div>
          )}

          {step === 'dashboard' && analysis && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Resume Analysis</h2>
                  <p className="text-gray-500">Comprehensive insights into your professional profile</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={downloadSuggestions}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download Suggestions
                  </button>
                  <button 
                    onClick={handleMatchJobs}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
                    Find Matching Jobs
                  </button>
                </div>
              </div>

              {/* Score Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-blue-600 p-8 rounded-3xl text-white flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-medium uppercase tracking-widest opacity-80 mb-2">Overall Score</span>
                  <span className="text-7xl font-black">{analysis.score}</span>
                  <div className="mt-4 px-4 py-1 bg-white/20 rounded-full text-xs font-bold">
                    ATS COMPATIBLE: {analysis.atsScore}%
                  </div>
                </div>
                <ScoreCard score={analysis.sectionScores.skills} label="Skills" color="#3b82f6" />
                <ScoreCard score={analysis.sectionScores.experience} label="Experience" color="#10b981" />
                <ScoreCard score={analysis.sectionScores.projects} label="Projects" color="#f59e0b" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Skills & Data */}
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" /> Extracted Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.parsedData.skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" /> Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword, i) => (
                        <span key={i} className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Suggestions */}
                <div className="space-y-8">
                  <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-amber-600">
                      <Lightbulb className="w-5 h-5" /> AI Suggestions
                    </h3>
                    <ul className="space-y-4">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'matching' && (
            <motion.div
              key="matching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setStep('dashboard')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Job Matches</h2>
                  <p className="text-gray-500">Roles that align best with your current skill set</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobMatches.map((match, i) => (
                  <JobMatchCard 
                    key={i}
                    job={match.job}
                    matchPercentage={match.match_percentage}
                    missing_skills={match.missing_skills}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setStep('upload')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Analysis History</h2>
                  <p className="text-gray-500">Access your past resume evaluations</p>
                </div>
              </div>

              <History 
                items={history} 
                onSelect={(item) => {
                  setAnalysis((item.analysis || item) as ResumeAnalysis);
                  setCurrentFilename(item.filename);
                  setStep('dashboard');
                }}
                onDelete={handleDeleteHistory}
              />
            </motion.div>
          )}

          {step === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setStep('upload')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">My Applications</h2>
                  <p className="text-gray-500">Track your job applications and cover letters</p>
                </div>
              </div>

              <ApplicationHistory 
                items={applications} 
                onSelect={(item) => setSelectedApplication(item)}
                onDelete={handleDeleteApplication}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Details Modal */}
        <AnimatePresence>
          {selectedApplication && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedApplication.companyName}</h3>
                      <p className="text-sm text-gray-500 font-medium">{selectedApplication.jobTitle}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedApplication(null)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Match Score</span>
                        <div className="text-4xl font-black text-blue-700 mt-1">
                          {selectedApplication.analysis?.matchScore}%
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Target className="w-4 h-4 text-red-500" /> Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.analysis?.missingKeywords.map((k: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-100">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" /> Cover Letter
                        </h4>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-600 font-serif leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                          {selectedApplication.coverLetter}
                        </div>
                        <button 
                          onClick={() => {
                            const blob = new Blob([selectedApplication.coverLetter], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Cover_Letter_${selectedApplication.companyName.replace(/\s+/g, '_')}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        >
                          <Download className="w-4 h-4" /> Download Cover Letter
                        </button>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900">Job Description</h4>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-500 line-clamp-6 hover:line-clamp-none transition-all cursor-pointer">
                          {selectedApplication.jobDescription}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 ResuMatch AI. Powered by Gemini Pro.</p>
        </div>
      </footer>
    </div>
  );
}
