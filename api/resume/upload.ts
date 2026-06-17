import type { VercelRequest, VercelResponse } from '@vercel/node';
import Busboy from 'busboy';
import { handlePreflight, sendError, fail } from '../../server/lib/http';
import { ApiError } from '../../server/lib/ApiError';
import { extractResumeText } from '../../server/services/parseFile';
import {
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_LABEL,
} from '../../server/lib/constants';

// Disable Vercel's body parser so we can read the multipart stream ourselves.
export const config = { api: { bodyParser: false } };

interface ParsedUpload {
  filename: string;
  buffer: Buffer;
}

/** Parse a single uploaded file from a multipart/form-data request in memory. */
function parseUpload(req: VercelRequest): Promise<ParsedUpload> {
  return new Promise((resolve, reject) => {
    let busboy: ReturnType<typeof Busboy>;
    try {
      busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
      });
    } catch {
      reject(new ApiError(400, 'Expected a multipart/form-data upload.'));
      return;
    }

    const chunks: Buffer[] = [];
    let filename = '';
    let received = false;
    let tooLarge = false;

    busboy.on('file', (_field, stream, info) => {
      received = true;
      filename = info.filename ?? '';
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('limit', () => {
        tooLarge = true;
        stream.resume();
      });
    });
    busboy.on('error', (err) => reject(err));
    busboy.on('close', () => {
      if (tooLarge) {
        reject(new ApiError(400, `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`));
      } else if (!received || !filename) {
        reject(new ApiError(400, 'No file uploaded.'));
      } else {
        resolve({ filename, buffer: Buffer.concat(chunks) });
      }
    });

    req.pipe(busboy);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed.');

  try {
    const { filename, buffer } = await parseUpload(req);

    if (buffer.length === 0) {
      throw new ApiError(400, 'That file appears to be empty. Please choose another.');
    }
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext || !(ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)) {
      throw new ApiError(400, 'Unsupported file format. Please upload a PDF or DOCX file.');
    }

    const text = await extractResumeText(buffer, filename);
    res.status(200).json({ filename, text, characters: text.length });
  } catch (err) {
    fail(res, err);
  }
}
