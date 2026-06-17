# ResuMatch AI

> AI-powered career optimization platform — analyze your resume, score it for ATS, match it against any job description, generate tailored cover letters, and track your applications.

ResuMatch AI helps job seekers move from a generic resume to a targeted, recruiter-ready application. Upload a resume to get an instant AI analysis with an overall score and ATS compatibility score, a section-by-section breakdown, extracted skills/experience/education/projects, missing keywords, and prioritized suggestions. Then scan it against a specific job description for a match score, keyword gaps, and a generated cover letter you can edit, download, and save.

---

## ✨ Features

- **AI resume analysis** — overall score plus a breakdown across skills, experience, education, projects, and formatting.
- **ATS compatibility score** — how easily applicant tracking systems can parse and rank your resume.
- **Content extraction** — skills, experience, education, and projects parsed from your resume.
- **Keyword gap analysis** — high-value keywords recruiters and ATS look for that your resume is missing.
- **Actionable suggestions** — prioritized, specific improvements with a "improve this first" highlight.
- **Targeted job scan** — paste a job description for a match score, missing keywords, and what to add/remove.
- **AI cover letter generation** — tailored to the company and role, editable, copyable, and downloadable.
- **Job match recommendations** — sample roles ranked by skill overlap, with matched and missing skills.
- **Saved history & applications** — signed-in users can save, revisit, and delete analyses and applications, with application status tracking.
- **Polished, responsive UI** — landing page, dashboards, modals, toasts, loading/empty/error states, mobile navigation, and accessible forms.

## 🧭 App flow

1. **Landing** → understand the product and jump in.
2. **Analyze** (`/analyze`) → upload a PDF/DOCX resume; text is extracted server-side and analyzed by AI.
3. **Dashboard** (`/dashboard`) → overall + ATS scores, section breakdown, extracted data, missing keywords, suggestions; download suggestions or find matching jobs.
4. **Job matches** (`/jobs`) → recommended sample roles ranked by skill match.
5. **Targeted scan** (`/scan`) → company, title, job description, and resume → match score, keyword gaps, add/remove, and a tailored cover letter.
6. **History & Applications** (`/history`, `/applications`) → signed-in users save and manage past analyses and applications.
7. **Account** (`/account`) → profile and saved-data overview.

## 🛠 Tech stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Motion, Lucide icons
- **Backend:** Node.js, Express, Multer, pdf-parse, Mammoth.js
- **AI:** Google Gemini (`@google/genai`) — server-side only
- **Auth & data:** Firebase Auth (Google sign-in), Cloud Firestore

## 🏗 Architecture

A single Express server hosts both the API and the frontend:

- **Development:** Express runs Vite in middleware mode (HMR + on-the-fly TS/JSX transforms).
- **Production:** Express serves the static `dist/` build with SPA fallback.

All AI calls run **server-side**. The browser calls internal `/api/v1` endpoints; the server calls Gemini. **`GEMINI_API_KEY` is never exposed to the client.**

```
ResuMatch-AI/
├── server.ts                 # thin entry → server/index.ts
├── server/
│   ├── index.ts              # Express app, Vite middleware / static serving, error handler
│   ├── env.ts                # env loading + validation
│   ├── routes/               # health, resume, coverLetter, jobs
│   ├── services/             # geminiService, parseFile, jobMatch
│   ├── data/jobs.ts          # static sample roles
│   └── lib/                  # asyncHandler, errors, safeJson, constants
├── src/
│   ├── main.tsx              # providers + BrowserRouter
│   ├── App.tsx               # routes
│   ├── pages/                # Landing, Analyze, Dashboard, JobMatches, TargetedScan, History, Applications, Account, NotFound
│   ├── components/
│   │   ├── common/           # Button, Card, Badge, Progress, ScoreRing, Modal, Tabs, states, toasts…
│   │   ├── layout/           # AppLayout, Navbar, Footer, PageContainer, RequireAuthPrompt
│   │   ├── upload/ dashboard/ jobs/ targeted/ history/ applications/ landing/
│   ├── context/              # AnalysisContext
│   ├── hooks/                # useAuth, useToast, useAnalysisHistory, useApplications
│   ├── services/             # apiService (backend calls), firebaseService (Firestore)
│   ├── types/                # shared TypeScript types
│   ├── constants/  lib/      # routes, file limits, statuses, helpers
│   └── firebase.ts           # resilient Firebase init
└── firebase-applet-config.json
```

