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

The frontend is a static Vite SPA. The API is a set of server-side routes that run two ways:

- **Local development:** an Express server (`server/`) runs Vite in middleware mode and serves the `/api/*` routes (`npm run dev`).
- **Production (Vercel):** the SPA is served as static `dist/`, and each `/api/*` route is a Vercel serverless function (`api/**`). Both share the same logic in `server/services/`.

All AI calls run **server-side**. The browser calls internal `/api` endpoints; the server calls Gemini. **`GEMINI_API_KEY` is never exposed to the client.**

```
ResuMatch-AI/
├── vercel.json               # Vercel build + SPA rewrite + function config
├── api/                      # Vercel serverless functions (production API)
│   ├── health.ts
│   ├── resume/               # upload, analyze, targeted-analysis
│   ├── cover-letter/generate.ts
│   └── jobs/match.ts
├── server.ts                 # thin entry → server/index.ts (local dev API)
├── server/
│   ├── index.ts              # Express app (local dev): Vite middleware + /api routes
│   ├── env.ts                # env loading + validation
│   ├── routes/               # health, resume, coverLetter, jobs (Express)
│   ├── services/             # geminiService, parseFile, jobMatch (shared by api/ + server/)
│   ├── data/jobs.ts          # static sample roles
│   └── lib/                  # ApiError, http (Vercel helpers), errors, safeJson, constants
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

## ▲ Vercel Deployment

ResuMatch AI deploys to Vercel as a **static Vite frontend** plus **serverless functions** (the `api/` folder) that run the API in production. Configuration lives in [`vercel.json`](vercel.json).

| Setting           | Value             |
| ----------------- | ----------------- |
| Framework preset  | Vite              |
| Build command     | `npm run build`   |
| Output directory  | `dist`            |
| Install command   | `npm install`     |
| Node.js version   | 20.x (`engines`)  |

### Required environment variables (Vercel dashboard)

Set in **Project → Settings → Environment Variables** (used only by the `api/**` functions, never exposed to the browser):

| Variable         | Required | Notes                                             |
| ---------------- | -------- | ------------------------------------------------- |
| `GEMINI_API_KEY` | Yes      | Google Gemini key. Server-side only — no `VITE_`. |
| `GEMINI_MODEL`   | No       | Defaults to `gemini-2.0-flash`.                   |

> Never prefix the Gemini key with `VITE_` — that would bundle it into the client. The browser calls `/api/*`; the functions call Gemini.

### Firebase authorized domain (required for sign-in)

After the first deploy, add your Vercel domain to **Firebase Console → Authentication → Settings → Authorized domains**, e.g.:

- `your-project.vercel.app`
- any custom domain you connect

Without this, Google sign-in fails with `auth/unauthorized-domain`. (Analysis and scanning work signed-out; only saved history/applications need sign-in.)

### API routes & SPA routing

Each file in `api/` becomes a function at the matching path (e.g. `api/resume/analyze.ts` → `/api/resume/analyze`). Vercel matches functions and static files **before** the SPA catch-all rewrite (`/(.*) → /index.html`), so deep links and refreshes work and `/api/*` is never swallowed. Resume files are parsed in memory (busboy) and never stored; max upload is **4MB** (under Vercel's ~4.5MB body limit).

### Deploy with the Vercel CLI

```bash
npm install -g vercel
vercel login                 # one-time auth
vercel link                  # link/create the project
vercel env add GEMINI_API_KEY   # add the key (Production + Preview)
vercel dev                   # local: Vite + /api functions on one origin
vercel                       # preview deploy
vercel --prod                # production deploy
```

Or import the GitHub repo in the Vercel dashboard — it auto-detects `vercel.json` (Vite, build `npm run build`, output `dist`). Add the environment variable, then deploy.

### Troubleshooting

| Symptom                       | Fix                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| Blank page after deploy       | Confirm output dir is `dist` and the build succeeded; check the browser console.          |
| 404 on refresh of a route     | Ensure the `/(.*) → /index.html` rewrite is present in `vercel.json`.                     |
| `auth/unauthorized-domain`    | Add the Vercel domain to Firebase Authentication → authorized domains.                    |
| AI returns 503                | `GEMINI_API_KEY` is missing in Vercel env vars.                                           |
| `/api/*` returns 404          | Routes live in `api/`; confirm the file path matches the URL and the deploy included it.  |
| Upload fails / 413            | File exceeds 4MB or Vercel's ~4.5MB body limit; use a smaller file.                       |
| Function timeout              | `maxDuration` is 30s in `vercel.json`; retry — Gemini calls normally finish much sooner.  |
| PDF won't parse               | Scanned/image-only PDFs have no text layer; try a DOCX or a text-based PDF.               |
| CORS / API error              | API and app are same-origin on Vercel; verify you're calling relative `/api/*` paths.     |

## 📡 API endpoints

All under `/api`:

| Method | Path                       | Body                                                       | Returns                                  |
| ------ | -------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| GET    | `/health`                  | —                                                          | `{ status, timestamp, service }`         |
| POST   | `/resume/upload`           | multipart `file` (PDF/DOCX, ≤ 4MB)                         | `{ filename, text, characters }`         |
| POST   | `/resume/analyze`          | `{ resumeText }`                                           | `ResumeAnalysis`                         |
| POST   | `/resume/targeted-analysis`| `{ resumeText, jobDescription }`                           | `TargetedAnalysis`                       |
| POST   | `/cover-letter/generate`   | `{ resumeText, jobDescription, companyName, jobTitle }`    | `{ coverLetter }`                        |
| POST   | `/jobs/match`              | `{ resume_skills: string[] }`                              | `JobMatch[]` (sorted)                    |

## 🔒 Privacy & security

- **Keys stay server-side.** Gemini calls run on the Express server; `GEMINI_API_KEY` is never bundled into the client.
- **Files are processed in memory.** Uploads are parsed with multer's in-memory storage to extract text and are **not** persisted.
- **Your data is yours.** Firestore reads/writes are scoped by `userId`; you only ever see your own analyses and applications, and deletes target only your documents.
- **Validation & limits.** Uploads are restricted to PDF/DOCX and 4MB; request bodies are validated; malformed AI responses are handled gracefully.

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
