import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Download, Target } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { ScoreOverview } from '../components/dashboard/ScoreOverview';
import { SectionScores } from '../components/dashboard/SectionScores';
import { SkillsPanel } from '../components/dashboard/SkillsPanel';
import { ParsedDataPanel } from '../components/dashboard/ParsedDataPanel';
import { KeywordGapPanel } from '../components/dashboard/KeywordGapPanel';
import { SuggestionsPanel } from '../components/dashboard/SuggestionsPanel';
import { useAnalysis } from '../context/AnalysisContext';
import { useToast } from '../hooks/useToast';
import { matchJobs } from '../services/apiService';
import { downloadTextFile } from '../lib/format';
import { ROUTES } from '../constants';

export function DashboardPage() {
  const { analysis, filename, setJobMatches } = useAnalysis();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [isMatching, setIsMatching] = useState(false);

  if (!analysis) {
    return <Navigate to={ROUTES.analyze} replace />;
  }

  const handleDownload = () => {
    const content =
      `Resume Analysis — ${filename}\n` +
      `${'='.repeat(48)}\n\n` +
      `Overall Score: ${analysis.score}/100\n` +
      `ATS Score: ${analysis.atsScore}/100\n\n` +
      `Section Scores:\n` +
      Object.entries(analysis.sectionScores)
        .map(([k, v]) => `- ${k[0].toUpperCase()}${k.slice(1)}: ${v}/100`)
        .join('\n') +
      `\n\nSuggestions:\n` +
      analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n') +
      `\n\nMissing Keywords:\n` +
      analysis.missingKeywords.map((k) => `- ${k}`).join('\n') +
      `\n`;
    const base = filename.replace(/\.[^.]+$/, '') || 'resume';
    downloadTextFile(`Resume_Suggestions_${base}.txt`, content);
  };

  const handleMatchJobs = async () => {
    setIsMatching(true);
    try {
      const matches = await matchJobs(analysis.parsedData.skills);
      setJobMatches(matches);
      navigate(ROUTES.jobs);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to find matching roles.', 'error');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Resume analysis</h1>
          <p className="text-slate-500 mt-1">
            Insights for <span className="font-medium text-slate-700">{filename}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
            Download suggestions
          </Button>
          <Button onClick={handleMatchJobs} isLoading={isMatching} leftIcon={<Target className="w-4 h-4" />}>
            Find matching jobs
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <ScoreOverview score={analysis.score} atsScore={analysis.atsScore} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionScores scores={analysis.sectionScores} />
          <SuggestionsPanel suggestions={analysis.suggestions} />
        </div>

        <SkillsPanel skills={analysis.parsedData.skills} />
        <KeywordGapPanel keywords={analysis.missingKeywords} />
        <ParsedDataPanel data={analysis.parsedData} />
      </div>
    </PageContainer>
  );
}
