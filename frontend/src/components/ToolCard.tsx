import React from 'react';
import { Link } from 'react-router-dom';
import type { ToolDefinition } from '../types/tools';
import { DynamicIcon } from './DynamicIcon';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  variant?: 'compact' | 'featured' | 'default';
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; ring: string }> = {
  organize: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'group-hover:border-indigo-400 dark:group-hover:border-indigo-500/60',
  },
  optimize: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'group-hover:border-emerald-400 dark:group-hover:border-emerald-500/60',
  },
  'convert-from': {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    ring: 'group-hover:border-blue-400 dark:group-hover:border-blue-500/60',
  },
  'convert-to': {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-600 dark:text-sky-400',
    ring: 'group-hover:border-sky-400 dark:group-hover:border-sky-500/60',
  },
  edit: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'group-hover:border-violet-400 dark:group-hover:border-violet-500/60',
  },
  security: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'group-hover:border-rose-400 dark:group-hover:border-rose-500/60',
  },
  ai: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-600 dark:text-purple-400',
    ring: 'group-hover:border-purple-400 dark:group-hover:border-purple-500/60',
  },
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, variant = 'default' }) => {
  const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.organize;

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lg ${catStyle.ring}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${catStyle.bg} ${catStyle.text} transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105`}
          >
            <DynamicIcon name={tool.iconName} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isPopular && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                Popular
              </span>
            )}

            {tool.category === 'ai' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                <Sparkles className="w-3 h-3 text-purple-500" />
                AI
              </span>
            )}
          </div>
        </div>

        <h3
          className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-electric-400 transition-colors duration-200"
          style={{ textWrap: 'balance' }}
        >
          {tool.title}
        </h3>
        <p
          className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2"
          style={{ textWrap: 'pretty' }}
        >
          {tool.shortDesc}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#272727] flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-electric-400 transition-colors duration-200">
        <span>Open tool</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
      </div>
    </Link>
  );
};
