import { useState, useRef, useCallback } from 'react';
import * as aiApi from '../../api/ai.api';

const MAX_SIZE = 5 * 1024 * 1024;

export default function ResumeUploader({ onUploadComplete }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const validate = useCallback((f) => {
    if (!f) return 'No file selected';
    if (f.type !== 'application/pdf') return 'Only PDF files are allowed';
    if (f.size > MAX_SIZE) return 'File too large — max 5MB';
    return null;
  }, []);

  async function handleFile(f) {
    const err = validate(f);
    if (err) { setError(err); return; }

    setError('');
    setFile(f);
    setUploading(true);
    setProgress(0);

    try {
      const data = await aiApi.uploadResume(f, (pct) => setProgress(pct));
      setResult(data);
      onUploadComplete?.(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleInputChange(e) {
    const f = e.target.files[0];
    if (f) handleFile(f);
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setProgress(0);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  const skills = result?.extractedData?.extractedSkills || [];

  return (
    <div className="space-y-4">
      {!result ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 cursor-pointer transition ${
            dragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-surface-300 dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-500 bg-white dark:bg-surface-900'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          <svg className="h-10 w-10 text-surface-400 dark:text-surface-500 mb-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>

          <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
            {dragOver ? 'Drop your PDF here' : 'Drag & drop your resume, or click to browse'}
          </p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">PDF only, max 5MB</p>

          {file && (
            <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
              Selected: {file.name}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
              Resume Analyzed
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500"
            >
              Upload different
            </button>
          </div>

          {skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">
                Extracted Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/40 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
