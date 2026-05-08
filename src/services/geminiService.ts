import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ResumeAnalysis {
  score: number;
  sectionScores: {
    skills: number;
    experience: number;
    education: number;
    projects: number;
    formatting: number;
  };
  parsedData: {
    skills: string[];
    experience: string[];
    education: string[];
    projects: string[];
  };
  missingKeywords: string[];
  suggestions: string[];
  atsScore: number;
}

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following resume text and provide a structured analysis in JSON format.
    
    Resume Text:
    ${resumeText}
    
    Scoring Logic:
    - Skills relevance: 30%
    - Experience depth: 25%
    - Projects quality: 20%
    - Formatting/clarity: 15%
    - Keyword match: 10%
    
    Return a JSON object with this structure:
    {
      "score": number (0-100),
      "sectionScores": {
        "skills": number (0-100),
        "experience": number (0-100),
        "education": number (0-100),
        "projects": number (0-100),
        "formatting": number (0-100)
      },
      "parsedData": {
        "skills": ["skill1", "skill2", ...],
        "experience": ["exp1", "exp2", ...],
        "education": ["edu1", "edu2", ...],
        "projects": ["proj1", "proj2", ...]
      },
      "missingKeywords": ["keyword1", "keyword2", ...],
      "suggestions": ["suggestion1", "suggestion2", ...],
      "atsScore": number (0-100)
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          sectionScores: {
            type: Type.OBJECT,
            properties: {
              skills: { type: Type.NUMBER },
              experience: { type: Type.NUMBER },
              education: { type: Type.NUMBER },
              projects: { type: Type.NUMBER },
              formatting: { type: Type.NUMBER }
            },
            required: ["skills", "experience", "education", "projects", "formatting"]
          },
          parsedData: {
            type: Type.OBJECT,
            properties: {
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experience: { type: Type.ARRAY, items: { type: Type.STRING } },
              education: { type: Type.ARRAY, items: { type: Type.STRING } },
              projects: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["skills", "experience", "education", "projects"]
          },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          atsScore: { type: Type.NUMBER }
        },
        required: ["score", "sectionScores", "parsedData", "missingKeywords", "suggestions", "atsScore"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to get analysis from AI");
  return JSON.parse(text);
};

export interface TargetedAnalysis {
  missingKeywords: string[];
  toAdd: string[];
  toRemove: string[];
  matchScore: number;
  suggestions: string[];
}

export const analyzeResumeAgainstJob = async (resumeText: string, jobDescription: string): Promise<TargetedAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following resume against the provided job description.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Identify missing keywords, what to add, what to remove, and an overall match score.
    Return a JSON object with this structure:
    {
      "missingKeywords": ["keyword1", ...],
      "toAdd": ["suggestion1", ...],
      "toRemove": ["suggestion1", ...],
      "matchScore": number (0-100),
      "suggestions": ["general advice1", ...]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          toAdd: { type: Type.ARRAY, items: { type: Type.STRING } },
          toRemove: { type: Type.ARRAY, items: { type: Type.STRING } },
          matchScore: { type: Type.NUMBER },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["missingKeywords", "toAdd", "toRemove", "matchScore", "suggestions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to get analysis from AI");
  return JSON.parse(text);
};

export const generateCoverLetter = async (resumeText: string, jobDescription: string, companyName: string, jobTitle: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a professional and compelling cover letter for the following role.
    
    Company: ${companyName}
    Role: ${jobTitle}
    
    Resume Context:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    The cover letter should be tailored to the job description, highlighting relevant skills from the resume.
    Keep it professional, concise, and persuasive.`,
  });

  return response.text || "";
};
