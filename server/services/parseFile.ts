import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';
import { ApiError } from '../lib/ApiError.js';

/**
 * Extracts plain text from an uploaded PDF or DOCX buffer.
 * Throws a client-safe {@link ApiError} for unsupported, unreadable, or
 * empty files.
 */
export async function extractResumeText(buffer: Buffer, originalName: string): Promise<string> {
  const ext = originalName.split('.').pop()?.toLowerCase();
  let text = '';

  try {
    if (ext === 'pdf') {
      // unpdf is a serverless-friendly pdfjs build with no native dependencies.
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const result = await extractText(pdf, { mergePages: true });
      text = Array.isArray(result.text) ? result.text.join('\n') : result.text;
    } else if (ext === 'docx') {
      const data = await mammoth.extractRawText({ buffer });
      text = data.value ?? '';
    } else {
      throw new ApiError(400, 'Unsupported file format. Please upload a PDF or DOCX file.');
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      422,
      'We could not read text from this file. It may be scanned, image-based, or corrupted.',
    );
  }

  if (!text.trim()) {
    throw new ApiError(422, 'Your resume appears to be empty or unreadable.');
  }

  return text;
}
