import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_TOOLS } from '../types/tools';
import { FileUploader } from '../components/FileUploader';
import { ToolOptionsPanel } from '../components/ToolOptionsPanel';
import { JobProgress, type JobState } from '../components/JobProgress';
import { PDFCanvasEditor } from '../components/PDFCanvasEditor';
import { ChatPDFViewer } from '../components/ChatPDFViewer';
import { CompareViewer } from '../components/CompareViewer';
import { AISummaryCard } from '../components/AISummaryCard';
import { DynamicIcon } from '../components/DynamicIcon';
import { api, type ProcessResponse } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Download, RotateCcw, ArrowRight, ShieldCheck, 
  Sparkles, FileText, CheckCircle2, Clock 
} from 'lucide-react';

export const ToolDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = ALL_TOOLS.find((t) => t.slug === slug);

  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, any>>({});
  const [jobState, setJobState] = useState<JobState>('waiting');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!tool) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Tool Not Found</h2>
        <p className="text-sm text-slate-500">The requested tool '{slug}' does not exist.</p>
        <Link to="/tools" className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs">
          Browse All Tools
        </Link>
      </div>
    );
  }

  const handleProcess = async () => {
    if (files.length === 0 && !(tool.slug === 'html-to-pdf' && options.url)) {
      setErrorMessage('Please select a file to process.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setJobState('uploading');

    try {
      // Simulate validation stage smoothly
      setTimeout(() => setJobState('validating'), 400);
      setTimeout(() => setJobState('processing'), 900);

      const response = await api.processTool(tool.slug, files, options);
      
      setJobState('finalizing');
      setTimeout(() => {
        setJobState('completed');
        setResult(response);
        setIsProcessing(false);
        try {
          confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
        } catch {}
      }, 500);

    } catch (err: any) {
      setJobState('failed');
      setIsProcessing(false);
      setErrorMessage(err.message || 'An error occurred during document processing.');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setOptions({});
    setResult(null);
    setJobState('waiting');
    setErrorMessage(null);
  };

  const handleChatQuery = async (question: string) => {
    const res = await api.processTool('chat-with-pdf', files, { question });
    return res.extra_data || { answer: 'No answer found.' };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-electric-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All PDF Tools</span>
        </Link>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/50">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Permanent Storage</span>
        </div>
      </div>

      {/* Tool Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 shadow-sm">
            <DynamicIcon name={tool.iconName} className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {tool.title}
              </h1>
              {tool.category === 'ai' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                  AI
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              {tool.fullDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      {!result ? (
        <div className="space-y-6">
          {/* File Uploader */}
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            acceptedFileTypes={tool.acceptedFileTypes}
            maxFiles={tool.maxFiles}
            multiple={tool.maxFiles > 1}
          />

          {/* Interactive PDF Canvas Viewer for Edit / Annotation */}
          {files.length > 0 && tool.slug === 'edit-pdf' && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Document Canvas Annotation
              </p>
              <PDFCanvasEditor
                file={files[0]}
                onAnnotationsChange={(annots) => setOptions({ ...options, annotations: annots })}
              />
            </div>
          )}

          {/* Tool Specific Options Panel */}
          <ToolOptionsPanel
            toolSlug={tool.slug}
            options={options}
            onOptionsChange={setOptions}
          />

          {/* Processing Progress Bar when active or failed */}
          {isProcessing && (
            <JobProgress
              state={jobState}
              toolName={tool.title}
              errorMessage={errorMessage || undefined}
            />
          )}

          {/* Action Trigger Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleProcess}
              disabled={isProcessing || (files.length === 0 && !(tool.slug === 'html-to-pdf' && options.url))}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Process {tool.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Result & Download Section */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Document Ready!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Processed cleanly in {result.processing_time}s • Output size: {(result.output_file_size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {/* Specialized Results Viewers */}
            {tool.slug === 'compare-pdf' && result.extra_data && (
              <CompareViewer comparisonData={result.extra_data} />
            )}

            {tool.slug === 'ai-summarizer' && result.extra_data && (
              <AISummaryCard
                data={result.extra_data}
                onDownloadReport={() => window.open(api.getDownloadUrl(result.download_url), '_blank')}
              />
            )}

            {tool.slug === 'chat-with-pdf' && files.length > 0 && (
              <ChatPDFViewer fileName={files[0].name} onSendQuery={handleChatQuery} />
            )}

            {/* Download Buttons Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{result.output_filename}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Download token active for 60 minutes</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Process Another</span>
                </button>

                <a
                  href={api.getDownloadUrl(result.download_url)}
                  download={result.output_filename}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
