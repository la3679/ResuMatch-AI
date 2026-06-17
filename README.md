<div align="center">

# ResuMatch AI

### AI-powered resume analysis, ATS optimization, job matching, and cover letter generation platform.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**[🔗 Live Demo → resumatch-ai-nu.vercel.app](https://resumatch-ai-nu.vercel.app)**

</div>

---

## 📋 Overview

**ResuMatch AI** is a full-stack career optimization platform that helps job seekers turn a generic resume into a targeted, recruiter-ready application. Upload a resume and the app extracts the text, analyzes it with **Google Gemini**, and returns an overall score, an ATS-compatibility score, a section-by-section breakdown, extracted skills, missing keywords, and prioritized, actionable suggestions.

Beyond a single analysis, ResuMatch AI lets you scan your resume against a specific **job description**, generate a tailored **cover letter**, and discover **matching roles** based on your skills. Signed-in users can save their analyses and applications to **Cloud Firestore** and revisit or delete them anytime.

What it does:

- Upload a resume as **PDF or DOCX** and extract clean text server-side
- Analyze the resume with **Google Gemini** and produce structured JSON results
- Generate an **overall resume score** and an **ATS compatibility score**
- Show **section-level scoring** (skills, experience, education, projects, formatting)
- Detect **missing keywords** recruiters and ATS systems look for
- Provide **prioritized improvement suggestions** ("fix this first")
- Run a **targeted scan** comparing the resume against a pasted job description
- Generate, edit, and download a **tailored cover letter**
- Recommend **matching roles** from a curated sample dataset
- Save **analysis history** and **applications** with Firebase Auth + Firestore
- Track applications with statuses (Saved, Applied, Interviewing, Offer, Rejected)

---

## 🚀 Features

| Feature | Description |
| --- | --- |
| 🤖 **AI Resume Analysis** | Overall score plus structured insights powered by Google Gemini. |
| ✅ **ATS Compatibility Scoring** | Measures how easily applicant tracking systems can parse and rank your resume. |
| 📊 **Resume Section Breakdown** | Per-section scores for skills, experience, education, projects, and formatting. |
| 🔑 **Keyword Gap Detection** | Surfaces high-value keywords missing from your resume. |
| 🎯 **Targeted Job Description Scan** | Compares your resume to a specific role for a match score and gap analysis. |
| ✍️ **AI Cover Letter Generator** | Produces a tailored, editable, downloadable cover letter. |
| 💼 **Job Matching** | Ranks curated sample roles by skill overlap (clearly labeled as sample data). |
| 🗂️ **Application Tracking** | Save applications and track their status through the hiring pipeline. |
| 🔐 **Firebase Google Authentication** | Secure Google sign-in for personalized, private data. |
| 🔥 **Firestore History** | Persists analyses and applications, scoped to the signed-in user. |
| 📄 **PDF / DOCX Upload** | In-memory parsing with `unpdf` (PDF) and `mammoth` (DOCX). |
| ▲ **Vercel Serverless API** | Production API runs as Vercel serverless functions. |
| 🔒 **Secure Gemini Handling** | The Gemini API key stays server-side and is never exposed to the browser. |

---

## 🖼️ Screenshots

> Screenshots can be added under `docs/screenshots/`. Suggested captures:

| View | Path |
| --- | --- |
| Resume upload | `docs/screenshots/upload.png` |
| Analysis dashboard | `docs/screenshots/dashboard.png` |
| Targeted job scan | `docs/screenshots/targeted-scan.png` |
| Job matches | `docs/screenshots/job-matches.png` |

---

## 🛠️ Tech Stack

**Frontend**

| Technology | Role |
| --- | --- |
| React 19 | UI library |
| TypeScript | Type-safe development |
| Vite 6 | Build tool & dev server |
| Tailwind CSS 4 | Styling / design system |
| React Router | Client-side routing |
| Motion | Animations & micro-interactions |
| Lucide React | Icon set |

**Backend / API**

| Technology | Role |
| --- | --- |
| Vercel Serverless Functions (`api/`) | Production API runtime |
| Node.js + Express (`server/`) | Local dev API + Vite middleware |
| Busboy | Multipart upload parsing (serverless) |
| unpdf | PDF text extraction (no native dependencies) |
| Mammoth.js | DOCX text extraction |

**AI**

