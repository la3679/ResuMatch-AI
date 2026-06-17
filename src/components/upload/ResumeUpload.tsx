import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react';
import {
  ACCEPTED_FILE_EXTENSIONS,
  FILE_INPUT_ACCEPT,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_LABEL,
} from '../../constants';
import { cn } from '../../lib/utils';

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  /** Optional status text shown under the spinner while loading. */
  loadingLabel?: string;
}

function extensionOf(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx === -1 ? '' : name.slice(idx).toLowerCase();
}

/** Accessible drag-and-drop resume uploader supporting PDF and DOCX. */
export function ResumeUpload({ onUpload, isLoading = false, loadingLabel }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): string | null => {
    const ext = extensionOf(file.name);
    if (!(ACCEPTED_FILE_EXTENSIONS as readonly string[]).includes(ext)) {
      return `Unsupported file type. Please upload a ${ACCEPTED_FILE_EXTENSIONS.join(' or ')} file.`;
    }
    if (file.size === 0) {
      return 'That file appears to be empty. Please choose another.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      onUpload(file);
    },
    [onUpload, validate],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (isLoading) return;
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile, isLoading],
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isLoading) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload your resume"
        aria-disabled={isLoading}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 sm:p-12 transition-all cursor-pointer text-center',
          isDragging
            ? 'border-brand-500 bg-brand-50/60'
            : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50',
          isLoading && 'opacity-70 pointer-events-none',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={FILE_INPUT_ACCEPT}
          onChange={onChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center gap-4">
          <span
            className={cn(
              'p-4 rounded-2xl bg-brand-50 text-brand-600 transition-transform',
              isDragging && 'scale-110',
            )}
          >
            {isLoading ? (
              <Loader2 className="w-9 h-9 animate-spin" />
            ) : (
              <UploadCloud className="w-9 h-9" />
            )}
          </span>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isLoading ? loadingLabel ?? 'Processing your resume…' : 'Upload your resume'}
            </h3>
            <p className="text-slate-500 mt-1 text-sm">
              {isLoading
                ? 'This usually takes a few seconds.'
                : 'Drag & drop, or click to browse'}
            </p>
          </div>

          {!isLoading && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" /> PDF or DOCX
              </span>
              <span aria-hidden>·</span>
              <span>Max {MAX_FILE_SIZE_LABEL}</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            role="alert"
            className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
