import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
// @ts-ignore
import pdf from "pdf-parse";
import mammoth from "mammoth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

// Extend Request type for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Mock data
const MOCK_JOBS = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"], description: "Building modern web applications with React." },
  { id: 2, title: "Backend Developer", company: "DataSystems", skills: ["Python", "FastAPI", "PostgreSQL", "Docker"], description: "Designing scalable APIs and microservices." },
  { id: 3, title: "Full Stack Engineer", company: "CloudNine", skills: ["React", "Node.js", "MongoDB", "AWS"], description: "End-to-end development of cloud-native apps." },
  { id: 4, title: "Data Analyst", company: "InsightCo", skills: ["Python", "SQL", "Pandas", "Tableau"], description: "Extracting insights from complex datasets." },
  { id: 5, title: "ML Engineer", company: "AI Labs", skills: ["Python", "PyTorch", "Scikit-learn", "NLP"], description: "Developing and deploying machine learning models." },
  { id: 6, title: "DevOps Engineer", company: "OpsWorks", skills: ["Kubernetes", "Terraform", "CI/CD", "Linux"], description: "Automating infrastructure and deployments." },
  { id: 7, title: "UI/UX Designer", company: "CreativeFlow", skills: ["Figma", "Adobe XD", "Prototyping", "User Research"], description: "Designing intuitive user experiences." },
  { id: 8, title: "Mobile Developer", company: "AppGenius", skills: ["React Native", "Swift", "Kotlin", "Firebase"], description: "Building cross-platform mobile apps." },
  { id: 9, title: "Security Analyst", company: "SecureNet", skills: ["Cybersecurity", "Penetration Testing", "Network Security"], description: "Protecting systems from cyber threats." },
  { id: 10, title: "Product Manager", company: "StrategyHub", skills: ["Agile", "Roadmapping", "Stakeholder Management", "Jira"], description: "Leading product development lifecycle." }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  // Resume upload and text extraction
  app.post("/api/v1/resume/upload", upload.single("file"), async (req: MulterRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const extension = req.file.originalname.split(".").pop()?.toLowerCase();
    let text = "";

    try {
      if (extension === "pdf") {
        const data = await pdf(req.file.buffer);
        text = data.text;
      } else if (extension === "docx") {
        const data = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = data.value;
      } else {
        return res.status(400).json({ error: "Unsupported file format. Please upload PDF or DOCX." });
      }

      if (!text.trim()) {
        return res.status(400).json({ error: "Resume appears to be empty or unreadable." });
      }

      res.json({ text, filename: req.file.originalname });
    } catch (error) {
      console.error("Extraction error:", error);
      res.status(500).json({ error: "Error extracting text from file" });
    }
  });

  // Job matching
  app.post("/api/v1/jobs/match", (req, res) => {
    const { resume_skills } = req.body;
    if (!resume_skills || !Array.isArray(resume_skills)) {
      return res.status(400).json({ error: "Invalid skills data" });
    }

    const normalizedResumeSkills = resume_skills.map(s => s.toLowerCase());
    const matches = MOCK_JOBS.map(job => {
      const jobSkills = job.skills.map(s => s.toLowerCase());
      const commonSkills = normalizedResumeSkills.filter(s => jobSkills.includes(s));
      const missingSkills = job.skills.filter(s => !normalizedResumeSkills.includes(s.toLowerCase()));
      
      const matchPercentage = (commonSkills.length / jobSkills.length) * 100;
      
      return {
        job,
        match_percentage: parseFloat(matchPercentage.toFixed(1)),
        missing_skills: missingSkills
      };
    });

    matches.sort((a, b) => b.match_percentage - a.match_percentage);
    res.json(matches.slice(0, 5));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