| Technology | Role |
| --- | --- |
| Google Gemini API | Resume analysis, targeted scan, cover letters |
| `@google/genai` | Official Gemini SDK (server-side only) |

**Auth & Database**

| Technology | Role |
| --- | --- |
| Firebase Authentication | Google Sign-In |
| Cloud Firestore | Saved analyses & applications |

**Deployment**

| Technology | Role |
| --- | --- |
| Vercel | Hosting, serverless functions, CI/CD from `main` |

---

## 🏗️ Architecture

The frontend is a static Vite SPA. The API runs as **Vercel serverless functions** in production and as an **Express server** locally — both share the same logic in `server/services/`. All AI calls happen server-side, so the Gemini key never reaches the browser.

```text
              ┌──────────────────────────────┐
              │   React SPA (Vite, Tailwind)  │
              │   Upload · Dashboard · Scan    │
              └───────────────┬───────────────┘
                              │  /api/*  (relative calls)
                              ▼
              ┌──────────────────────────────┐
              │   Vercel Serverless Functions  │   (Express server for local dev)
              │   api/** → server/services/**  │
              └───────────────┬───────────────┘
                  ┌───────────┴────────────┐
                  ▼                         ▼
        ┌───────────────────┐    ┌────────────────────┐
        │  Resume Parser     │    │  Gemini Service     │
        │  unpdf / mammoth   │    │  @google/genai      │
        └─────────┬─────────┘    └──────────┬─────────┘
                  │                          │
                  └────────────┬─────────────┘
                               ▼
                  ┌──────────────────────────┐
                  │  Structured JSON Analysis  │
                  └─────────────┬────────────┘
                                ▼
        ┌──────────────────────────────────────────────┐
        │  React Dashboard + Firestore (signed-in users) │
        └──────────────────────────────────────────────┘
```

**Request flow:** User uploads a resume → frontend sends the file to `/api/resume/upload` → the server parses the PDF/DOCX in memory → extracted text is sent to Gemini via `/api/resume/analyze` → Gemini returns structured JSON → the React dashboard renders scores, insights, and suggestions → if the user is signed in, the analysis/application is saved to Firestore.

---

## 📁 Project Structure

```text
.
├── api/                         # Vercel serverless functions (production API)
│   ├── health.ts
│   ├── resume/
│   │   ├── upload.ts            # multipart upload + text extraction
│   │   ├── analyze.ts           # full AI resume analysis
│   │   └── targeted-analysis.ts # resume vs. job description
│   ├── cover-letter/generate.ts
│   └── jobs/match.ts
├── server/                      # Express app for local dev (mirrors /api)
│   ├── index.ts                 # app bootstrap + Vite middleware
│   ├── routes/                  # health, resume, coverLetter, jobs
│   ├── services/                # geminiService, parseFile, jobMatch (shared)
│   ├── data/jobs.ts             # static sample roles
│   └── lib/                     # ApiError, http helpers, safeJson, constants
├── src/
│   ├── components/              # common, layout, upload, dashboard, jobs,
│   │                            #   targeted, history, applications, landing
│   ├── pages/                   # Landing, Analyze, Dashboard, TargetedScan,
│   │                            #   JobMatches, History, Applications, Account
│   ├── hooks/                   # useAuth, useToast, useAnalysisHistory, …
│   ├── context/                 # AnalysisContext
│   ├── services/                # apiService, firebaseService
│   ├── types/                   # shared TypeScript types
│   ├── constants/  lib/         # routes, file limits, helpers
│   ├── firebase.ts              # Firebase init (resilient if unconfigured)
│   ├── App.tsx  main.tsx  index.css
├── firebase-applet-config.json  # public Firebase web config
├── firestore.rules              # Firestore security rules
├── server.ts                    # dev entry → server/index.ts
├── vercel.json                  # Vercel build + routing config
├── vite.config.ts
└── package.json
```

---

## ⚙️ Local Development Setup

**Prerequisites:** Node.js 20.x, npm, a Google Gemini API key, and (optionally) a Firebase project for auth/history.

```bash
# 1. Clone the repository
git clone https://github.com/la3679/ResuMatch-AI.git
cd ResuMatch-AI

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env            # then add your GEMINI_API_KEY

# 4. Start the dev server (Express API + Vite, on one origin)
npm run dev
```

The app runs at **http://localhost:3000**.

