import React from 'react';
import { Loader2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export type JobState = 'waiting' | 'uploading' | 'validating' | 'processing' | 'finalizing' | 'completed' | 'failed';

interface JobProgressProps {
  state: JobState;
  toolName?: string;
  errorMessage?: string;
}

export const JobProgress: React.FC<JobProgressProps> = ({ state, toolName, errorMessage }) => {
  const getStageInfo = () => {
    switch (state) {
      case 'waiting':
        return { label: 'Waiting for upload...', progress: 15, icon: Clock, color: 'text-slate-500' };
      case 'uploading':
        return { label: 'Securing and uploading document...', progress: 35, icon: Loader2, color: 'text-brand-500' };
      case 'validating':
        return { label: 'Validating PDF integrity and security...', progress: 55, icon: Loader2, color: 'text-brand-500' };
      case 'processing':
        return { label: `Processing document with ${toolName || 'tool'}...`, progress: 75, icon: Loader2, color: 'text-electric-500' };
      case 'finalizing':
        return { label: 'Finalizing output and generating download token...', progress: 92, icon: Loader2, color: 'text-electric-500' };
      case 'completed':
        return { label: 'Task completed successfully!', progress: 100, icon: CheckCircle2, color: 'text-emerald-500' };
      case 'failed':
        return { label: errorMessage || 'Processing failed. Please try again.', progress: 100, icon: AlertTriangle, color: 'text-red-500' };
    }
  };

  const info = getStageInfo();
  const Icon = info.icon;
  const isSpinning = ['uploading', 'validating', 'processing', 'finalizing'].includes(state);

  return (
    <div className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 ${info.color}`}>
            <Icon className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{state}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{info.label}</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          {info.progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            state === 'failed'
              ? 'bg-red-500'
              : state === 'completed'
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-brand-600 to-electric-500'
          }`}
          style={{ width: `${info.progress}%` }}
        />
      </div>
    </div>
  );
};