## 🔑 Environment variables

Copy `.env.example` to `.env`:

| Variable         | Required | Default            | Notes                                   |
| ---------------- | -------- | ------------------ | --------------------------------------- |
| `GEMINI_API_KEY` | Yes (AI) | —                  | Server-side only. AI endpoints need it. |
| `GEMINI_MODEL`   | No       | `gemini-2.0-flash` | Override the Gemini model.              |
| `NODE_ENV`       | No       | `development`      | `production` serves `dist/`.            |
| `PORT`           | No       | `3000`             | Server port.                            |

`.env` is git-ignored. Never commit real secrets.

## 🚀 Getting started

**Prerequisites:** Node.js 18+, a Google AI Studio (Gemini) API key, and a Firebase project (for auth/Firestore features).

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env   # then add your GEMINI_API_KEY

# 3. Run (API + frontend on one server)
npm run dev            # http://localhost:3000
```

### Build & run production

```bash
npm run build          # outputs dist/
NODE_ENV=production npx tsx server.ts
```

### Quality checks

```bash
npm run lint           # tsc --noEmit (type check)
npm run build          # production build
```

## 🔥 Firebase setup

Auth and Firestore power saved history and applications. Without a valid Firebase config the app still runs — analysis and scanning work fully, and auth-gated pages show a sign-in prompt.

1. Create a Firebase project and enable **Google** sign-in (Authentication).
2. Create a **Cloud Firestore** database.
3. Put your web app config in `firebase-applet-config.json` (`projectId`, `appId`, `apiKey`, `authDomain`, `firestoreDatabaseId`, `storageBucket`, …). The `apiKey` here is a public client identifier; access is controlled by Firestore security rules.
4. Add security rules so users can only read/write their own documents, e.g. `request.auth.uid == resource.data.userId`.

## 🤖 Gemini setup

1. Create an API key in [Google AI Studio](https://aistudio.google.com/).
2. Set `GEMINI_API_KEY` in `.env` (and optionally `GEMINI_MODEL`).
3. The server validates AI output, strips markdown fences, and returns a clear error if the model returns malformed JSON.

## 📡 API endpoints

All under `/api/v1`:

| Method | Path                       | Body                                                       | Returns                                  |
| ------ | -------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| GET    | `/health`                  | —                                                          | `{ status, timestamp, service }`         |
| POST   | `/resume/upload`           | multipart `file` (PDF/DOCX, ≤ 5MB)                         | `{ filename, text, characters }`         |
| POST   | `/resume/analyze`          | `{ resumeText }`                                           | `ResumeAnalysis`                         |
| POST   | `/resume/targeted-analysis`| `{ resumeText, jobDescription }`                           | `TargetedAnalysis`                       |
| POST   | `/cover-letter/generate`   | `{ resumeText, jobDescription, companyName, jobTitle }`    | `{ coverLetter }`                        |
| POST   | `/jobs/match`              | `{ resume_skills: string[] }`                              | `JobMatch[]` (sorted)                    |

## 🔒 Privacy & security

- **Keys stay server-side.** Gemini calls run on the Express server; `GEMINI_API_KEY` is never bundled into the client.
- **Files are processed in memory.** Uploads are parsed with multer's in-memory storage to extract text and are **not** persisted.
- **Your data is yours.** Firestore reads/writes are scoped by `userId`; you only ever see your own analyses and applications, and deletes target only your documents.
- **Validation & limits.** Uploads are restricted to PDF/DOCX and 5MB; request bodies are validated; malformed AI responses are handled gracefully.

## 📌 Notes & limitations

- **Job matches are static sample roles** for demonstration — not live job listings. Integrating a real jobs API is a future enhancement.
- **Uploaded files are parsed in memory** and not stored anywhere.
- AI features require a valid server-side `GEMINI_API_KEY`; saved history/applications require a configured Firebase project.

## 🔭 Future improvements

- Real job-listing API integration
- Resume version library and diffing
- Notes, deadlines, and job links on applications
- Richer cover letter formatting/export (PDF/DOCX)
- Route-level code splitting

---

*Transform your job search with data-driven, AI-powered insights.*
