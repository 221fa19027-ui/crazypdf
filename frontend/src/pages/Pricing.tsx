import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Shield, Zap } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Simple, Transparent Plans
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Everything you need for everyday document workflows, plus expanded limits for high-volume teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Community Free
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-400 font-semibold">/ forever</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Ideal for individuals, students, and everyday file tasks.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Access to all 34 PDF conversion & editing tools</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>50 MB maximum file size</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Full Zero Permanent Storage guarantee (60 min cleanup)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Google OAuth fast single sign-on</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Basic AI Summaries & Chat queries</span>
              </li>
            </ul>
          </div>

          <Link
            to="/tools"
            className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold text-xs text-center transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-b from-brand-900 to-slate-900 text-white shadow-2xl space-y-6 flex flex-col justify-between border-2 border-brand-500/50">
          <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-electric-500 text-slate-900 shadow">
            Recommended
          </div>

          <div className="space-y-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-brand-300 border border-brand-400/20">
                CrazyPDF Pro
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$9</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                For power users, legal teams, and developers needing higher volume.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-electric-400 flex-shrink-0" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-electric-400 flex-shrink-0" />
                <span>Unlimited batch uploads (up to 200 MB per file)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-electric-400 flex-shrink-0" />
                <span>Priority high-speed GPU / OCR queue processing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-electric-400 flex-shrink-0" />
                <span>Unlimited conversational AI queries with document citations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-electric-400 flex-shrink-0" />
                <span>Immediate manual "Purge Now" shredding toggle</span>
              </li>
            </ul>
          </div>

          <Link
            to="/login"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-electric-500 hover:opacity-90 text-white font-extrabold text-xs text-center shadow-lg transition-all"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
};
