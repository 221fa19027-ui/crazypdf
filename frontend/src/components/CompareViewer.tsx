import React from 'react';
import { GitCompare, PlusCircle, MinusCircle, FileText } from 'lucide-react';

interface CompareViewerProps {
  comparisonData: {
    pages_a: number;
    pages_b: number;
    added_count: number;
    removed_count: number;
    diff_sample: string[];
  };
}

export const CompareViewer: React.FC<CompareViewerProps> = ({ comparisonData }) => {
  return (
    <div className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Document Comparison Analysis</h3>
            <p className="text-xs text-slate-400">Side-by-side textual differential inspection</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <PlusCircle className="w-4 h-4" />
            <span>+{comparisonData.added_count} Added</span>
          </div>
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800">
            <MinusCircle className="w-4 h-4" />
            <span>-{comparisonData.removed_count} Removed</span>
          </div>
        </div>
      </div>

      {/* Pages statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Document A (Original)</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{comparisonData.pages_a} Pages</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-electric-500" />
            <span>Document B (Modified)</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{comparisonData.pages_b} Pages</span>
        </div>
      </div>

      {/* Diff Box */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Changes Log</p>
        <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-72 space-y-1">
          {comparisonData.diff_sample.length > 0 ? (
            comparisonData.diff_sample.map((line, idx) => {
              const isAdded = line.startsWith('+') && !line.startsWith('+++');
              const isRemoved = line.startsWith('-') && !line.startsWith('---');
              return (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded ${
                    isAdded ? 'bg-emerald-950/80 text-emerald-400' : isRemoved ? 'bg-rose-950/80 text-rose-400' : 'text-slate-400'
                  }`}
                >
                  {line}
                </div>
              );
            })
          ) : (
            <div className="text-slate-500 italic">No text discrepancies detected between the two files.</div>
          )}
        </div>
      </div>
    </div>
  );
};
