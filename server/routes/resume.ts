import { Router, type Request } from 'express';
import multer from 'multer';
import { asyncHandler } from '../lib/asyncHandler';
import { ApiError } from '../lib/errors';
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../lib/constants';
import { extractResumeText } from '../services/parseFile';
import { analyzeResume, analyzeResumeAgainstJob } from '../services/geminiService';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (ext && (ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Unsupported file format. Please upload a PDF or DOCX file.'));
    }
  },
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/** Validates that a field is a non-empty string. */
function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError(400, `"${field}" is required.`);
  }
  return value;
}

// POST /api/v1/resume/upload — extract text from a PDF/DOCX upload.
router.post(
  '/upload',
  upload.single('file'),
  asyncHandler(async (req: MulterRequest, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded.');
    const text = await extractResumeText(req.file.buffer, req.file.originalname);
    res.json({ filename: req.file.originalname, text, characters: text.length });
  }),
);

// POST /api/v1/resume/analyze — full AI resume analysis.
router.post(
  '/analyze',
  asyncHandler(async (req, res) => {
    const resumeText = requireString(req.body?.resumeText, 'resumeText');
    res.json(await analyzeResume(resumeText));
  }),
);

// POST /api/v1/resume/targeted-analysis — compare resume vs job description.
router.post(
  '/targeted-analysis',
  asyncHandler(async (req, res) => {
    const resumeText = requireString(req.body?.resumeText, 'resumeText');
    const jobDescription = requireString(req.body?.jobDescription, 'jobDescription');
    res.json(await analyzeResumeAgainstJob(resumeText, jobDescription));
  }),
);

export default router;
