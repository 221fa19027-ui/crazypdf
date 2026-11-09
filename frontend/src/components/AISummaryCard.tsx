import React from 'react';
import { Sparkles, CheckCircle, Key, FileText, ArrowDownToLine } from 'lucide-react';

interface AISummaryCardProps {
  data: {
    short_summary: string;
    detailed_summary: string;
    main_points: string[];
    important_terms: string[];
    action_items: string[];
    word_count?: number;
    page_count?: number;
  };
  onDownloadReport?: () => void;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ data, onDownloadReport }) => {
  return (
    <div className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-brand-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">AI Executive Synthesis</h3>
            <p className="text-xs text-slate-400">
              {data.page_count ? `${data.page_count} pages • ` : ''}
              {data.word_count ? `${data.word_count.toLocaleString()} words analyzed` : 'Deep document comprehension'}
            </p>
          </div>
        </div>

        {onDownloadReport && (
          <button
            onClick={onDownloadReport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition-colors"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Download Summary PDF</span>
          </button>
        )}
      </div>

      {/* Short Overview */}
      <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1">
          Executive Brief
        </p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {data.short_summary}
        </p>
      </div>

      {/* Main Points & Action Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Points */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Core Takeaways</span>
          </h4>
          <ul className="space-y-2">
            {data.main_points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Action Items & Next Steps</span>
          </h4>
          <ul className="space-y-2">
            {data.action_items.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Important Terms Tags */}
      {data.important_terms.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" />
            <span>Key Concepts & Entities</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {data.important_terms.map((term, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