| Script | Description |
| --- | --- |
| `npm run dev` | Start the local API + frontend (http://localhost:3000) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check the project (`tsc --noEmit`) |

> **Note:** Analysis and scanning work without sign-in. Saved history and applications require a configured Firebase project.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and provide your own values. **Never commit your real `.env`.**

| Variable | Required | Scope | Notes |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | ✅ Yes | Server only | Powers all AI endpoints. |
| `GEMINI_MODEL` | Optional | Server only | Defaults to `gemini-2.0-flash`. |

```bash
# .env  (local) — server-side only
GEMINI_API_KEY=your_server_side_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
```

**Important:**

- `GEMINI_API_KEY` is **server-side only**. Do **not** prefix it with `VITE_` — a `VITE_` prefix would bundle it into the public client build.
- The browser only ever calls relative `/api/*` routes; those server functions call Gemini.
- In production, set `GEMINI_API_KEY` in **Vercel → Project → Settings → Environment Variables** (see below).

**Firebase configuration:** This project loads its Firebase **web** config from the committed `firebase-applet-config.json` file (not from `VITE_FIREBASE_*` variables). A Firebase web config is **public by design** — the `apiKey` is a client identifier, not a private secret; security is enforced by Authorized Domains and Firestore rules. To use your own Firebase project, replace the values in `firebase-applet-config.json`:

```jsonc
{
  "apiKey": "your_public_firebase_web_api_key",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project",
  "storageBucket": "your-project.firebasestorage.app",
  "messagingSenderId": "your_sender_id",
  "appId": "your_app_id",
  "measurementId": "your_measurement_id",
  "firestoreDatabaseId": "(default)"
}
```

> Do **not** commit Firebase **service-account** credentials or the Admin SDK private key — this app does not use them.

---

## 🔥 Firebase Setup

Auth and Firestore power saved history and applications. The app degrades gracefully without Firebase (analysis/scanning still work, and auth-gated pages prompt to sign in).

1. **Create a project** — [Firebase Console](https://console.firebase.google.com/) → *Add project*.
2. **Register a Web App** — Project Overview → *Add app* → *Web*, then copy the config into `firebase-applet-config.json`.
3. **Enable Google Sign-In** — *Firebase Console → Authentication → Sign-in method → Google → Enable*.
4. **Authorize your domains** — *Firebase Console → Authentication → Settings → Authorized domains → Add domain*.
   - Add your Vercel domain **without** the protocol or trailing slash:
     - ✅ Correct: `resumatch-ai-nu.vercel.app`
     - ❌ Wrong: `https://resumatch-ai-nu.vercel.app/`
   - `localhost` is authorized by default for local development.
5. **Create Firestore** — *Firebase Console → Firestore Database → Create database* (start in production mode).
6. **Publish security rules** — use the rules below (also in [`firestore.rules`](firestore.rules)).

### 🔒 Firestore Rules

These rules ensure each document can only be read or written by its owner (`userId` must match the authenticated user):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }

    match /analyses/{analysisId} {
      allow read:   if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    match /applications/{applicationId} {
      allow read:   if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## ▲ Vercel Deployment

ResuMatch AI deploys to Vercel as a static Vite frontend plus serverless functions. Configuration lives in [`vercel.json`](vercel.json).

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 20.x |

**Steps:**

1. **Connect the repo** — import the GitHub repository in the [Vercel dashboard](https://vercel.com/new). Vercel auto-detects `vercel.json`.
2. **Add the environment variable** — *Vercel → Project → Settings → Environment Variables*:
   - Name: `GEMINI_API_KEY`
   - Value: your Gemini API key
   - Environments: **Production** (and Preview if desired)
3. **Add the Vercel domain to Firebase** — Authentication → Settings → Authorized domains (e.g. `resumatch-ai-nu.vercel.app`).
4. **Deploy.** Production tracks the `main` branch — every push to `main` triggers a Production deployment.

> **Redeploy after changing environment variables.** Vercel injects env vars at build/runtime, so a new deployment is required for changes to take effect.

---

## 🧪 Troubleshooting

<details>
<summary><strong>AI features are not configured on the server (missing GEMINI_API_KEY)</strong></summary>

- Add `GEMINI_API_KEY` in **Vercel → Settings → Environment Variables**.
- Ensure it is enabled for the **Production** environment.
- **Redeploy** after adding or changing it.
- Confirm the variable name is exactly `GEMINI_API_KEY` (no `VITE_` prefix).
</details>

<details>
<summary><strong>AI returns "temporarily unavailable" / HTTP 429</strong></summary>

- The Gemini API key has exceeded its quota. Check usage in [Google AI Studio](https://aistudio.google.com/apikey).
- Enable billing on the key's Google Cloud project for higher limits, or wait for the free-tier reset.
- Optionally set `GEMINI_MODEL` to a model with available quota.
</details>

<details>
<summary><strong>Sign-in was cancelled or failed</strong></summary>

- Enable **Google** sign-in in Firebase Authentication.
- Add your Vercel domain to **Authorized domains** (without `https://` and without a trailing slash).
- Check for a browser popup blocker.
- Inspect the browser console for the Firebase Auth error code.
</details>

<details>
<summary><strong>Firestore permission denied</strong></summary>

- Make sure the user is signed in.
- Confirm the Firestore database has been created.
- Publish the recommended security rules.
- Ensure saved documents include the `userId` field matching the signed-in user.
</details>

<details>
<summary><strong>Resume upload fails</strong></summary>

- Confirm the file is a **PDF or DOCX**.
- Confirm the file size is **below 4MB** (serverless body limit).
- Check the API route logs in **Vercel → Deployments → Functions**.
</details>

---

## 📡 API Overview

All endpoints are served under `/api`. AI endpoints require a server-side `GEMINI_API_KEY`; none require user authentication (auth is handled client-side, and saved data is protected by Firestore rules).

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | No | Health check — returns `{ status, timestamp, service }`. |
| `POST` | `/api/resume/upload` | No | Accepts a PDF/DOCX upload (≤ 4MB), extracts text in memory, returns `{ filename, text, characters }`. |
| `POST` | `/api/resume/analyze` | No | Accepts `{ resumeText }`, calls Gemini, returns structured resume analysis JSON. |
| `POST` | `/api/resume/targeted-analysis` | No | Accepts `{ resumeText, jobDescription }`, returns match score, keyword gaps, and tailoring suggestions. |
| `POST` | `/api/cover-letter/generate` | No | Accepts `{ resumeText, jobDescription, companyName, jobTitle }`, returns `{ coverLetter }`. |
| `POST` | `/api/jobs/match` | No | Accepts `{ resume_skills }`, returns ranked **sample** roles with matched/missing skills. |

> **Note:** Job matches use a curated static dataset (`server/data/jobs.ts`) and are clearly presented as sample recommendations, not live listings.

---

## 🔒 Security Notes

- **Gemini key is server-side only** — it lives in environment variables and is never bundled into the client.
- **Firebase web config is public by design**, but access is controlled via **Authorized Domains** and **Firestore security rules** — both must be configured correctly.
- **Firestore rules restrict access** so users can only read and write their own `analyses` and `applications` documents.
- **Resumes are processed in memory** and are never persisted to disk or storage.
- **Full resume content is not logged** in production.
- **`.env` files are git-ignored** and must never be committed.

---

## 🗺️ Roadmap

- [ ] Real job board / job platform integration
- [ ] LinkedIn / job platform resume import
- [ ] Resume version comparison and diffing
- [ ] Multi-resume profile support
- [ ] PDF export for analysis reports
- [ ] Advanced ATS keyword ranking
- [ ] Cover letter templates
- [ ] Recruiter-facing dashboard
- [ ] Application analytics
- [ ] CI/CD pipeline improvements

---

## 💡 Skills Demonstrated

This project demonstrates:

- Full-stack **TypeScript** development (React frontend + serverless backend)
- **AI API integration** with Google Gemini and robust structured-output handling
- **Serverless deployment** on Vercel with shared service logic across runtimes
- **Firebase Authentication** and **Cloud Firestore** with user-scoped security rules
- **Secure environment variable handling** (keeping secrets server-side)
- **File upload and parsing** (PDF/DOCX, in-memory, multipart)
- **Prompt engineering** for reliable, structured AI responses
- **Responsive UI engineering** with a reusable component/design system
- **Production deployment** and debugging using build/runtime logs

---

## 👤 Author

**Built by Love Jayesh Ahir**

- GitHub: [@la3679](https://github.com/la3679)
- LinkedIn: [Love Ahir](https://www.linkedin.com/in/love-ahir-188356290/)
- Portfolio: [loveahir.com](https://loveahir.com)

---

## 📄 License

License information has not been added yet.
