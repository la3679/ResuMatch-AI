import { GoogleGenAI, Type } from '@google/genai';
import { env, isAiConfigured } from '../env';
import { ApiError } from '../lib/errors';
import { parseJsonResponse } from '../lib/safeJson';
import type { ResumeAnalysis, TargetedAnalysis } from '../../src/types/resume';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!isAiConfigured) {
    throw new ApiError(503, 'AI features are not configured on the server (missing GEMINI_API_KEY).');
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }
  return client;
}

async function generateText(prompt: string, responseSchema?: object): Promise<string> {
  try {
    const response = await getClient().models.generateContent({
      model: env.geminiModel,
      contents: prompt,
      config: responseSchema
        ? { responseMimeType: 'application/json', responseSchema }
        : undefined,
    });
    const text = response.text;
    if (!text) throw new ApiError(502, 'The AI returned an empty response. Please try again.');
    return text;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.error('[gemini]', err instanceof Error ? err.message : err);
    throw new ApiError(502, 'The AI service is temporarily unavailable. Please try again.');
  }
}

const resumeAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    atsScore: { type: Type.NUMBER },
    sectionScores: {
      type: Type.OBJECT,
      properties: {
        skills: { type: Type.NUMBER },
        experience: { type: Type.NUMBER },
        education: { type: Type.NUMBER },
        projects: { type: Type.NUMBER },
        formatting: { type: Type.NUMBER },
      },
      required: ['skills', 'experience', 'education', 'projects', 'formatting'],
    },
    parsedData: {
      type: Type.OBJECT,
      properties: {
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        experience: { type: Type.ARRAY, items: { type: Type.STRING } },
        education: { type: Type.ARRAY, items: { type: Type.STRING } },
        projects: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['skills', 'experience', 'education', 'projects'],
    },
    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['score', 'atsScore', 'sectionScores', 'parsedData', 'missingKeywords', 'suggestions'],
};

const targetedAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.NUMBER },
    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    toAdd: { type: Type.ARRAY, items: { type: Type.STRING } },
    toRemove: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['matchScore', 'missingKeywords', 'toAdd', 'toRemove', 'suggestions'],
};

/** Runs a full structured resume analysis. */
export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const prompt = `You are a senior technical recruiter and ATS expert. Analyze the resume below and return ONLY a JSON object matching the requested schema.

Scoring weights for the overall score (0-100): skills relevance 30%, experience depth 25%, projects quality 20%, formatting/clarity 15%, keyword coverage 10%. The atsScore (0-100) reflects machine-readability: clear section headings, standard formatting, parseable contact info, and keyword presence.

Guidance:
- Be specific and actionable. Avoid generic advice like "add more detail".
- For software resumes, reward measurable impact (metrics, %), strong technical keywords, clarity, and project depth.
- parsedData.skills: concrete technologies/tools. experience/education/projects: concise one-line summaries.
- missingKeywords: high-value role/industry keywords absent from the resume.
- suggestions: 4-7 prioritized, concrete improvements, most impactful first.

Resume Text:
"""
${resumeText}
"""`;

  const raw = await generateText(prompt, resumeAnalysisSchema);
  return parseJsonResponse<ResumeAnalysis>(raw);
}

/** Compares a resume against a job description. */
export async function analyzeResumeAgainstJob(
  resumeText: string,
  jobDescription: string,
): Promise<TargetedAnalysis> {
  const prompt = `You are an expert career coach. Compare the resume against the job description and return ONLY a JSON object matching the requested schema.

Guidance:
- matchScore (0-100): how well the resume evidences the role's requirements.
- missingKeywords: required skills/keywords from the job description absent from the resume.
- toAdd: specific resume additions tied to the role's requirements (skills, achievements, phrasing).
- toRemove: content to cut or de-emphasize because it is irrelevant to this role.
- suggestions: 3-6 concrete, prioritized tailoring actions. Be specific, not generic.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""`;

  const raw = await generateText(prompt, targetedAnalysisSchema);
  return parseJsonResponse<TargetedAnalysis>(raw);
}

/** Generates a tailored cover letter as plain text. */
export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string,
  jobTitle: string,
): Promise<string> {
  const prompt = `Write a professional, compelling cover letter for the role below. Tailor it to the company and job description, drawing on concrete, relevant experience from the resume.

Requirements:
- Address the role and company specifically.
- 3-4 concise paragraphs; confident but not boastful; no clichés.
- Highlight the most relevant skills and measurable achievements.
- End with a courteous call to action.
- Return ONLY the cover letter text (no preamble, no markdown).

Company: ${companyName}
Role: ${jobTitle}

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""`;

  const raw = await generateText(prompt);
  return raw.trim();
}
