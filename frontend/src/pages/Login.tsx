import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-electric-500 p-0.5 shadow-md shadow-brand-500/20 flex items-center justify-center">
          <img src="/logo.svg" alt="CrazyPDF" className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          No Login Required
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          CrazyPDF operates with zero accounts, passwords, or personal credentials. Every single tool is completely open and free to use immediately.
        </p>
      </div>

      {/* Benefits Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] space-y-4 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-electric-400">
          Privacy-First Architecture
        </h2>
        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Zero personal information or email addresses collected</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>All thirty-four tools accessible with no barriers</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Automated 60-minute shredder purges all files permanently</span>
          </li>
        </ul>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/tools')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-sm transition-all duration-200"
          >
            <Zap className="w-4 h-4" />
            <span>Start Using CrazyPDF Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="text-xs font-medium text-slate-500 hover:text-brand-600 dark:hover:text-electric-400 transition-colors"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
};
