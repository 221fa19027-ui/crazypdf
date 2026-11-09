import React, { useRef, useState } from 'react';
import { Upload, FileText, Trash2, Shield, Plus, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  acceptedFileTypes: string[];
  maxFiles?: number;
  multiple?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onFilesChange,
  acceptedFileTypes,
  maxFiles = 10,
  multiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    setError(null);
    const validFiles: File[] = [];

    Array.from(newFiles).forEach((file) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAccepted = acceptedFileTypes.some((type) => {
        if (type.startsWith('.')) return ext === type.toLowerCase();
        return file.type.includes(type);
      });

      if (!isAccepted) {
        setError(`File '${file.name}' is not an accepted format (${acceptedFileTypes.join(', ')}).`);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError(`File '${file.name}' exceeds maximum 50 MB limit.`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      if (!multiple) {
        onFilesChange([validFiles[0]]);
      } else {
        const combined = [...files, ...validFiles].slice(0, maxFiles);
        onFilesChange(combined);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 hover:border-brand-500/70 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50/80 dark:hover:bg-slate-900/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          multiple={multiple}
          onChange={(e) => e.target.files && validateAndAddFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-electric-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/25">
            <Upload className="w-8 h-8 animate-bounce-slow" />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              Drop your files here, or <span className="text-brand-600 dark:text-electric-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Supports {acceptedFileTypes.join(', ')} • Max {maxFiles} {maxFiles === 1 ? 'file' : 'files'} (up to 50MB each)
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
            <Shield className="w-3.5 h-3.5" />
            <span>End-to-end ephemeral: 100% auto-deleted within 60 minutes</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            <span>Selected Documents ({files.length})</span>
            {multiple && files.length < maxFiles && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-brand-600 dark:text-electric-400 hover:underline flex items-center gap-1 font-semibold normal-case"
              >
                <Plus className="w-3.5 h-3.5" /> Add more files
              </button>
            )}
          </div>

          <div className="grid gap-2">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
