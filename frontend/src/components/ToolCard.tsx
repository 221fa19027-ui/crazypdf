import React from 'react';
import { Link } from 'react-router-dom';
import type { ToolDefinition } from '../types/tools';
import { DynamicIcon } from './DynamicIcon';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  variant?: 'compact' | 'featured' | 'default';
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  organize: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'hover:border-indigo-500/40' },
  optimize: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'hover:border-emerald-500/40' },
  'convert-from': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'hover:border-blue-500/40' },
  'convert-to': { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400', border: 'hover:border-cyan-500/40' },
  edit: { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400', border: 'hover:border-violet-500/40' },
  security: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', border: 'hover:border-rose-500/40' },
  ai: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'hover:border-purple-500/40' },
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, variant = 'default' }) => {
  const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.organize;

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ${catStyle.border}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${catStyle.bg} ${catStyle.text} transition-transform group-hover:scale-110 duration-200`}>
            <DynamicIcon name={tool.iconName} className="w-6 h-6" />
          </div>

          {tool.isPopular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50">
              Popular
            </span>
          )}

          {tool.category === 'ai' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-electric-400 transition-colors">
          {tool.title}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.shortDesc}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-brand-600 dark:group-hover:text-electric-400 transition-colors">
        <span>Use tool</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
