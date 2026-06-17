import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { env, isProduction } from './env';
import { errorHandler } from './lib/errors';
import healthRouter from './routes/health';
import resumeRouter from './routes/resume';
import coverLetterRouter from './routes/coverLetter';
import jobsRouter from './routes/jobs';

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '2mb' }));

  // --- API routes (mirror the Vercel /api/* function paths for local dev) ---
  app.use('/api/health', healthRouter);
  app.use('/api/resume', resumeRouter);
  app.use('/api/cover-letter', coverLetterRouter);
  app.use('/api/jobs', jobsRouter);

  // Unknown API routes return JSON 404 (never the SPA shell).
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  // --- Frontend (Vite dev middleware / static dist) ---
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Centralized error handler (must be last).
  app.use(errorHandler);

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`ResuMatch AI server running on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
