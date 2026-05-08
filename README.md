# ResuMatch AI

ResuMatch AI is a powerful, full-stack career optimization platform designed to help professional candidates navigate the modern job market. By leveraging advanced language models and real-time data processing, the platform provides deep insights into resume performance, ATS (Applicant Tracking System) compatibility, and strategic job matching.

## 🚀 Key Features

### 1. **Intelligent Resume Analysis**
- **ATS Scoring**: Get an instant compatibility score based on industry-standard parsing algorithms.
- **Section Breakdown**: Granular feedback on skills, experience, and project descriptions.
- **Keyword Optimization**: Identify missing industry-specific keywords that recruiters look for.

### 2. **Targeted Job Scan**
- **Deep Alignment**: Paste any job description to perform a side-by-side analysis with your resume.
- **Line-by-Line Scanning**: A specialized visual engine that analyzes your resume's content against job requirements in real-time.
- **Actionable Insights**: Specific suggestions on what to add or remove to maximize your match percentage.

### 3. **AI Cover Letter Generator**
- **Personalized Content**: Automatically generate professional cover letters tailored to specific roles and company cultures.
- **Built-in Editor**: Refine and customize your generated documents before final export.
- **Context Awareness**: Integrates your extracted skills directly into the narrative of the application.

### 4. **Smart Job Matching**
- **Skill-Based Recommendations**: Find open roles that align with your professional background and technical toolkit.
- **Gap Analysis**: Understanding what skills you need to acquire to qualify for your dream roles.

### 5. **Application Management**
- **Cloud History**: Securely save all your analyses and documents using Firebase.
- **Tracking System**: Monitor your application progress across multiple companies and roles.

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Identity & Data**: [Firebase Auth](https://firebase.google.com/products/auth), [Cloud Firestore](https://firebase.google.com/products/firestore)
- **AI Intelligence**: [Google Gemini Pro API](https://ai.google.dev/)
- **File Engineering**: [Mammoth.js](https://github.com/mwilliamson/mammoth.js), [pdf-parse](https://www.npmjs.com/package/pdf-parse)

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Firebase project
- A Google AI Studio API Key (for Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resumatch-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   # Add other required environment variables from .env.example
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 🏗 Architecture

The platform follows a modern full-stack architecture:
- **Client**: A responsive Single Page Application (SPA) built with React and Tailwind CSS.
- **Server**: An Express.js middleware server that proxies AI requests and handles file processing (parsing PDF/DOCX).
- **Security**: Server-side processing ensures that API keys remain hidden from the client.
- **Database**: Real-time synchronization for user history and application data via Firebase.

## 🔐 Security & Privacy

ResuMatch AI is built with data security as a priority:
- **Firebase Authentication**: Ensures your personal data and resume history are only accessible to you.
- **Privacy-First Parsing**: Resume text is processed in-memory and never stored long-term without your explicit consent.
- **Secure Integration**: Third-party API interactions are handled strictly through the backend gateway.

---

*Transform your job search strategy with data-driven insights.*
