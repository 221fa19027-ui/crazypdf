import React from 'react';
import { Sparkles, ShieldCheck, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          About CrazyPDF
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          We believe document productivity should be lightning-fast, crazy-simple, and 100% private.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p>
            Millions of people work with PDFs every single day: students compiling coursework, developers extracting data tables, lawyers reviewing sensitive non-disclosure agreements, and accountants reconciling invoices.
          </p>
          <p>
            Yet traditional desktop tools are notoriously expensive or bloated, while existing free web tools often monetize by silently keeping user files or injecting spammy advertisements.
          </p>
          <p>
            CrazyPDF was created to provide a refreshingly modern alternative. We combine the speed and simplicity of modern web engineering with an uncompromising commitment to privacy: <strong>Zero permanent document retention</strong>, seamless Google OAuth login, and high-precision tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Zap className="w-6 h-6 text-brand-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Crazy Fast</h3>
            <p className="text-xs text-slate-500">
              C-backed high performance libraries deliver instantaneous processing.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Zero Storage</h3>
            <p className="text-xs text-slate-500">
              Ephemeral sandboxes that automatically purge all documents in 60 minutes.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Modern AI</h3>
            <p className="text-xs text-slate-500">
              Summarize, query, and translate documents with verifiable citations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
